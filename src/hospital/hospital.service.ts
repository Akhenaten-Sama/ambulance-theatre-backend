import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hospital } from './hospital.entity';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { toPostGISPoint } from '../common/utils';

@Injectable()
export class HospitalService {
  constructor(
    @InjectRepository(Hospital)
    private hospitalRepo: Repository<Hospital>,
  ) {}

  create(dto: CreateHospitalDto) {
    const hospital = this.hospitalRepo.create({
      ...dto,
      location: dto.latitude && dto.longitude ? toPostGISPoint(dto.longitude, dto.latitude) : undefined,
    });
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
      .addSelect(
        `ST_Distance(
          hospital.location::geography,
          ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography
        )`,
        'distance',
      )
      .where(
        `ST_DWithin(
          hospital.location::geography,
          ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography,
          :distance
        )`,
        { lat, lng, distance: radiusKm * 1000 },
      )
      .andWhere('theatre.status = :status', { status: 'available' })
      .orderBy('distance', 'ASC')
      .getMany();

    // Filter out hospitals with no available theatres
    const filtered = hospitals
      .map((h) => ({
        ...h,
        theatres: h.theatres.filter((t) => t.status === 'available'),
      }))
      .filter((h) => h.theatres.length > 0);

    return filtered;
  }

  async findAvailableTheatresBySpecialty(specialty: string) {
    return this.hospitalRepo
      .createQueryBuilder('hospital')
      .leftJoinAndSelect('hospital.theatres', 'theatre')
      .where('theatre.specialty = :specialty', { specialty })
      .andWhere('theatre.status = :status', { status: 'available' })
      .getMany();
  }

  async updateBedCount(id: string, totalBeds?: number, availableBeds?: number, icuBeds?: number) {
    const hospital = await this.findById(id);

    const updates: Partial<Hospital> = {};
    if (totalBeds !== undefined) updates.total_beds = totalBeds;
    if (availableBeds !== undefined) updates.available_beds = availableBeds;
    if (icuBeds !== undefined) updates.icu_beds = icuBeds;

    // Validation
    if (updates.available_beds && hospital.total_beds && updates.available_beds > hospital.total_beds) {
      throw new BadRequestException('Available beds cannot exceed total beds');
    }

    await this.hospitalRepo.update(id, updates);
    return this.findById(id);
  }

  async incrementOccupiedBeds(id: string, count = 1) {
    const hospital = await this.findById(id);
    const newAvailable = (hospital.available_beds || 0) - count;

    if (newAvailable < 0) {
      throw new BadRequestException('Not enough available beds');
    }

    await this.hospitalRepo.update(id, { available_beds: newAvailable });
    return this.findById(id);
  }

  async releaseOccupiedBeds(id: string, count = 1) {
    const hospital = await this.findById(id);
    const newAvailable = (hospital.available_beds || 0) + count;

    if (hospital.total_beds && newAvailable > hospital.total_beds) {
      throw new BadRequestException('Available beds would exceed total beds');
    }

    await this.hospitalRepo.update(id, { available_beds: newAvailable });
    return this.findById(id);
  }

  async addStaff(id: string, staffIds: string[]) {
    const hospital = await this.findById(id);
    const currentStaff = hospital.admin_staff || [];
    const updatedStaff = [...new Set([...currentStaff, ...staffIds])];

    await this.hospitalRepo.update(id, { admin_staff: updatedStaff });
    return this.findById(id);
  }

  async removeStaff(id: string, staffIds: string[]) {
    const hospital = await this.findById(id);
    const currentStaff = hospital.admin_staff || [];
    const updatedStaff = currentStaff.filter((staffId) => !staffIds.includes(staffId));

    await this.hospitalRepo.update(id, { admin_staff: updatedStaff });
    return this.findById(id);
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

      // Handle location update if lat/lng provided
      if (dto['latitude'] && dto['longitude']) {
        dto.location = toPostGISPoint(dto['longitude'], dto['latitude']);
      }

      await this.hospitalRepo.update(id, dto);
      return this.hospitalRepo.findOne({ where: { id } });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException({
        message: 'An error occurred while updating the hospital.',
        error: error,
      });
    }
  }
}


