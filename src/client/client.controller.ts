import { Controller, Get, Post, Body, Query, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { TypeUserEnum } from 'src/utils/enums/type-user.enum';

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

  @Get(':id')
  @ApiOperation({ summary: 'Get one client' })
  @ApiBearerAuth()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.clientService.findOneById(id);
  }

  @Get(':id/barbers/:idBarber/schedules')
  @ApiOperation({ summary: 'Find available schedules' })
  @ApiBearerAuth()
  findAvailableSchedules(
    @Param('idBarber') idBarber: number,
  ) {
    return this.clientService.findAvailableSchedules(idBarber);
  }

  @Post('client/reserve-scheduling')
  @ApiOperation({ summary: 'Client reserve schedules' })
  @ApiBearerAuth()
  bookSchedule(
    @Query('idClient') idClient: number,
    @Query('idSchedule') idSchedule: number,
    @Query('idBarber') idBarber: number,
  ) {
    return this.clientService.reserveSchedule(idClient, idSchedule, idBarber);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientService.update(+id, updateClientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientService.remove(+id);
  }
}
