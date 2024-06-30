import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { Barber } from 'src/barber/entities/barber.entity';
import { BarberModule } from 'src/barber/barber.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Schedule, Barber]),
  ],
  controllers: [ScheduleController],
  providers: [ScheduleService]
})
export class ScheduleModule {}
