import { Controller } from '@nestjs/common';
import { ScheduleDetailService } from './schedule-detail.service';

@Controller('schedule-detail')
export class ScheduleDetailController {
  constructor(private readonly scheduleDetailService: ScheduleDetailService) {}
}
