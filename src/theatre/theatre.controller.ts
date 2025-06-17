import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { TheatreService } from './theatre.service';
import { CreateTheatreDto } from './dto/create-theatre.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('theatres')
@UseGuards(JwtAuthGuard)
export class TheatreController {
  constructor(private theatreService: TheatreService) {}

  @Post()
  create(@Body() dto: CreateTheatreDto) {
    return this.theatreService.create(dto);
  }

  @Get('search')
  findBySpecialty(@Query('specialty') specialty: string) {
    return this.theatreService.findAvailableBySpecialty(specialty);
  }
}
