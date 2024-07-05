import { Controller, Get, Post, Query, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/utils/pagination.dto';

@ApiTags('Schedule')
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post('barber/:idBarber')
  @ApiOperation({ summary: 'Barber Create a schedule' })
  @ApiBearerAuth()
  @ApiQuery({ name: 'date', example: '30-12-2024 14:30' })
  createSchedule(
    @Param('idBarber', ParseIntPipe) idBarber: number,
    @Query('date') date: string,
  ) {
    return this.scheduleService.createSchedule(idBarber, date);
  }

  @Get()
  @ApiOperation({ summary: 'Barber get all schedulings' })
  @ApiBearerAuth()
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'page', type: Number, required: false })
    async findAll(@Query() paginationDto: PaginationDto) {
      return this.scheduleService.findAllSchedulings(paginationDto);
  }

  @Get('/barber/:idBarber')
  @ApiOperation({ summary: 'Barber find one schedule' })
  @ApiBearerAuth()
    async findOne(@Param('idBarber', ParseIntPipe) idBarber: number) {
      return this.scheduleService.findOneScheduling(idBarber);
    }

  @Patch(':id')
  update(@Param('id') id: string, @Body() date: Date) {
    return this.scheduleService.update(+id, date);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scheduleService.remove(+id);
  }
}
