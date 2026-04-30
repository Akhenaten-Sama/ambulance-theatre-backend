import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Theatre } from './theatre.entity';
import { Repository, Between } from 'typeorm';
import { CreateTheatreDto } from './dto/create-theatre.dto';
import { Hospital } from '../hospital/hospital.entity';
import { TheatreStatus, TheatreType } from '../common/enums';

@Injectable()
export class TheatreService {
  constructor(
    @InjectRepository(Theatre)
    private theatreRepo: Repository<Theatre>,
    @InjectRepository(Hospital)
    private hospitalRepo: Repository<Hospital>,
  ) {}

  async create(dto: CreateTheatreDto) {
    const hospital = await this.hospitalRepo.findOne({ where: { id: dto.hospitalId } });
    if (!hospital) throw new NotFoundException('Hospital not found');

    const theatre = this.theatreRepo.create({
      ...dto,
      hospital,
      status: TheatreStatus.AVAILABLE,
    });

    return await this.theatreRepo.save(theatre);
  }

  async findAvailableBySpecialty(specialty: string) {
    return await this.theatreRepo.find({
      where: {
        specialty,
        status: TheatreStatus.AVAILABLE,
      },
      relations: ['hospital'],
    });
  }

  async findAll() {
    return await this.theatreRepo.find({ relations: ['hospital'] });
  }

  async findById(id: string) {
    const theatre = await this.theatreRepo.findOne({ where: { id }, relations: ['hospital'] });
    if (!theatre) throw new NotFoundException('Theatre not found');
    return theatre;
  }

  async updateStatus(id: string, status: TheatreStatus) {
    const theatre = await this.findById(id);

    // Validation
    if (status === TheatreStatus.AVAILABLE && theatre.current_surgery_id) {
      throw new BadRequestException('Cannot mark theatre as available while surgery is in progress');
    }

    await this.theatreRepo.update(id, { status });
    return this.findById(id);
  }

  async setCurrentSurgery(id: string, surgeryId: string | null) {
    await this.theatreRepo.update(id, {
      current_surgery_id: surgeryId ?? undefined,
      status: surgeryId ? TheatreStatus.IN_USE : TheatreStatus.AVAILABLE,
    });
    return this.findById(id);
  }

  async markCleaningComplete(id: string) {
    const theatre = await this.findById(id);
    if (theatre.status !== TheatreStatus.CLEANING) {
      throw new BadRequestException('Theatre is not currently in cleaning state');
    }

    await this.theatreRepo.update(id, {
      status: TheatreStatus.AVAILABLE,
      available: true,
      current_surgery_id: undefined,
      current_surgeon_id: undefined,
    });

    return this.findById(id);
  }

  async getUtilization(id: string, startDate: Date, endDate: Date) {
    const theatre = await this.findById(id);

    // This would typically query booking records
    // For now, return calculated metrics based on the theatre entity
    const totalHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    const utilizationRate = theatre.utilization_rate || 0;

    return {
      theatre_id: id,
      period: { start: startDate, end: endDate },
      total_hours: totalHours,
      utilized_hours: (totalHours * utilizationRate) / 100,
      utilization_rate: utilizationRate,
      total_surgeries: theatre.total_surgeries,
      average_turnover_time: theatre.average_turnover_time,
    };
  }

  async checkEquipmentAvailability(id: string, requiredEquipment: string[]) {
    const theatre = await this.findById(id);
    const availableEquipment = (theatre.equipment || []).map((item) => item.name);

    const missingEquipment = requiredEquipment.filter((item) => !availableEquipment.includes(item));

    return {
      available: missingEquipment.length === 0,
      missing_equipment: missingEquipment,
      theatre_equipment: availableEquipment,
    };
  }

  async incrementSurgeryCount(id: string) {
    const theatre = await this.findById(id);
    await this.theatreRepo.update(id, {
      total_surgeries: theatre.total_surgeries + 1,
    });
  }

  async updateTurnoverTime(id: string, newTurnoverTime: number) {
    const theatre = await this.findById(id);
    const totalSurgeries = theatre.total_surgeries || 1;
    const currentAvg = theatre.average_turnover_time || 0;

    const newAverage = (currentAvg * totalSurgeries + newTurnoverTime) / (totalSurgeries + 1);

    await this.theatreRepo.update(id, {
      average_turnover_time: Math.round(newAverage),
    });
  }

  async delete(id: string) {
    try {
      const result = await this.theatreRepo.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException('Theatre not found');
      }
      return { status: 'success', message: 'Theatre deleted successfully.' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('An error occurred while deleting the theatre.');
    }
  }
}

