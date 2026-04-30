import { IsString, IsNotEmpty, IsNumber, IsEnum, IsOptional, IsUUID, ValidateNested, Min, Max, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EmergencyType, EmergencySeverity } from '../../common/enums';
import { Address, VitalSigns } from '../../common/types';

export class CreateEmergencyRequestDto {
  @ApiProperty({ example: 6.5244, description: 'Pickup location latitude' })
  @IsNumber()
  @Min(-90)
  @Max(90)
  pickup_latitude: number;

  @ApiProperty({ example: 3.3792, description: 'Pickup location longitude' })
  @IsNumber()
  @Min(-180)
  @Max(180)
  pickup_longitude: number;

  @ApiProperty({
    example: {
      street: '123 Main St',
      city: 'Lagos',
      state: 'Lagos',
      country: 'Nigeria',
    },
    description: 'Pickup address',
  })
  @IsObject()
  @IsOptional()
  pickup_address?: Address;

  @ApiProperty({ enum: EmergencyType, example: EmergencyType.ACCIDENT })
  @IsEnum(EmergencyType)
  emergency_type: EmergencyType;

  @ApiProperty({ enum: EmergencySeverity, example: EmergencySeverity.URGENT })
  @IsEnum(EmergencySeverity)
  severity: EmergencySeverity;

  @ApiProperty({ example: 'Car accident on expressway, patient conscious' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ example: 'Patient has chest pain and difficulty breathing' })
  @IsString()
  @IsOptional()
  patient_condition?: string;

  @ApiPropertyOptional({ description: 'Patient vital signs' })
  @IsObject()
  @IsOptional()
  vital_signs?: VitalSigns;

  @ApiPropertyOptional({ description: 'Preferred hospital UUID' })
  @IsUUID()
  @IsOptional()
  destination_hospital_id?: string;

  @ApiPropertyOptional({ example: 6.5344, description: 'Destination latitude' })
  @IsNumber()
  @IsOptional()
  destination_latitude?: number;

  @ApiPropertyOptional({ example: 3.3892, description: 'Destination longitude' })
  @IsNumber()
  @IsOptional()
  destination_longitude?: number;

  @ApiPropertyOptional({ example: 'John Doe' })
  @IsString()
  @IsOptional()
  patient_name?: string;

  @ApiPropertyOptional({ example: '+2348012345678' })
  @IsString()
  @IsOptional()
  patient_phone?: string;
}

export class UpdateEmergencyRequestDto {
  @ApiPropertyOptional({ enum: RequestStatus })
  @IsEnum(RequestStatus)
  @IsOptional()
  status?: RequestStatus;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  assigned_ambulance_id?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  assigned_driver_id?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  dispatcher_notes?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  driver_notes?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  paramedic_notes?: string;
}

export class QueryEmergencyRequestDto {
  @ApiPropertyOptional({ enum: EmergencyType })
  @IsEnum(EmergencyType)
  @IsOptional()
  emergency_type?: EmergencyType;

  @ApiPropertyOptional({ enum: EmergencySeverity })
  @IsEnum(EmergencySeverity)
  @IsOptional()
  severity?: EmergencySeverity;

  @ApiPropertyOptional({ enum: RequestStatus })
  @IsEnum(RequestStatus)
  @IsOptional()
  status?: RequestStatus;

  @ApiPropertyOptional({ example: 1 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ example: 10 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  limit?: number;
}

import { RequestStatus } from '../../common/enums';
