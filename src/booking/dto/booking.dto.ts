import { IsString, IsNotEmpty, IsNumber, IsEnum, IsOptional, IsUUID, IsDate, IsBoolean, IsArray, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BookingStatus, BookingPriority, SurgeryType, AnesthesiaType, SurgeryOutcome } from '../../common/enums';

export class CreateBookingDto {
  @ApiProperty({ description: 'Theatre UUID' })
  @IsUUID()
  theatre_id: string;

  @ApiProperty({ description: 'Hospital UUID' })
  @IsUUID()
  hospital_id: string;

  @ApiProperty({ description: 'Patient UUID' })
  @IsUUID()
  patient_id: string;

  @ApiProperty({ enum: SurgeryType, example: SurgeryType.ELECTIVE })
  @IsEnum(SurgeryType)
  surgery_type: SurgeryType;

  @ApiProperty({ example: 'Appendectomy' })
  @IsString()
  @IsNotEmpty()
  procedure_name: string;

  @ApiPropertyOptional({ example: 'ICD10:K35.80' })
  @IsString()
  @IsOptional()
  procedure_code?: string;

  @ApiProperty({ example: 'General Surgery' })
  @IsString()
  @IsNotEmpty()
  specialty: string;

  @ApiProperty({ description: 'Lead surgeon UUID' })
  @IsUUID()
  lead_surgeon_id: string;

  @ApiPropertyOptional({ description: 'Assistant surgeons UUIDs', type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  assistant_surgeons?: string[];

  @ApiPropertyOptional({ description: 'Anesthesiologist UUID' })
  @IsUUID()
  @IsOptional()
  anesthesiologist_id?: string;

  @ApiPropertyOptional({ description: 'Nurses UUIDs', type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  nurses?: string[];

  @ApiProperty({ example: '2026-02-15T09:00:00Z', description: 'Scheduled start time' })
  @Type(() => Date)
  @IsDate()
  scheduled_start: Date;

  @ApiProperty({ example: '2026-02-15T11:00:00Z', description: 'Scheduled end time' })
  @Type(() => Date)
  @IsDate()
  scheduled_end: Date;

  @ApiProperty({ example: 120, description: 'Estimated duration in minutes' })
  @IsNumber()
  @Min(15)
  estimated_duration: number;

  @ApiProperty({ enum: BookingPriority, example: BookingPriority.SCHEDULED })
  @IsEnum(BookingPriority)
  priority: BookingPriority;

  @ApiPropertyOptional({ enum: AnesthesiaType })
  @IsEnum(AnesthesiaType)
  @IsOptional()
  anesthesia_type?: AnesthesiaType;

  @ApiPropertyOptional({ type: [String], example: ['Blood transfusion ready', 'ICU bed reserved'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  special_requirements?: string[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  surgeon_notes?: string;
}

export class UpdateBookingDto {
  @ApiPropertyOptional({ enum: BookingStatus })
  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;

  @ApiPropertyOptional()
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  actual_start?: Date;

  @ApiPropertyOptional()
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  actual_end?: Date;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  actual_duration?: number;

  @ApiPropertyOptional({ enum: SurgeryOutcome })
  @IsEnum(SurgeryOutcome)
  @IsOptional()
  outcome?: SurgeryOutcome;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  pre_op_assessment_completed?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  follow_up_required?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  surgeon_notes?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  anesthesia_notes?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  nursing_notes?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  complications?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  actual_cost?: number;
}

export class QueryBookingDto {
  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  theatre_id?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  hospital_id?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  patient_id?: string;

  @ApiPropertyOptional({ enum: BookingStatus })
  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;

  @ApiPropertyOptional({ enum: BookingPriority })
  @IsEnum(BookingPriority)
  @IsOptional()
  priority?: BookingPriority;

  @ApiPropertyOptional()
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  from_date?: Date;

  @ApiPropertyOptional()
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  to_date?: Date;

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
