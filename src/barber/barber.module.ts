import { Module, forwardRef } from '@nestjs/common';
import { BarberService } from './barber.service';
import { BarberController } from './barber.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Barber } from './entities/barber.entity';
import { ScheduleDetailModule } from 'src/schedule-detail/schedule-detail.module';
import { ScheduleDetails } from 'src/schedule-detail/entities/schedule-details.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Barber, ScheduleDetails]),
    forwardRef(() => ScheduleDetailModule),
  ],
  controllers: [BarberController],
  providers: [BarberService],
  exports: [BarberService],
})
export class BarberModule {}
