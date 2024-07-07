import { Module, forwardRef } from '@nestjs/common';
import { BarberService } from './barber.service';
import { BarberController } from './barber.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Barber } from './entities/barber.entity';
import { ScheduleDetailModule } from 'src/schedule-detail/schedule-detail.module';
import { ScheduleDetails } from 'src/schedule-detail/entities/schedule-details.entity';
import { BarberRepository } from './entities/barber.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Barber, ScheduleDetails]),
    forwardRef(() => ScheduleDetailModule),
  ],
  controllers: [BarberController],
  providers: [BarberService, BarberRepository],
  exports: [BarberService],
})
export class BarberModule {}
