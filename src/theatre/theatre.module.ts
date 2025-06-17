import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Theatre } from './theatre.entity';
import { Hospital } from '../hospital/hospital.entity';
import { TheatreService } from './theatre.service';
import { TheatreController } from './theatre.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Theatre, Hospital])],
  providers: [TheatreService],
  controllers: [TheatreController],
})
export class TheatreModule {}

