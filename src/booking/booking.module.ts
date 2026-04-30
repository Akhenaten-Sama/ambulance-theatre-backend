import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TheatreBooking } from './booking.entity';
import { Theatre } from '../theatre/theatre.entity';
import { Hospital } from '../hospital/hospital.entity';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TheatreBooking, Theatre, Hospital, User])],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
