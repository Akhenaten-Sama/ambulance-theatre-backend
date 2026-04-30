import { IsUUID, IsNumber, IsBoolean, IsString, IsEnum, IsOptional, Min, Max, IsArray, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AmbulanceType, AmbulanceStatus } from '../../common/enums';

export class CreateAmbulanceDto {
  @ApiProperty({ example: 'ABC-123-XY', description: 'Vehicle license plate number' })
  @IsString()
  vehicle_number: string;

  @ApiProperty({ example: 'Mercedes-Benz', description: 'Vehicle manufacturer' })
  @IsString()
  vehicle_make: string;

  @ApiProperty({ example: 'Sprinter', description: 'Vehicle model' })
  @IsString()
  vehicle_model: string;

  @ApiProperty({ example: 2024, description: 'Vehicle year' })
  @IsInt()
  @Min(1990)
  @Max(2030)
  year: number;

  @ApiPropertyOptional({ example: 'WDB9066651N123456', description: 'Vehicle Identification Number' })
  @IsString()
  @IsOptional()
  vin?: string;

  @ApiPropertyOptional({ description: 'Hospital UUID this ambulance belongs to' })
  @IsUUID()
  @IsOptional()
  hospital_id?: string;

  @ApiPropertyOptional({ description: 'Current driver UUID' })
  @IsUUID()
  @IsOptional()
  current_driver_id?: string;

  @ApiProperty({ example: 6.5244, description: 'Current latitude' })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({ example: 3.3792, description: 'Current longitude' })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @ApiPropertyOptional({ enum: AmbulanceType, example: AmbulanceType.ADVANCED })
  @IsEnum(AmbulanceType)
  @IsOptional()
  type?: AmbulanceType;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  available?: boolean;

  @ApiPropertyOptional({ example: true, description: 'Has life support equipment' })
  @IsBoolean()
  @IsOptional()
  has_life_support?: boolean;

  @ApiPropertyOptional({ example: true, description: 'Has ventilator' })
  @IsBoolean()
  @IsOptional()
  has_ventilator?: boolean;

  @ApiPropertyOptional({ example: true, description: 'Has defibrillator' })
  @IsBoolean()
  @IsOptional()
  has_defibrillator?: boolean;

  @ApiPropertyOptional({ example: false, description: 'Has incubator for neonatal transport' })
  @IsBoolean()
  @IsOptional()
  has_incubator?: boolean;

  @ApiPropertyOptional({ example: 1, description: 'Patient capacity' })
  @IsInt()
  @IsOptional()
  capacity?: number;
}

export class UpdateAmbulanceDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  vehicle_number?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  current_driver_id?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiPropertyOptional({ enum: AmbulanceStatus })
  @IsEnum(AmbulanceStatus)
  @IsOptional()
  status?: AmbulanceStatus;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  available?: boolean;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  mileage?: number;
}

export class UpdateLocationDto {
  @ApiProperty({ example: 6.5244 })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({ example: 3.3792 })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @ApiPropertyOptional({ example: 60, description: 'Speed in km/h' })
  @IsNumber()
  @IsOptional()
  speed?: number;

  @ApiPropertyOptional({ example: 180, description: 'Heading in degrees (0-360)' })
  @IsNumber()
  @Min(0)
  @Max(360)
  @IsOptional()
  heading?: number;
}

export class QueryNearbyAmbulancesDto {
  @ApiProperty({ example: 6.5244, description: 'Search center latitude' })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({ example: 3.3792, description: 'Search center longitude' })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @ApiPropertyOptional({ example: 10, description: 'Search radius in kilometers', default: 10 })
  @IsNumber()
  @IsOptional()
  @Min(0.1)
  @Max(100)
  radius?: number;

  @ApiPropertyOptional({ enum: AmbulanceType, description: 'Filter by ambulance type' })
  @IsEnum(AmbulanceType)
  @IsOptional()
  type?: AmbulanceType;

  @ApiPropertyOptional({ example: true, description: 'Only available ambulances' })
  @IsBoolean()
  @IsOptional()
  available_only?: boolean;
}

