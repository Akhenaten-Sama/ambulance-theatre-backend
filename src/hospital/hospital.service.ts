import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hospital } from './hospital.entity';
import { CreateHospitalDto } from './dto/create-hospital.dto';

@Injectable()
export class HospitalService {
  constructor(
    @InjectRepository(Hospital)
    private hospitalRepo: Repository<Hospital>,
  ) {}

  create(dto: CreateHospitalDto) {
    const hospital = this.hospitalRepo.create(dto);
    return this.hospitalRepo.save(hospital);
  }

  findAll() {
    return this.hospitalRepo.find({ relations: ['theatres'] });
  }

  async findById(id: string) {
    const hospital = await this.hospitalRepo.findOne({ where: { id }, relations: ['theatres'] });
    if (!hospital) throw new NotFoundException('Hospital not found');
    return hospital;
  }
  async findAvailableTheatresNearby(lat: number, lng: number, radiusKm: number) {
  const hospitals = await this.hospitalRepo
    .createQueryBuilder('hospital')
    .leftJoinAndSelect('hospital.theatres', 'theatre')
    .where(`
      ST_DistanceSphere(
        point(hospital.longitude, hospital.latitude),
        point(:lng, :lat)
      ) <= :distance
    `, { lat, lng, distance: radiusKm * 1000 })
    .andWhere('theatre.available = true')
    .getMany();

  return hospitals;
}
    async findAvailableTheatresBySpecialty(specialty: string) {
        return this.hospitalRepo
        .createQueryBuilder('hospital')
        .leftJoinAndSelect('hospital.theatres', 'theatre')
        .where('theatre.specialty = :specialty', { specialty })
        .andWhere('theatre.available = true')
        .getMany();
    }
    }


