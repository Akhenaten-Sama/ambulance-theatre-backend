import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AmbulanceModule } from './ambulance/ambulance.module';
import { TheatreModule } from './theatre/theatre.module';
import { HospitalModule } from './hospital/hospital.module';
import { DatabaseModule } from './database/database.module';
import { EmergencyRequestModule } from './emergency-request/emergency-request.module';
import { BookingModule } from './booking/booking.module';
import { NotificationModule } from './notification/notification.module';
import { RealtimeModule } from './realtime/realtime.module';
import { configuration, validationSchema } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration], validationSchema }),
    AuthModule,
    UserModule,
    DatabaseModule,
    AmbulanceModule,
    TheatreModule,
    HospitalModule,
    EmergencyRequestModule,
    BookingModule,
    NotificationModule,
    RealtimeModule,
  ],
})
export class AppModule {}