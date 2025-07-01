import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
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
    try {
      const hospital = await this.hospitalRepo.findOne({ where: { id: dto.hospitalId } });
      if (!hospital) throw new NotFoundException('Hospital not found');

      const theatre = this.theatreRepo.create({
        hospital,
        specialty: dto.specialty,
        available_from: new Date(dto.available_from),
        available_to: new Date(dto.available_to),
        available: dto.available,
      });

      return await this.theatreRepo.save(theatre);
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while creating the theatre.');
    }
  }

  async findAvailableBySpecialty(specialty: string) {
    try {
      return await this.theatreRepo.find({
        where: {
          specialty,
          available: true,
        },
        relations: ['hospital'],
      });
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while fetching theatres by specialty.');
    }
  }

  async findAll() {
    try {
      return await this.theatreRepo.find({ relations: ['hospital'] });
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while fetching all theatres.');
    }
  }

  async findById(id: string) {
    try {
      const theatre = await this.theatreRepo.findOne({ where: { id }, relations: ['hospital'] });
      if (!theatre) throw new NotFoundException('Theatre not found');
      return theatre;
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while fetching the theatre.');
    }
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

