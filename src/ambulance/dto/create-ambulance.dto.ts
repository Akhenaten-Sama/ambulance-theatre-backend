import { IsUUID, IsNumber, IsBoolean } from 'class-validator';

export class CreateAmbulanceDto {
  @IsUUID()
  driverId: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsBoolean()
  available: boolean;
}
