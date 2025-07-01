import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
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
  // Get hospitals with at least one available theatre within the radius
  const hospitals = await this.hospitalRepo
    .createQueryBuilder('hospital')
    .leftJoinAndSelect('hospital.theatres', 'theatre')
    .addSelect(`
      ST_DistanceSphere(
        ST_MakePoint(hospital.longitude, hospital.latitude),
        ST_MakePoint(:lng, :lat)
      )`, 'distance'
    )
    .where(`
      ST_DistanceSphere(
        ST_MakePoint(hospital.longitude, hospital.latitude),
        ST_MakePoint(:lng, :lat)
      ) <= :distance
    `, { lat, lng, distance: radiusKm * 1000 })
    .andWhere('theatre.available = true')
    .getMany();

  // Optionally, filter out hospitals with no available theatres (shouldn't be needed, but safe)
  const filtered = hospitals
    .map(h => ({
      ...h,
      theatres: h.theatres.filter(t => t.available),
    }))
    .filter(h => h.theatres.length > 0);

  return filtered;
}
    async findAvailableTheatresBySpecialty(specialty: string) {
        return this.hospitalRepo
        .createQueryBuilder('hospital')
        .leftJoinAndSelect('hospital.theatres', 'theatre')
        .where('theatre.specialty = :specialty', { specialty })
        .andWhere('theatre.available = true')
        .getMany();
    }

    async delete(id: string) {
      try {
        const result = await this.hospitalRepo.delete(id);
        if (result.affected === 0) {
          throw new NotFoundException('Hospital not found');
        }
        return { status: 'success', message: 'Hospital deleted successfully.' };
      } catch (error) {
        if (error instanceof NotFoundException) throw error;
        throw new InternalServerErrorException('An error occurred while deleting the hospital.');
      }
    }

    async update(id: string, dto: Partial<Hospital>) {
      try {
        const hospital = await this.hospitalRepo.findOne({ where: { id } });
        if (!hospital) throw new NotFoundException('Hospital not found');
        await this.hospitalRepo.update(id, dto);
        return this.hospitalRepo.findOne({ where: { id } });
      } catch (error) {
        if (error instanceof NotFoundException) throw error;
        throw new InternalServerErrorException({'message':'An error occurred while updating the hospital.', error: error});
      }
    }
    }


