import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { EmergencyRequestService } from './emergency-request.service';
import { CreateEmergencyRequestDto, UpdateEmergencyRequestDto, QueryEmergencyRequestDto } from './dto/emergency-request.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('emergency-requests')
@ApiBearerAuth()
@Controller('emergency-requests')
@UseGuards(JwtAuthGuard)
export class EmergencyRequestController {
  constructor(private readonly service: EmergencyRequestService) {}

  @Post()
  @ApiOperation({ summary: 'Create emergency request' })
  @ApiResponse({ status: 201, description: 'Emergency request created' })
  create(@Request() req, @Body() dto: CreateEmergencyRequestDto) {
    return this.service.create(req.user.sub, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all emergency requests (admin)' })
  @ApiResponse({ status: 200, description: 'List of emergency requests' })
  findAll(@Query() query: QueryEmergencyRequestDto) {
    return this.service.findAll(query);
  }

  @Get('my-requests')
  @ApiOperation({ summary: 'Get current user emergency requests' })
  @ApiResponse({ status: 200, description: 'User emergency requests' })
  findMyRequests(@Request() req, @Query() query: QueryEmergencyRequestDto) {
    return this.service.findByUserId(req.user.sub, query);
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active emergency requests' })
  @ApiResponse({ status: 200, description: 'Active emergency requests' })
  findActive() {
    return this.service.findActiveRequests();
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get emergency request statistics' })
  @ApiResponse({ status: 200, description: 'Statistics' })
  getStatistics(@Request() req) {
    return this.service.getStatistics(req.user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get emergency request by ID' })
  @ApiParam({ name: 'id', description: 'Emergency request UUID' })
  @ApiResponse({ status: 200, description: 'Emergency request details' })
  findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update emergency request' })
  @ApiParam({ name: 'id', description: 'Emergency request UUID' })
  @ApiResponse({ status: 200, description: 'Emergency request updated' })
  update(@Param('id') id: string, @Body() dto: UpdateEmergencyRequestDto) {
    return this.service.update(id, dto);
  }

  @Post(':id/dispatch')
  @ApiOperation({ summary: 'Dispatch ambulance to emergency' })
  @ApiParam({ name: 'id', description: 'Emergency request UUID' })
  @ApiResponse({ status: 200, description: 'Ambulance dispatched' })
  dispatch(@Param('id') id: string, @Body('ambulance_id') ambulanceId: string) {
    return this.service.dispatch(id, ambulanceId);
  }

  @Post(':id/auto-dispatch')
  @ApiOperation({ summary: 'Auto-dispatch nearest ambulance' })
  @ApiParam({ name: 'id', description: 'Emergency request UUID' })
  @ApiResponse({ status: 200, description: 'Ambulance auto-dispatched' })
  autoDispatch(@Param('id') id: string) {
    return this.service.autoDispatch(id);
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel emergency request' })
  @ApiParam({ name: 'id', description: 'Emergency request UUID' })
  @ApiResponse({ status: 200, description: 'Request cancelled' })
  cancel(@Param('id') id: string, @Request() req, @Body('reason') reason: string) {
    return this.service.cancel(id, req.user.sub, reason);
  }
}
