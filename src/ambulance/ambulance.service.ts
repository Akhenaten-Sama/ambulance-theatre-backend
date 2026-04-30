import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ambulance } from './ambulance.entity';
import { User } from '../user/user.entity';
import { CreateAmbulanceDto } from './dto/create-ambulance.dto';
import { AmbulanceStatus, AmbulanceType } from '../common/enums';
import { toPostGISPoint } from '../common/utils';

@Injectable()
export class AmbulanceService {
  constructor(
    @InjectRepository(Ambulance)
    private ambulanceRepo: Repository<Ambulance>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(dto: CreateAmbulanceDto) {
    const driver = await this.userRepo.findOne({ where: { id: dto.driverId, role: 'driver' } });
    if (!driver) throw new NotFoundException('Driver not found');

    const ambulance = this.ambulanceRepo.create({
      ...dto,
      driver,
      current_location: toPostGISPoint(dto.longitude, dto.latitude),
      status: dto.status || AmbulanceStatus.AVAILABLE,
      location_history: [
        {
          coordinates: { lat: dto.latitude, lng: dto.longitude },
          timestamp: new Date(),
          speed: 0,
        },
      ],
    });
    return this.ambulanceRepo.save(ambulance);
  }

  async findAll() {
    return this.ambulanceRepo.find({ relations: ['driver'] });
  }

  async findById(id: string) {
    const ambulance = await this.ambulanceRepo.findOne({
      where: { id },
      relations: ['driver'],
    });
    if (!ambulance) throw new NotFoundException('Ambulance not found');
    return ambulance;
  }

  async findAllAvailableNearby(lat: number, lng: number, radiusKm = 10) {
    // Use PostGIS for spatial queries
    return this.ambulanceRepo
      .createQueryBuilder('ambulance')
      .leftJoinAndSelect('ambulance.driver', 'driver')
      .where('ambulance.status = :status', { status: AmbulanceStatus.AVAILABLE })
      .andWhere(
        `ST_DWithin(
          ambulance.current_location::geography,
          ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography,
          :radius
        )`,
        { lat, lng, radius: radiusKm * 1000 }, // meters
      )
      .addSelect(
        `ST_Distance(
          ambulance.current_location::geography,
          ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography
        )`,
        'distance',
      )
      .orderBy('distance', 'ASC')
      .getMany();
  }

  async updateLocation(id: string, latitude: number, longitude: number, speed?: number) {
    const ambulance = await this.findById(id);

    const locationHistory = ambulance.location_history || [];
    locationHistory.push({
      coordinates: { lat: latitude, lng: longitude },
      timestamp: new Date(),
      speed: speed || 0,
    });

    // Keep only last 100 location points
    if (locationHistory.length > 100) {
      locationHistory.shift();
    }

    await this.ambulanceRepo.update(id, {
      current_location: toPostGISPoint(longitude, latitude),
      location_history: locationHistory,
      last_maintenance_date: ambulance.last_maintenance_date, // Keep existing value
    });

    return this.findById(id);
  }

  async updateStatus(id: string, status: AmbulanceStatus) {
    const ambulance = await this.findById(id);

    // Validation logic
    if (status === AmbulanceStatus.AVAILABLE && ambulance.status === AmbulanceStatus.ON_TRIP) {
      throw new BadRequestException('Cannot mark ambulance as available while on trip');
    }

    await this.ambulanceRepo.update(id, { status });
    return this.findById(id);
  }

  async getPerformanceMetrics(id: string) {
    const ambulance = await this.findById(id);

    return {
      ambulance_id: id,
      total_trips: ambulance.total_trips,
      average_response_time: ambulance.average_response_time,
      rating: ambulance.rating,
      total_distance_covered: ambulance.total_distance_covered,
      fuel_efficiency: ambulance.fuel_efficiency,
      last_maintenance: ambulance.last_maintenance_date,
      status: ambulance.status,
    };
  }

  async incrementTrips(id: string) {
    const ambulance = await this.findById(id);
    await this.ambulanceRepo.update(id, {
      total_trips: ambulance.total_trips + 1,
    });
  }

  async updateAverageResponseTime(id: string, newResponseTime: number) {
    const ambulance = await this.findById(id);
    const totalTrips = ambulance.total_trips || 1;
    const currentAvg = ambulance.average_response_time || 0;

    const newAverage = (currentAvg * totalTrips + newResponseTime) / (totalTrips + 1);

    await this.ambulanceRepo.update(id, {
      average_response_time: Math.round(newAverage),
    });
  }
}

