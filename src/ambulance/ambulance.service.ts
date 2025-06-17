import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ambulance } from './ambulance.entity';
import { User } from '../user/user.entity';
import { CreateAmbulanceDto } from './dto/create-ambulance.dto';

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
      driver,
      latitude: dto.latitude,
      longitude: dto.longitude,
      available: dto.available,
    });
    return this.ambulanceRepo.save(ambulance);
  }

  async findAllAvailableNearby(lat: number, lng: number, radiusKm = 10) {
    const earthRadiusKm = 6371;

    return this.ambulanceRepo
      .createQueryBuilder('ambulance')
      .leftJoinAndSelect('ambulance.driver', 'driver')
      .where('ambulance.available = :available', { available: true })
      .andWhere(
        `(6371 * acos(cos(radians(:lat)) * cos(radians(ambulance.latitude)) * cos(radians(ambulance.longitude) - radians(:lng)) + sin(radians(:lat)) * sin(radians(ambulance.latitude)))) < :radius`,
        { lat, lng, radius: radiusKm },
      )
      .getMany();
  }
}

