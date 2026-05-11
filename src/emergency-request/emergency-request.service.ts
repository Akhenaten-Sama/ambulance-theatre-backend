import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmergencyRequest } from './emergency-request.entity';
import { Ambulance } from '../ambulance/ambulance.entity';
import { User } from '../user/user.entity';
import { Hospital } from '../hospital/hospital.entity';
import { CreateEmergencyRequestDto, UpdateEmergencyRequestDto, QueryEmergencyRequestDto } from './dto/emergency-request.dto';
import { RequestStatus, AmbulanceStatus, EmergencySeverity, EmergencyType } from '../common/enums';
import { calculateDistance, toPostGISPoint } from '../common/utils';
import { createPaginatedResponse, parsePaginationParams, getSkipValue } from '../common/utils';

@Injectable()
export class EmergencyRequestService {
  constructor(
    @InjectRepository(EmergencyRequest)
    private requestRepo: Repository<EmergencyRequest>,
    @InjectRepository(Ambulance)
    private ambulanceRepo: Repository<Ambulance>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Hospital)
    private hospitalRepo: Repository<Hospital>,
  ) {}

  private normalizeEmergencyType(raw: string): EmergencyType {
    const value = raw.trim().toLowerCase();
    const map: Record<string, EmergencyType> = {
      medical: EmergencyType.OTHER,
      trauma: EmergencyType.TRAUMA,
      accident: EmergencyType.ACCIDENT,
      stroke: EmergencyType.STROKE,
      burn: EmergencyType.BURN,
      poisoning: EmergencyType.POISONING,
      maternity: EmergencyType.MATERNITY,
      psychiatric: EmergencyType.PSYCHIATRIC,
      seizure: EmergencyType.SEIZURE,
      fracture: EmergencyType.FRACTURE,
      bleeding: EmergencyType.BLEEDING,
      unconscious: EmergencyType.UNCONSCIOUS,
      respiratory: EmergencyType.RESPIRATORY_DISTRESS,
      respiratory_distress: EmergencyType.RESPIRATORY_DISTRESS,
      cardiac: EmergencyType.CARDIAC_ARREST,
      cardiac_arrest: EmergencyType.CARDIAC_ARREST,
      allergic: EmergencyType.ALLERGIC_REACTION,
      allergic_reaction: EmergencyType.ALLERGIC_REACTION,
      other: EmergencyType.OTHER,
    };

    const normalized = map[value];
    if (!normalized) {
      throw new BadRequestException('Invalid emergency type');
    }
    return normalized;
  }

  private normalizeSeverity(raw: string): EmergencySeverity {
    const value = raw.trim().toLowerCase();
    const map: Record<string, EmergencySeverity> = {
      critical: EmergencySeverity.CRITICAL,
      high: EmergencySeverity.CRITICAL,
      urgent: EmergencySeverity.URGENT,
      medium: EmergencySeverity.URGENT,
      non_urgent: EmergencySeverity.NON_URGENT,
      low: EmergencySeverity.NON_URGENT,
      routine: EmergencySeverity.ROUTINE,
    };

    const normalized = map[value];
    if (!normalized) {
      throw new BadRequestException('Invalid emergency severity');
    }
    return normalized;
  }

  async create(userId: string, dto: CreateEmergencyRequestDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const emergencyType = this.normalizeEmergencyType(String(dto.emergency_type));
    const severity = this.normalizeSeverity(String(dto.severity));

    const pickupPoint = toPostGISPoint(dto.pickup_latitude, dto.pickup_longitude);

    const pickupAddress = dto.pickup_address || {
      city: 'Unknown',
      state: 'Unknown',
      country: 'Nigeria',
      full_address: `${dto.pickup_latitude}, ${dto.pickup_longitude}`,
    };

    let destinationPoint: string | null = null;
    let destinationHospital: Hospital | null = null;

    if (dto.destination_hospital_id) {
      destinationHospital = await this.hospitalRepo.findOne({
        where: { id: dto.destination_hospital_id },
      });
      if (destinationHospital) {
        destinationPoint = toPostGISPoint(destinationHospital.latitude, destinationHospital.longitude);
      }
    } else if (dto.destination_latitude && dto.destination_longitude) {
      destinationPoint = toPostGISPoint(dto.destination_latitude, dto.destination_longitude);
    }

    const request = this.requestRepo.create({
      patient_id: userId,
      patient_name: dto.patient_name || user.name,
      patient_phone: dto.patient_phone || user.phone_number,
      pickup_location: pickupPoint,
      pickup_latitude: dto.pickup_latitude,
      pickup_longitude: dto.pickup_longitude,
      pickup_address: pickupAddress,
      destination_hospital_id: dto.destination_hospital_id,
      destination_location: destinationPoint || undefined,
      destination_latitude: dto.destination_latitude,
      destination_longitude: dto.destination_longitude,
      emergency_type: emergencyType,
      severity,
      description: dto.description,
      patient_condition: dto.patient_condition,
      vital_signs: dto.vital_signs,
      status: RequestStatus.PENDING,
      status_history: [
        {
          status: RequestStatus.PENDING,
          timestamp: new Date(),
          notes: 'Emergency request created',
        },
      ],
    });

    const saved = await this.requestRepo.save(request);

    if (severity === EmergencySeverity.CRITICAL) {
      await this.autoDispatch(saved.id);
    }

    return this.findById(saved.id);
  }

  async findById(id: string) {
    const request = await this.requestRepo.findOne({
      where: { id },
      relations: ['patient', 'assigned_ambulance', 'assigned_driver', 'destination_hospital'],
    });

    if (!request) throw new NotFoundException('Emergency request not found');
    return request;
  }

  async findAll(query: QueryEmergencyRequestDto) {
    const { page, limit } = parsePaginationParams(query.page, query.limit);
    const skip = getSkipValue(page, limit);

    const queryBuilder = this.requestRepo
      .createQueryBuilder('request')
      .leftJoinAndSelect('request.patient', 'patient')
      .leftJoinAndSelect('request.assigned_ambulance', 'ambulance')
      .leftJoinAndSelect('request.assigned_driver', 'driver')
      .leftJoinAndSelect('request.destination_hospital', 'hospital');

    if (query.emergency_type) {
      queryBuilder.andWhere('request.emergency_type = :type', { type: query.emergency_type });
    }

    if (query.severity) {
      queryBuilder.andWhere('request.severity = :severity', { severity: query.severity });
    }

    if (query.status) {
      queryBuilder.andWhere('request.status = :status', { status: query.status });
    }

    queryBuilder
      .orderBy('request.requested_at', 'DESC')
      .skip(skip)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return createPaginatedResponse(data, page, limit, total);
  }

  async findByUserId(userId: string, query: QueryEmergencyRequestDto) {
    const { page, limit } = parsePaginationParams(query.page, query.limit);
    const skip = getSkipValue(page, limit);

    const queryBuilder = this.requestRepo
      .createQueryBuilder('request')
      .leftJoinAndSelect('request.assigned_ambulance', 'ambulance')
      .leftJoinAndSelect('request.assigned_driver', 'driver')
      .leftJoinAndSelect('request.destination_hospital', 'hospital')
      .where('request.patient_id = :userId', { userId });

    if (query.status) {
      queryBuilder.andWhere('request.status = :status', { status: query.status });
    }

    queryBuilder
      .orderBy('request.requested_at', 'DESC')
      .skip(skip)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return createPaginatedResponse(data, page, limit, total);
  }

  async findActiveRequests() {
    return this.requestRepo.find({
      where: [
        { status: RequestStatus.PENDING },
        { status: RequestStatus.DISPATCHED },
        { status: RequestStatus.EN_ROUTE },
        { status: RequestStatus.AT_SCENE },
        { status: RequestStatus.TRANSPORTING },
      ],
      relations: ['patient', 'assigned_ambulance', 'assigned_driver', 'destination_hospital'],
      order: { requested_at: 'DESC' },
    });
  }

  async update(id: string, dto: UpdateEmergencyRequestDto) {
    const request = await this.findById(id);

    if (dto.status && dto.status !== request.status) {
      const statusHistory = request.status_history || [];
      statusHistory.push({
        status: dto.status,
        timestamp: new Date(),
        notes: dto.dispatcher_notes || dto.driver_notes,
      });
      dto['status_history'] = statusHistory;

      const now = new Date();
      if (dto.status === RequestStatus.DISPATCHED) {
        dto['dispatched_at'] = now;
      } else if (dto.status === RequestStatus.AT_SCENE) {
        dto['arrived_at_scene'] = now;
        if (request.dispatched_at) {
          const responseTime = (now.getTime() - request.dispatched_at.getTime()) / (1000 * 60);
          dto['response_time'] = Math.round(responseTime * 10) / 10;
        }
      } else if (dto.status === RequestStatus.TRANSPORTING) {
        dto['departed_scene'] = now;
      } else if (dto.status === RequestStatus.ARRIVED) {
        dto['arrived_at_hospital'] = now;
        if (request.departed_scene) {
          const transportTime = (now.getTime() - request.departed_scene.getTime()) / (1000 * 60);
          dto['transport_time'] = Math.round(transportTime * 10) / 10;
        }
      } else if (dto.status === RequestStatus.COMPLETED) {
        dto['completed_at'] = now;
        const totalTime = (now.getTime() - request.requested_at.getTime()) / (1000 * 60);
        dto['total_time'] = Math.round(totalTime * 10) / 10;
      }
    }

    await this.requestRepo.update(id, dto);
    return this.findById(id);
  }

  async dispatch(id: string, ambulanceId: string) {
    const request = await this.findById(id);

    if (request.status !== RequestStatus.PENDING) {
      throw new BadRequestException('Request is not in pending status');
    }

    const ambulance = await this.ambulanceRepo.findOne({
      where: { id: ambulanceId },
      relations: ['driver'],
    });

    if (!ambulance) throw new NotFoundException('Ambulance not found');

    if (ambulance.status !== AmbulanceStatus.AVAILABLE) {
      throw new BadRequestException('Ambulance is not available');
    }

    await this.ambulanceRepo.update(ambulanceId, {
      status: AmbulanceStatus.DISPATCHED,
      available: false,
    });

    return this.update(id, {
      status: RequestStatus.DISPATCHED,
      assigned_ambulance_id: ambulanceId,
      assigned_driver_id: ambulance.current_driver_id,
    });
  }

  async autoDispatch(id: string) {
    const request = await this.findById(id);

    const nearestAmbulance = await this.findNearestAmbulance(
      request.pickup_latitude,
      request.pickup_longitude,
      request.severity,
    );

    if (nearestAmbulance) {
      await this.dispatch(id, nearestAmbulance.id);
    }

    return this.findById(id);
  }

  async findNearestAmbulance(lat: number, lng: number, severity: EmergencySeverity) {
    const ambulances = await this.ambulanceRepo
      .createQueryBuilder('ambulance')
      .leftJoinAndSelect('ambulance.driver', 'driver')
      .where('ambulance.available = :available', { available: true })
      .andWhere('ambulance.status = :status', { status: AmbulanceStatus.AVAILABLE })
      .andWhere(
        `ST_DWithin(
          ambulance.current_location::geography,
          ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography,
          50000
        )`,
        { lat, lng },
      )
      .getMany();

    if (ambulances.length === 0) return null;

    const scored = ambulances.map((ambulance) => {
      const distance = calculateDistance(
        { latitude: lat, longitude: lng },
        { latitude: ambulance.latitude, longitude: ambulance.longitude },
      );

      let score = 0;
      score += (50 - distance) * 2;
      score += ambulance.rating * 10;
      score += ambulance.has_life_support ? 20 : 0;

      if (severity === EmergencySeverity.CRITICAL && ambulance.type === 'advanced') {
        score += 30;
      }

      return { ambulance, distance, score };
    });

    scored.sort((a, b) => b.score - a.score);

    return scored[0].ambulance;
  }

  async cancel(id: string, userId: string, reason: string) {
    const request = await this.findById(id);

    if (request.patient_id !== userId) {
      throw new ForbiddenException('You can only cancel your own requests');
    }

    if ([RequestStatus.COMPLETED, RequestStatus.CANCELLED].includes(request.status)) {
      throw new BadRequestException('Request is already completed or cancelled');
    }

    if (request.assigned_ambulance_id) {
      await this.ambulanceRepo.update(request.assigned_ambulance_id, {
        status: AmbulanceStatus.AVAILABLE,
        available: true,
      });
    }

    return this.update(id, {
      status: RequestStatus.CANCELLED,
      ['cancellation_reason']: reason,
      ['cancelled_at']: new Date(),
    } as any);
  }

  async getStatistics(userId?: string) {
    const queryBuilder = this.requestRepo.createQueryBuilder('request');

    if (userId) {
      queryBuilder.where('request.patient_id = :userId', { userId });
    }

    const total = await queryBuilder.getCount();
    const completed = await queryBuilder
      .andWhere('request.status = :status', { status: RequestStatus.COMPLETED })
      .getCount();

    const avgResponseTime = await this.requestRepo
      .createQueryBuilder('request')
      .select('AVG(request.response_time)', 'avg')
      .where('request.response_time IS NOT NULL')
      .getRawOne();

    return {
      total,
      completed,
      pending: await this.requestRepo.count({ where: { status: RequestStatus.PENDING } }),
      active: await this.requestRepo.count({
        where: [
          { status: RequestStatus.DISPATCHED },
          { status: RequestStatus.EN_ROUTE },
          { status: RequestStatus.TRANSPORTING },
        ],
      }),
      cancelled: await this.requestRepo.count({ where: { status: RequestStatus.CANCELLED } }),
      average_response_time: avgResponseTime?.avg ? parseFloat(avgResponseTime.avg) : 0,
    };
  }
}
