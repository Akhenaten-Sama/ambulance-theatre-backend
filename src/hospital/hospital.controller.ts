import { Controller, Post, Get, Body, UseGuards, Param, Query } from '@nestjs/common';
import { HospitalService } from './hospital.service';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('hospitals')
export class HospitalController {
  constructor(private hospitalService: HospitalService) {}

  @Post()
  @Roles('admin') // ⬅️ Only admins can create
  create(@Body() dto: CreateHospitalDto) {
    return this.hospitalService.create(dto);
  }

  @Get()
  findAll() {
    return this.hospitalService.findAll();
  }
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.hospitalService.findById(id);
  }
  @Get('nearby-theatres')
findNearbyTheatres(
  @Query('lat') lat: string,
  @Query('lng') lng: string,
  @Query('radiusKm') radiusKm = '10',
) {
  return this.hospitalService.findAvailableTheatresNearby(
    parseFloat(lat),
    parseFloat(lng),
    parseFloat(radiusKm),
  );
}
    @Get('theatres-by-specialty')
    findTheatresBySpecialty(@Query('specialty') specialty: string) {
        return this.hospitalService.findAvailableTheatresBySpecialty(specialty);
    }
}

