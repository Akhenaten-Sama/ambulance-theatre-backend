import { Controller, Post, Get, Body, UseGuards, Param, Query, Delete, InternalServerErrorException, NotFoundException, Put } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery, ApiCreatedResponse, ApiOkResponse, ApiUnauthorizedResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { HospitalService } from './hospital.service';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('Hospitals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('hospitals')
export class HospitalController {
  constructor(private hospitalService: HospitalService) {}

  @Post()
  // @Roles('admin')
  @ApiOperation({ summary: 'Create a new hospital' })
  @ApiBody({
    type: CreateHospitalDto,
    examples: {
      example1: {
        summary: 'Create hospital',
        value: {
          name: 'City Hospital',
          address: '123 Main St, Metropolis',
          latitude: 40.7128,
          longitude: -74.0060,
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'The hospital has been successfully created.',
    schema: {
      example: {
        id: '1',
        name: 'City Hospital',
        address: '123 Main St, Metropolis',
        latitude: 40.7128,
        longitude: -74.0060,
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden. Only admins can create.' })
  create(@Body() dto: CreateHospitalDto) {
    return this.hospitalService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all hospitals' })
  @ApiOkResponse({
    description: 'List of all hospitals',
    schema: {
      example: [
        {
          id: '1',
          name: 'City Hospital',
          address: '123 Main St, Metropolis',
          latitude: 40.7128,
          longitude: -74.0060,
        },
      ],
    },
  })
  findAll() {
    return this.hospitalService.findAll();
  }

  @Get('nearby-theatres')
  @ApiOperation({ summary: 'Find available theatres near a location' })
  @ApiQuery({ name: 'lat', required: true, description: 'Latitude', example: '40.7128' })
  @ApiQuery({ name: 'lng', required: true, description: 'Longitude', example: '-74.0060' })
  @ApiQuery({ name: 'radiusKm', required: false, description: 'Radius in kilometers', example: '10', schema: { default: '10' } })
  @ApiOkResponse({
    description: 'List of available theatres nearby',
    schema: {
      example: [
        {
          hospitalId: '1',
          hospitalName: 'City Hospital',
          theatreId: 't1',
          specialty: 'Cardiology',
          distanceKm: 2.5,
        },
      ],
    },
  })
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
  @ApiOperation({ summary: 'Find available theatres by specialty' })
  @ApiQuery({ name: 'specialty', required: true, description: 'Specialty to filter by', example: 'Cardiology' })
  @ApiOkResponse({
    description: 'List of available theatres for the given specialty',
    schema: {
      example: [
        {
          hospitalId: '1',
          hospitalName: 'City Hospital',
          theatreId: 't1',
          specialty: 'Cardiology',
        },
      ],
    },
  })
  findTheatresBySpecialty(@Query('specialty') specialty: string) {
    return this.hospitalService.findAvailableTheatresBySpecialty(specialty);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get hospital by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Hospital ID',
    example: '1',
  })
  @ApiOkResponse({
    description: 'Hospital details',
    schema: {
      example: {
        id: '1',
        name: 'City Hospital',
        address: '123 Main St, Metropolis',
        latitude: 40.7128,
        longitude: -74.0060,
      },
    },
  })
  findById(@Param('id') id: string) {
    return this.hospitalService.findById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a hospital by ID' })
  @ApiResponse({ status: 200, description: 'Hospital deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Hospital not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async delete(@Param('id') id: string) {
    try {
      const result = await this.hospitalService.delete(id);
      return { status: 'success', message: 'Hospital deleted successfully.' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('An error occurred while deleting the hospital.');
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a hospital by ID' })
  @ApiResponse({ status: 200, description: 'Hospital updated successfully.' })
  @ApiResponse({ status: 404, description: 'Hospital not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async update(@Param('id') id: string, @Body() dto: UpdateHospitalDto) {
    try {
      return await this.hospitalService.update(id, dto);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException({'message':'An error occurred while updating the hospital.', error: error});
    }
  }
}
