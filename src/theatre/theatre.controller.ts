import { Controller, Post, Body, Get, Query, UseGuards, Delete, Param, InternalServerErrorException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody, ApiQuery, ApiCreatedResponse, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { TheatreService } from './theatre.service';
import { CreateTheatreDto } from './dto/create-theatre.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Theatre } from './theatre.entity';

@ApiTags('theatres')
@ApiBearerAuth()
@Controller('theatres')
@UseGuards(JwtAuthGuard)
export class TheatreController {
  constructor(private theatreService: TheatreService) {}

  /**
   * Create a new theatre.
   * 
   * @param dto The data to create a theatre.
   * @returns The created theatre.
   * 
   * @example
   * Request Body:
   * {
   *   "name": "Main Theatre",
   *   "location": "Building A",
   *   "specialty": "Cardiology"
   * }
   * 
   * @example
   * Response:
   * {
   *   "id": 1,
   *   "name": "Main Theatre",
   *   "location": "Building A",
   *   "specialty": "Cardiology"
   * }
   */
  @Post()
  @ApiOperation({ summary: 'Create a new theatre' })
  @ApiBody({ 
    type: CreateTheatreDto, 
    examples: {
      example1: {
        summary: 'Create a Cardiology Theatre',
        value: {
          hospitalId: 'hospital-uuid-here',
          specialty: 'Cardiology',
          available_from: '2025-06-18T08:00:00.000Z',
          available_to: '2025-06-18T16:00:00.000Z',
          available: true
        }
      }
    }
  })
  @ApiCreatedResponse({
    description: 'The theatre has been successfully created.',
    type: Theatre,
    examples: {
      example1: {
        summary: 'Created Theatre',
        value: {
          id: 'theatre-uuid-here',
          specialty: 'Cardiology',
          available_from: '2025-06-18T08:00:00.000Z',
          available_to: '2025-06-18T16:00:00.000Z',
          available: true,
          hospital: {
            id: 'hospital-uuid-here',
            name: 'City Hospital',
            latitude: 40.7128,
            longitude: -74.0060,
            available: true,
            createdAt: '2025-06-18T07:00:00.000Z',
            updatedAt: '2025-06-18T07:00:00.000Z'
          }
        }
      }
    }
  })
  create(@Body() dto: CreateTheatreDto) {
    return this.theatreService.create(dto);
  }

  /**
   * Find available theatres by specialty.
   * 
   * @param specialty The specialty to search for.
   * @returns List of available theatres matching the specialty.
   * 
   * @example
   * GET /theatres/search?specialty=Cardiology
   * 
   * @example
   * Response:
   * [
   *   {
   *     "id": 1,
   *     "name": "Main Theatre",
   *     "location": "Building A",
   *     "specialty": "Cardiology"
   *   }
   * ]
   */
  @Get('search')
  @ApiOperation({ summary: 'Find available theatres by specialty' })
  @ApiQuery({ name: 'specialty', required: true, example: 'Cardiology', description: 'The specialty to filter theatres by.' })
  @ApiOkResponse({
    description: 'List of available theatres matching the specialty.',
    type: [Theatre],
    examples: {
      example1: {
        summary: 'Available Cardiology Theatres',
        value: [
          {
            id: 'theatre-uuid-here',
            specialty: 'Cardiology',
            available_from: '2025-06-18T08:00:00.000Z',
            available_to: '2025-06-18T16:00:00.000Z',
            available: true,
            hospital: {
              id: 'hospital-uuid-here',
              name: 'City Hospital',
              latitude: 40.7128,
              longitude: -74.0060,
              available: true,
              createdAt: '2025-06-18T07:00:00.000Z',
              updatedAt: '2025-06-18T07:00:00.000Z'
            }
          }
        ]
      }
    }
  })
  findBySpecialty(@Query('specialty') specialty: string) {
    return this.theatreService.findAvailableBySpecialty(specialty);
  }

  /**
   * Get all theatres.
   * 
   * @returns List of all theatres.
   * 
   * @example
   * GET /theatres
   * 
   * @example
   * Response:
   * [
   *   {
   *     "id": 1,
   *     "name": "Main Theatre",
   *     "location": "Building A",
   *     "specialty": "Cardiology"
   *   },
   *   {
   *     "id": 2,
   *     "name": "Orthopedic Theatre",
   *     "location": "Building B",
   *     "specialty": "Orthopedics"
   *   }
   * ]
   */
  @Get()
  @ApiOperation({ summary: 'Get all theatres' })
  @ApiOkResponse({
    description: 'List of all theatres.',
    type: [Theatre]
  })
  findAll() {
    return this.theatreService.findAll();
  }

  /**
   * Delete a theatre by ID.
   * 
   * @param id The ID of the theatre to delete.
   * @returns Success message.
   * 
   * @example
   * DELETE /theatres/1
   * 
   * @example
   * Response:
   * {
   *   "status": "success",
   *   "message": "Theatre deleted successfully."
   * }
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a theatre by ID' })
  @ApiResponse({ status: 200, description: 'Theatre deleted successfully.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async delete(@Param('id') id: string) {
    try {
      return await this.theatreService.delete(id);
    } catch (error) {
      // Log the error if needed
      throw new InternalServerErrorException('An error occurred while deleting the theatre.');
    }
  }
}
