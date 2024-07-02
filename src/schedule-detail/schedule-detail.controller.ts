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
    @Query('idBarber') idBarber: number,
  ) {
    return this.scheduleDetailService.reserveSchedule(idClient, idSchedule, idBarber);
  };

  @Get('client/schedule')
  @ApiOperation({ summary: 'Barber get all clients scheduling' })
  @ApiBearerAuth()
  async findClientScheduling(
    @Query('idBarber') idBarber: number,
  ) {
    return this.scheduleDetailService.findClientScheduling(idBarber);
  };
}
