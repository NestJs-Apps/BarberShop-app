import { Module } from '@nestjs/common';
import { ScheduleDetailService } from './schedule-detail.service';
import { ScheduleDetailController } from './schedule-detail.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleDetails } from './entities/schedule-details.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScheduleDetails]),
  ],
  controllers: [ScheduleDetailController],
  providers: [ScheduleDetailService]
})
export class ScheduleDetailModule {}
