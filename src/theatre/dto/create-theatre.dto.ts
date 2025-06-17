import { IsUUID, IsString, IsDateString, IsBoolean } from 'class-validator';

export class CreateTheatreDto {
  @IsUUID()
  hospitalId: string;

  @IsString()
  specialty: string;

  @IsDateString()
  available_from: string;

  @IsDateString()
  available_to: string;

  @IsBoolean()
  available: boolean;
}
