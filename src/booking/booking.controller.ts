import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { CreateBookingDto, UpdateBookingDto, QueryBookingDto } from './dto/booking.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('bookings')
@ApiBearerAuth()
@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingController {
  constructor(private readonly service: BookingService) {}

  @Post()
  @ApiOperation({ summary: 'Create theatre booking' })
  @ApiResponse({ status: 201, description: 'Booking created' })
  create(@Request() req, @Body() dto: CreateBookingDto) {
    return this.service.create(dto, req.user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Get all bookings' })
  @ApiResponse({ status: 200, description: 'List of bookings' })
  findAll(@Query() query: QueryBookingDto) {
    return this.service.findAll(query);
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Get upcoming bookings' })
  @ApiResponse({ status: 200, description: 'Upcoming bookings' })
  findUpcoming(@Request() req, @Query('days') days?: number) {
    return this.service.findUpcoming(req.user.sub, days ? parseInt(days as any) : 7);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get booking statistics' })
  @ApiResponse({ status: 200, description: 'Statistics' })
  getStatistics(@Query('hospital_id') hospitalId?: string) {
    return this.service.getStatistics(hospitalId);
  }

  @Get('theatre/:theatreId/schedule')
  @ApiOperation({ summary: 'Get theatre schedule for a specific date' })
  @ApiParam({ name: 'theatreId', description: 'Theatre UUID' })
  @ApiResponse({ status: 200, description: 'Theatre schedule' })
  getTheatreSchedule(
    @Param('theatreId') theatreId: string,
    @Query('date') date: string,
  ) {
    return this.service.getTheatreSchedule(theatreId, new Date(date));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking by ID' })
  @ApiParam({ name: 'id', description: 'Booking UUID' })
  @ApiResponse({ status: 200, description: 'Booking details' })
  findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update booking' })
  @ApiParam({ name: 'id', description: 'Booking UUID' })
  @ApiResponse({ status: 200, description: 'Booking updated' })
  update(@Param('id') id: string, @Body() dto: UpdateBookingDto, @Request() req) {
    return this.service.update(id, dto, req.user.sub);
  }

  @Post(':id/check-in')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check in patient for surgery' })
  @ApiParam({ name: 'id', description: 'Booking UUID' })
  @ApiResponse({ status: 200, description: 'Patient checked in' })
  checkIn(@Param('id') id: string) {
    return this.service.checkIn(id);
  }

  @Post(':id/complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark surgery as completed' })
  @ApiParam({ name: 'id', description: 'Booking UUID' })
  @ApiResponse({ status: 200, description: 'Surgery completed' })
  complete(
    @Param('id') id: string,
    @Body('outcome') outcome: any,
    @Body('notes') notes: string,
  ) {
    return this.service.complete(id, outcome, notes);
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel booking' })
  @ApiParam({ name: 'id', description: 'Booking UUID' })
  @ApiResponse({ status: 200, description: 'Booking cancelled' })
  cancel(@Param('id') id: string, @Body('reason') reason: string, @Request() req) {
    return this.service.cancel(id, reason, req.user.sub);
  }

  @Post(':id/reschedule')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reschedule booking' })
  @ApiParam({ name: 'id', description: 'Booking UUID' })
  @ApiResponse({ status: 200, description: 'Booking rescheduled' })
  reschedule(
    @Param('id') id: string,
    @Body('new_start') newStart: string,
    @Body('new_end') newEnd: string,
    @Request() req,
  ) {
    return this.service.reschedule(id, new Date(newStart), new Date(newEnd), req.user.sub);
  }
}
