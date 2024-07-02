import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BarberService } from 'src/barber/barber.service';
import { ClientService } from 'src/client/client.service';
import { Repository } from 'typeorm';
import { ScheduleDetails } from './entities/schedule-details.entity';
import { Client } from 'src/client/entities/client.entity';
import { ServiceBarberEnum } from 'src/utils/enums/service-barber.enum';
import { ReserveScheduleDto } from 'src/client/dto/reserve-schedule.dto';

@Injectable()
export class ScheduleDetailService {
  constructor(
    private readonly clienteService: ClientService,
    @Inject(forwardRef(() => BarberService))
    private readonly barberService: BarberService,
    @InjectRepository(ScheduleDetails)
    private readonly scheduleDetailsRepository: Repository<ScheduleDetails>,
  ) {}
}
