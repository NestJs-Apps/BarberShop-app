import { Controller, Get, Post, Body, Query, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ServiceBarberEnum } from 'src/utils/enums/service-barber.enum';
import { ReserveScheduleDto } from './dto/reserve-schedule.dto';
import { PaginationDto } from 'src/utils/pagination.dto';

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
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'page', type: Number, required: false })
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.clientService.findAll(paginationDto);
  }

  @Get('find-available-schedules')
  @ApiOperation({ summary: 'Find available schedules' })
  @ApiBearerAuth()
  findAvailableSchedules(
    @Query('idBarber', ParseIntPipe) idBarber: number,
  ) {
    return this.clientService.findAvailableSchedules(idBarber);
  }

  @Get(':idClient')
  @ApiOperation({ summary: 'find one client' })
  @ApiBearerAuth()
  async findOne(@Param('idClient', ParseIntPipe) idClient: number) {
    return this.clientService.findOneById(idClient);
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
