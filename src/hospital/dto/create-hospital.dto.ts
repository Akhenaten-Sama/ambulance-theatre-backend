import { IsString, IsNumber } from 'class-validator';

export class CreateHospitalDto {
  @IsString()
  name: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}
export class UpdateHospitalDto {
  @IsString()
  name?: string;

  @IsNumber()
  latitude?: number;

  @IsNumber()
  longitude?: number;
}