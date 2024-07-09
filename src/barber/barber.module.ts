import { Module, forwardRef } from '@nestjs/common';
import { BarberService } from './barber.service';
import { BarberController } from './barber.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Barber } from './entities/barber.entity';
import { ScheduleDetailModule } from 'src/schedule-detail/schedule-detail.module';
import { ScheduleDetails } from 'src/schedule-detail/entities/schedule-details.entity';
import { BarberRepository } from './entities/barber.repository';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { ScheduleModule } from 'src/schedule/schedule.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Barber,
      Schedule,
      ScheduleDetails,
  ]),
    forwardRef(() => ScheduleDetailModule),
    forwardRef(() => ScheduleModule),
  ],
  controllers: [BarberController],
  providers: [BarberService, BarberRepository],
  exports: [BarberService],
})
export class BarberModule {}
