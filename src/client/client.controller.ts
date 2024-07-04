import { Controller, Get, Post, Body, Query, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ServiceBarberEnum } from 'src/utils/enums/service-barber.enum';
import { ReserveScheduleDto } from './dto/reserve-schedule.dto';

@ApiTags('Client')
@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @ApiOperation({ summary: 'Create a client' })
  @ApiBearerAuth()
  async create(@Body() createClientDto: CreateClientDto) {
    return this.clientService.create(createClientDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all clients' })
  @ApiBearerAuth()
  findAll() {
    return this.clientService.findAll();
  }

  @Get('find-available-schedules')
  @ApiOperation({ summary: 'Find available schedules' })
  @ApiBearerAuth()
  findAvailableSchedules(
    @Query('idBarber', ParseIntPipe) idBarber: number,
  ) {
    return this.clientService.findAvailableSchedules(idBarber);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one client' })
  @ApiBearerAuth()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.clientService.findOneById(id);
  }

  @Post('client/reserve-scheduling')
  @ApiOperation({ summary: 'Client reserve schedules' })
  @ApiBearerAuth()
  @ApiQuery({ name: 'serviceBarber', enum: ServiceBarberEnum, required: false })
  bookSchedule(
    @Body() reserveScheduleDto: ReserveScheduleDto,
    @Query('serviceBarber') serviceBarber: ServiceBarberEnum,
  )  {
    return this.clientService.reserveSchedule(reserveScheduleDto, serviceBarber);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
  //   return this.clientService.update(+id, updateClientDto);
  // }

  @Delete('barber/blocked-client')
  @ApiOperation({ summary: 'Barber blocked client' })
  @ApiBearerAuth()
  remove(@Query('idClient') idClient: number) {
    return this.clientService.softDeleteClient(idClient);
  }
}
