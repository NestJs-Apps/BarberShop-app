import { Module, forwardRef } from '@nestjs/common';
import { ScheduleDetailService } from './schedule-detail.service';
import { ScheduleDetailController } from './schedule-detail.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleDetails } from './entities/schedule-details.entity';
import { ClientModule } from 'src/client/client.module';
import { BarberModule } from 'src/barber/barber.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScheduleDetails]),
    ClientModule,
    forwardRef(() => BarberModule),
  ],
  controllers: [ScheduleDetailController],
  providers: [ScheduleDetailService],
  exports: [ScheduleDetailService],
})
export class ScheduleDetailModule {}
