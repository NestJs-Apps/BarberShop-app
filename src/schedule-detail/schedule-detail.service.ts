import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BarberService } from 'src/barber/barber.service';
import { ClientService } from 'src/client/client.service';
import { Repository } from 'typeorm';
import { ScheduleDetails } from './entities/schedule-details.entity';
import { Client } from 'src/client/entities/client.entity';

@Injectable()
export class ScheduleDetailService {
  constructor(
    private readonly clienteService: ClientService,
    @Inject(forwardRef(() => BarberService))
    private readonly barberService: BarberService,
    @InjectRepository(ScheduleDetails)
    private readonly scheduleDetailsRepository: Repository<ScheduleDetails>,
  ) {}

  async reserveSchedule(idClient: number, idSchedule: number, idBarber: number) {
    return this.clienteService.reserveSchedule(idClient, idSchedule, idBarber);
  }

  async findClientScheduling(idBarber: number) {
    await this.barberService.findOneById(idBarber);

    const scheduleDetails = await this.scheduleDetailsRepository.find({
      where: { barber: { idBarber } },
      relations: ['client', 'schedule'],
    });

    const clientsScheduling = scheduleDetails.filter(
      detail => detail.client !== null,
    );

    if (clientsScheduling.length < 0) {
      throw new NotFoundException('No scheduling with clients found')
    };

    const client = clientsScheduling.map((cl): Partial<Client> => {
      return {
        idClient: cl.client.idClient,
        name: cl.client.name,
        email: cl.client.email,
        cpf: cl.client.cpf,
      };
    });

    const clientSchedulingResponse = clientsScheduling.map((detail: Partial<ScheduleDetails>) => {
      return {
          id: detail.id,
          serviceDescription: detail.serviceDescription,
          status: detail.status,
          schedule: {
              idSchedule: detail.schedule.idSchedule,
              date: detail.schedule.date,
          }
      };
  });

    return {
      client,
      clientSchedulingResponse,
    }
  }
}
