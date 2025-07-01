import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule,  } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AmbulanceModule } from './ambulance/ambulance.module';
import { TheatreModule } from './theatre/theatre.module';
import { HospitalModule } from './hospital/hospital.module';
import { DatabaseModule } from './database/database.module';
import { configuration, validationSchema } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true,  load: [configuration], validationSchema}), // or DatabaseModule if using the wrapper
    AuthModule,
    UserModule,
    DatabaseModule,
    AmbulanceModule,
    TheatreModule,
    HospitalModule,
  ],
})
export class AppModule {}