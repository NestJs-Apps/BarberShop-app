import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, Put } from '@nestjs/common';
import { BarberService } from './barber.service';
import { CreateBarberDto } from './dto/create-barber.dto';
import { UpdateBarberDto } from './dto/update-barber.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Barber')
@Controller('barber')
export class BarberController {
  constructor(private readonly barberService: BarberService) {}

  @Post()
  @ApiOperation({ summary: 'Create a barber' })
  @ApiBearerAuth()
  create(@Body() createBarberDto: CreateBarberDto) {
    return this.barberService.createBarber(createBarberDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all barber' })
  @ApiBearerAuth()
  findAll() {
    return this.barberService.findAll();
  }

  @Get('get-one')
  @ApiOperation({ summary: 'Get one barber' })
  @ApiBearerAuth()
  findOne(@Query('idBarber', ParseIntPipe) idBarber: number) {
    return this.barberService.findBarberWithSchedules(idBarber);
  }

  @Get('barber-find/client-schedule')
  @ApiOperation({ summary: 'Barber get all clients scheduling' })
  @ApiBearerAuth()
  async findClientScheduling(
    @Query('idBarber') idBarber: number,
  ) {
    return this.barberService.findClientScheduling(idBarber);
  };

  @Delete('client/cancel-schedule-detail')
  @ApiOperation({ summary: 'Barber cancelled scheduling details' })
  @ApiBearerAuth()
  async barberCancelledSchedulingDetail(
    @Query('idBarber') ididBarber: number,
    @Query('idClient') idClient: number,
    @Query('idSchedule') idSchedule: number,
  ) {
    return this.barberService.cancelledSchedulingDetails(ididBarber, idClient, idSchedule);
  }

  @Put('/update-barber/:idBarber')
  @ApiOperation({ summary: 'Update Barber' })
  @ApiBearerAuth()
  async update(
    @Param('idBarber') idBarber: number,
    @Body() updateBarberDto: UpdateBarberDto,
  ) {
    return this.barberService.updateBarber(idBarber, updateBarberDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.barberService.remove(+id);
  }
}
