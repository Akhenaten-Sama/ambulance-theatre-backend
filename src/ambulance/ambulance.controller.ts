import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { AmbulanceService } from './ambulance.service';
import { CreateAmbulanceDto } from './dto/create-ambulance.dto';

@Controller('ambulances')
export class AmbulanceController {
  constructor(private ambulanceService: AmbulanceService) {}

  @Post()
  create(@Body() dto: CreateAmbulanceDto) {
    return this.ambulanceService.create(dto);
  }

  @Get('nearby')
  findNearby(
    @Query('latitude') latitude: string,
    @Query('longitude') longitude: string,
    @Query('radiusKm') radiusKm?: string,
  ) {
    return this.ambulanceService.findAllAvailableNearby(
      parseFloat(latitude),
      parseFloat(longitude),
      radiusKm ? parseFloat(radiusKm) : 10,
    );
  }
}

