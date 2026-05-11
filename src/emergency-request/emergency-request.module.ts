import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmergencyRequestService } from './emergency-request.service';
import { EmergencyRequestController } from './emergency-request.controller';
import { EmergencyRequest } from './emergency-request.entity';
import { Ambulance } from '../ambulance/ambulance.entity';
import { User } from '../user/user.entity';
import { Hospital } from '../hospital/hospital.entity';
import { RealtimeModule } from '../realtime/realtime.module';

@Module({
  imports: [TypeOrmModule.forFeature([EmergencyRequest, Ambulance, User, Hospital]), RealtimeModule],
  controllers: [EmergencyRequestController],
  providers: [EmergencyRequestService],
  exports: [EmergencyRequestService],
})
export class EmergencyRequestModule {}
