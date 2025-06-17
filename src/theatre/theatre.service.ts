import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Theatre } from './theatre.entity';
import { Repository } from 'typeorm';
import { CreateTheatreDto } from './dto/create-theatre.dto';
import { Hospital } from '../hospital/hospital.entity';

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
      hospital,
      specialty: dto.specialty,
      available_from: new Date(dto.available_from),
      available_to: new Date(dto.available_to),
      available: dto.available,
    });

    return this.theatreRepo.save(theatre);
  }

  async findAvailableBySpecialty(specialty: string) {
    return this.theatreRepo.find({
      where: {
        specialty,
        available: true,
      },
    });
  }
}

