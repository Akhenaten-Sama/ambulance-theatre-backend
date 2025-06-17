import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ambulance } from './ambulance.entity';
import { User } from '../user/user.entity';
import { AmbulanceService } from './ambulance.service';
import { AmbulanceController } from './ambulance.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Ambulance, User])],
  providers: [AmbulanceService],
  controllers: [AmbulanceController],
})
export class AmbulanceModule {}
