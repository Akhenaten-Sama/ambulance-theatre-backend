import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { AmbulanceService } from './ambulance.service';
import { CreateAmbulanceDto } from './dto/create-ambulance.dto';

/**
 * @controller AmbulanceController
 * @description Handles operations related to ambulances, including creation and searching for nearby available ambulances.
 *
 * @tags Ambulances
 */

/**
 * @summary Create a new ambulance
 * @operationId createAmbulance
 * @param dto The data transfer object containing ambulance creation details.
 * @returns The created ambulance object.
 *
 * @remarks
 * This endpoint allows you to create a new ambulance record in the system.
 *
 * @example
 * Request:
 * POST /ambulances
 * Content-Type: application/json
 * {
 *   "plateNumber": "ABC123",
 *   "location": {
 *     "latitude": 51.5074,
 *     "longitude": -0.1278
 *   },
 *   "status": "available"
 * }
 *
 * @example
 * Response:
 * HTTP/1.1 201 Created
 * Content-Type: application/json
 * {
 *   "id": "1",
 *   "plateNumber": "ABC123",
 *   "location": {
 *     "latitude": 51.5074,
 *     "longitude": -0.1278
 *   },
 *   "status": "available",
 *   "createdAt": "2024-06-01T12:00:00.000Z"
 * }
 *
 * @swagger
 * /ambulances:
 *   post:
 *     summary: Create a new ambulance
 *     tags:
 *       - Ambulances
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAmbulanceDto'
 *     responses:
 *       201:
 *         description: The created ambulance object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ambulance'
 */

/**
 * @summary Find available ambulances nearby
 * @operationId findNearbyAmbulances
 * @param latitude The latitude of the location to search from. (required)
 * @param longitude The longitude of the location to search from. (required)
 * @param radiusKm The search radius in kilometers. Defaults to 10km if not provided. (optional)
 * @returns An array of available ambulances within the specified radius.
 *
 * @remarks
 * This endpoint returns a list of available ambulances within a given radius of the specified latitude and longitude.
 *
 * @example
 * Request:
 * GET /ambulances/nearby?latitude=51.5074&longitude=-0.1278&radiusKm=5
 *
 * @example
 * Response:
 * HTTP/1.1 200 OK
 * Content-Type: application/json
 * [
 *   {
 *     "id": "1",
 *     "plateNumber": "ABC123",
 *     "location": {
 *       "latitude": 51.5074,
 *       "longitude": -0.1278
 *     },
 *     "status": "available"
 *   },
 *   {
 *     "id": "2",
 *     "plateNumber": "XYZ789",
 *     "location": {
 *       "latitude": 51.5080,
 *       "longitude": -0.1280
 *     },
 *     "status": "available"
 *   }
 * ]
 *
 * @swagger
 * /ambulances/nearby:
 *   get:
 *     summary: Find available ambulances nearby
 *     tags:
 *       - Ambulances
 *     parameters:
 *       - in: query
 *         name: latitude
 *         required: true
 *         schema:
 *           type: number
 *         description: Latitude of the location to search from.
 *       - in: query
 *         name: longitude
 *         required: true
 *         schema:
 *           type: number
 *         description: Longitude of the location to search from.
 *       - in: query
 *         name: radiusKm
 *         required: false
 *         schema:
 *           type: number
 *           default: 10
 *         description: Search radius in kilometers.
 *     responses:
 *       200:
 *         description: List of available ambulances within the specified radius.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ambulance'
 */
@Controller('ambulances')
export class AmbulanceController {
  constructor(private ambulanceService: AmbulanceService) {}

  @Post()
  create(@Body() dto: CreateAmbulanceDto) {
    return this.ambulanceService.create(dto);
  }

  @Get()
  findAll() {
    return this.ambulanceService.findAll();
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

