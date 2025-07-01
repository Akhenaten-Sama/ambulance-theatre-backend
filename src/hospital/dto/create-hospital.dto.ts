import { IsString, IsNumber } from 'class-validator';
export class CreateHospitalDto {
  @IsString()
  name: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export class UpdateHospitalDto {
  @IsString()
  name?: string;

  @IsNumber()
  latitude?: number;

  @IsNumber()
  longitude?: number;

  createdAt?: Date;
  updatedAt?: Date;
}
