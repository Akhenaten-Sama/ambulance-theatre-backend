import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { TheatreBooking } from './booking.entity';
import { Theatre } from '../theatre/theatre.entity';
import { Hospital } from '../hospital/hospital.entity';
import { User } from '../user/user.entity';
import { CreateBookingDto, UpdateBookingDto, QueryBookingDto } from './dto/booking.dto';
import { BookingStatus, TheatreStatus, BookingPriority } from '../common/enums';
import { createPaginatedResponse, parsePaginationParams, getSkipValue } from '../common/utils';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(TheatreBooking)
    private bookingRepo: Repository<TheatreBooking>,
    @InjectRepository(Theatre)
    private theatreRepo: Repository<Theatre>,
    @InjectRepository(Hospital)
    private hospitalRepo: Repository<Hospital>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(dto: CreateBookingDto, userId: string) {
    // Validate theatre exists
    const theatre = await this.theatreRepo.findOne({
      where: { id: dto.theatre_id },
      relations: ['hospital'],
    });
    if (!theatre) throw new NotFoundException('Theatre not found');

    // Validate hospital
    const hospital = await this.hospitalRepo.findOne({ where: { id: dto.hospital_id } });
    if (!hospital) throw new NotFoundException('Hospital not found');

    // Validate patient
    const patient = await this.userRepo.findOne({ where: { id: dto.patient_id } });
    if (!patient) throw new NotFoundException('Patient not found');

    // Validate surgeon
    const surgeon = await this.userRepo.findOne({ where: { id: dto.lead_surgeon_id } });
    if (!surgeon) throw new NotFoundException('Lead surgeon not found');

    // Check for booking conflicts
    const hasConflict = await this.checkTimeConflict(
      dto.theatre_id,
      dto.scheduled_start,
      dto.scheduled_end,
    );

    if (hasConflict) {
      throw new ConflictException('Theatre is already booked for this time slot');
    }

    // Create booking
    const booking = this.bookingRepo.create({
      ...dto,
      status: dto.priority === BookingPriority.EMERGENCY ? BookingStatus.CONFIRMED : BookingStatus.REQUESTED,
      created_by: userId,
    });

    const saved = await this.bookingRepo.save(booking);

    // Update theatre status if emergency
    if (dto.priority === BookingPriority.EMERGENCY) {
      await this.theatreRepo.update(dto.theatre_id, {
        status: TheatreStatus.RESERVED,
        available: false,
      });
    }

    return this.findById(saved.id);
  }

  async findById(id: string) {
    const booking = await this.bookingRepo.findOne({
      where: { id },
      relations: ['theatre', 'hospital', 'patient', 'lead_surgeon', 'anesthesiologist'],
    });

    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  async findAll(query: QueryBookingDto) {
    const { page, limit } = parsePaginationParams(query.page, query.limit);
    const skip = getSkipValue(page, limit);

    const queryBuilder = this.bookingRepo
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.theatre', 'theatre')
      .leftJoinAndSelect('booking.hospital', 'hospital')
      .leftJoinAndSelect('booking.patient', 'patient')
      .leftJoinAndSelect('booking.lead_surgeon', 'surgeon');

    if (query.theatre_id) {
      queryBuilder.andWhere('booking.theatre_id = :theatreId', { theatreId: query.theatre_id });
    }

    if (query.hospital_id) {
      queryBuilder.andWhere('booking.hospital_id = :hospitalId', { hospitalId: query.hospital_id });
    }

    if (query.patient_id) {
      queryBuilder.andWhere('booking.patient_id = :patientId', { patientId: query.patient_id });
    }

    if (query.status) {
      queryBuilder.andWhere('booking.status = :status', { status: query.status });
    }

    if (query.priority) {
      queryBuilder.andWhere('booking.priority = :priority', { priority: query.priority });
    }

    if (query.from_date) {
      queryBuilder.andWhere('booking.scheduled_start >= :fromDate', { fromDate: query.from_date });
    }

    if (query.to_date) {
      queryBuilder.andWhere('booking.scheduled_start <= :toDate', { toDate: query.to_date });
    }

    queryBuilder
      .orderBy('booking.scheduled_start', 'ASC')
      .skip(skip)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return createPaginatedResponse(data, page, limit, total);
  }

  async findUpcoming(userId?: string, days: number = 7) {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    const queryBuilder = this.bookingRepo
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.theatre', 'theatre')
      .leftJoinAndSelect('booking.hospital', 'hospital')
      .leftJoinAndSelect('booking.patient', 'patient')
      .leftJoinAndSelect('booking.lead_surgeon', 'surgeon')
      .where('booking.scheduled_start BETWEEN :now AND :future', { now, future: futureDate })
      .andWhere('booking.status IN (:...statuses)', {
        statuses: [BookingStatus.CONFIRMED, BookingStatus.APPROVED],
      });

    if (userId) {
      queryBuilder.andWhere(
        '(booking.patient_id = :userId OR booking.lead_surgeon_id = :userId)',
        { userId },
      );
    }

    return queryBuilder.orderBy('booking.scheduled_start', 'ASC').getMany();
  }

  async update(id: string, dto: UpdateBookingDto, userId: string) {
    const booking = await this.findById(id);

    // Handle status changes
    if (dto.status) {
      if (dto.status === BookingStatus.IN_PROGRESS && !booking.actual_start) {
        dto.actual_start = new Date();
        // Update theatre status
        await this.theatreRepo.update(booking.theatre_id, {
          status: TheatreStatus.IN_USE,
          available: false,
          current_surgery_id: id,
          current_surgeon_id: booking.lead_surgeon_id,
        });
      }

      if (dto.status === BookingStatus.COMPLETED && !booking.actual_end) {
        dto.actual_end = new Date();
        // Calculate actual duration
        if (booking.actual_start) {
          const duration = (dto.actual_end.getTime() - booking.actual_start.getTime()) / (1000 * 60);
          dto.actual_duration = Math.round(duration);
        }
        // Update theatre status
        await this.theatreRepo.update(booking.theatre_id, {
          status: TheatreStatus.CLEANING,
          current_surgery_id: null,
          current_surgeon_id: null,
          total_surgeries: () => 'total_surgeries + 1',
        });
      }

      if (dto.status === BookingStatus.CANCELLED) {
        await this.theatreRepo.update(booking.theatre_id, {
          status: TheatreStatus.AVAILABLE,
          available: true,
        });
      }
    }

    dto['updated_by'] = userId;
    await this.bookingRepo.update(id, dto as any);
    return this.findById(id);
  }

  async checkIn(id: string) {
    return this.update(id, { status: BookingStatus.CHECKED_IN }, 'system');
  }

  async complete(id: string, outcome: any, notes: string) {
    return this.update(
      id,
      {
        status: BookingStatus.COMPLETED,
        outcome,
        surgeon_notes: notes,
      },
      'system',
    );
  }

  async cancel(id: string, reason: string, userId: string) {
    const booking = await this.findById(id);

    if ([BookingStatus.COMPLETED, BookingStatus.CANCELLED].includes(booking.status)) {
      throw new BadRequestException('Cannot cancel completed or already cancelled booking');
    }

    if (booking.status === BookingStatus.IN_PROGRESS) {
      throw new BadRequestException('Cannot cancel in-progress surgery');
    }

    return this.update(
      id,
      {
        status: BookingStatus.CANCELLED,
        ['cancellation_reason']: reason,
        ['cancelled_at']: new Date(),
      } as any,
      userId,
    );
  }

  async reschedule(id: string, newStart: Date, newEnd: Date, userId: string) {
    const booking = await this.findById(id);

    if (booking.status === BookingStatus.IN_PROGRESS) {
      throw new BadRequestException('Cannot reschedule in-progress surgery');
    }

    // Check new time slot availability
    const hasConflict = await this.checkTimeConflict(booking.theatre_id, newStart, newEnd, id);

    if (hasConflict) {
      throw new ConflictException('Theatre is not available for the new time slot');
    }

    return this.update(
      id,
      {
        scheduled_start: newStart,
        scheduled_end: newEnd,
        status: BookingStatus.RESCHEDULED,
      },
      userId,
    );
  }

  async checkTimeConflict(
    theatreId: string,
    start: Date,
    end: Date,
    excludeBookingId?: string,
  ): Promise<boolean> {
    const queryBuilder = this.bookingRepo
      .createQueryBuilder('booking')
      .where('booking.theatre_id = :theatreId', { theatreId })
      .andWhere('booking.status NOT IN (:...excludedStatuses)', {
        excludedStatuses: [BookingStatus.CANCELLED, BookingStatus.COMPLETED],
      })
      .andWhere(
        '(booking.scheduled_start < :end AND booking.scheduled_end > :start)',
        { start, end },
      );

    if (excludeBookingId) {
      queryBuilder.andWhere('booking.id != :excludeBookingId', { excludeBookingId });
    }

    const count = await queryBuilder.getCount();
    return count > 0;
  }

  async getTheatreSchedule(theatreId: string, date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.bookingRepo.find({
      where: {
        theatre_id: theatreId,
        scheduled_start: Between(startOfDay, endOfDay),
      },
      relations: ['patient', 'lead_surgeon'],
      order: { scheduled_start: 'ASC' },
    });
  }

  async getStatistics(hospitalId?: string) {
    const queryBuilder = this.bookingRepo.createQueryBuilder('booking');

    if (hospitalId) {
      queryBuilder.where('booking.hospital_id = :hospitalId', { hospitalId });
    }

    const total = await queryBuilder.getCount();
    const completed = await queryBuilder
      .andWhere('booking.status = :status', { status: BookingStatus.COMPLETED })
      .getCount();

    const avgDuration = await this.bookingRepo
      .createQueryBuilder('booking')
      .select('AVG(booking.actual_duration)', 'avg')
      .where('booking.actual_duration IS NOT NULL')
      .getRawOne();

    return {
      total,
      completed,
      pending: await this.bookingRepo.count({ where: { status: BookingStatus.REQUESTED } }),
      confirmed: await this.bookingRepo.count({ where: { status: BookingStatus.CONFIRMED } }),
      in_progress: await this.bookingRepo.count({ where: { status: BookingStatus.IN_PROGRESS } }),
      cancelled: await this.bookingRepo.count({ where: { status: BookingStatus.CANCELLED } }),
      average_duration: avgDuration?.avg ? parseFloat(avgDuration.avg) : 0,
    };
  }
}
