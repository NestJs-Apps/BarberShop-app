import { Controller, Query, Get } from '@nestjs/common';
import { ScheduleDetailService } from './schedule-detail.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';


@ApiTags('Schedule Details')
@Controller('schedule-detail')
export class ScheduleDetailController {
  constructor(
    private readonly scheduleDetailService: ScheduleDetailService,
  ) {}
}
