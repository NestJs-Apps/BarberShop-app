import { Controller, Query, Post, Get } from '@nestjs/common';
import { ScheduleDetailService } from './schedule-detail.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Schedule Details')
@Controller('schedule-detail')
export class ScheduleDetailController {
  constructor(
    private readonly scheduleDetailService: ScheduleDetailService,
  ) {}

  @Post('client/schedule')
  @ApiOperation({ summary: 'Client booke a schedule' })
  @ApiBearerAuth()
  async bookeSchedule(
    @Query('idClient') idClient: number,
    @Query('idSchedule') idSchedule: number,
  ) {
    return this.scheduleDetailService.reserveSchedule(idClient, idSchedule);
  };

  @Get('client/schedule')
  @ApiOperation({ summary: 'Client booke a schedule' })
  @ApiBearerAuth()
  async findClientScheduling(
    @Query('idCBarber') idBarber: number,
  ) {
    return this.scheduleDetailService.findClientScheduling(idBarber);
  };
}
