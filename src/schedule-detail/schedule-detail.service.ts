import { Injectable, NotFoundException } from '@nestjs/common';
import { BarberService } from 'src/barber/barber.service';
import { ClientService } from 'src/client/client.service';

@Injectable()
export class ScheduleDetailService {
  constructor(
    private readonly clienteService: ClientService,
    private readonly barberService: BarberService,
  ) {}

  async reserveSchedule(idClient: number, idSchedule: number) {
    return this.clienteService.reserveSchedule(idClient, idSchedule);
  }

  async findClientScheduling(idBarber: number) {
    const barber = await this.barberService.findOneById(idBarber);

    const clientScheduling = barber.scheduleDetails.filter(
      scheduleDetail => scheduleDetail.client,
    );

    if (clientScheduling.length < 0) {
      throw new NotFoundException('No scheduling with clients found')
    };

    return clientScheduling;
  }
}
