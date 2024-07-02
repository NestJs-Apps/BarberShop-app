import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import * as bcrypt from 'bcrypt';
import { TypeUserEnum } from 'src/utils/enums/type-user.enum';
import { Barber } from 'src/barber/entities/barber.entity';
import { ScheduleDetails } from 'src/schedule-detail/entities/schedule-details.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { StatusSubscriptionEnum } from 'src/utils/enums/status-subscription.enum';
import { StatusScheduleEnum } from 'src/utils/enums/status-schedule.enum';
import { ServiceBarberEnum } from 'src/utils/enums/service-barber.enum';
import { ReserveScheduleDto } from './dto/reserve-schedule.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Barber)
    private barberRepository: Repository<Barber>,
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    @InjectRepository(ScheduleDetails)
    private scheduleDetailsRepository: Repository<ScheduleDetails>,
  ) {}

  async create(createClientDto: CreateClientDto) {
    const client = await this.clientRepository.findOne({
      where: { cpf: createClientDto.cpf },
    });

    if (client) 
      throw new BadRequestException('Client already exists in database.');

    if (createClientDto.password !== createClientDto.confirmedPassword)
      throw new BadRequestException('Passwords must be identical');

    const salt = 10;
    const hashedPassword = await bcrypt.hash(createClientDto.password, salt);

    const clientEntity = this.clientRepository.create({
      ...createClientDto,
      password: hashedPassword,
      typeUser: TypeUserEnum.CLIENT,
    });
    
    await this.clientRepository.save(clientEntity);

    return clientEntity;
  };

  async findAvailableSchedules(idBarber: number) {
    const barber = await this.barberRepository.findOne({
      where: { idBarber },
      relations: [
        'schedules',
        'scheduleDetails',
        'scheduleDetails.client',
        'scheduleDetails.schedule'],
    });

    if (!barber) {
      throw new NotFoundException('Barber not found.');
    };

    if (barber.schedules.length < 0) {
      throw new NotFoundException('Barber not have schedulings.');
    };

     // Cria um conjunto com os IDs dos agendamentos que já possuem clientes associados
    const bookedScheduleIds = new Set(
      barber.scheduleDetails
      .filter(detail => detail.client !== null)
      .map(detail => detail.schedule.idSchedule)
    )

    // Filtra os agendamentos do barbeiro para encontrar os que não têm clientes associados
    const availableSchedule = barber.schedules.filter(
      schedule => !bookedScheduleIds.has(
        schedule.idSchedule,
      )
    )

    if (availableSchedule.length < 0) {
      throw new NotFoundException('No available schedules found.');
    }

    // Retorna os agendamentos disponíveis.
    return availableSchedule;
  };

  async reserveSchedule(
    reserveScheduleDto: ReserveScheduleDto,
    serviceBarberEnum: ServiceBarberEnum,
  ) {
    const client = await this.findOneById(reserveScheduleDto.idClient);

    const schedule = await this.scheduleRepository.findOne({
      where: { idSchedule: reserveScheduleDto.idSchedule },
      relations: ['scheduleDetails', 'scheduleDetails.schedule'],
    });

    const barber = await this.barberRepository.findOne({
      where: { idBarber: reserveScheduleDto.idBarber },
      relations: ['schedules', 'scheduleDetails'],
      select: ['idBarber', 'codeBarber', 'email', 'schedules', 'scheduleDetails'],
    })

    if (!schedule) {
      throw new NotFoundException('Schedule not found.');
    };

    if (!barber) {
      throw new NotFoundException('Barber not found.');
    };

    const reservedSchedule = schedule.scheduleDetails.some(
      detail => detail.status === StatusScheduleEnum.CONFIRMED,
    );

    if (reservedSchedule) {
      throw new BadRequestException('Schedule already booked');
    };

    if (client.clientSubscriptions[0].status === StatusSubscriptionEnum.CANCELLED) {
      throw new BadRequestException('Client with canceled subscription');
    };

    const scheduleDetails = this.scheduleDetailsRepository.create({
      client,
      schedule,
      barber,
      status: StatusScheduleEnum.CONFIRMED,
      serviceDescription: serviceBarberEnum || null, 
    });

    return this.scheduleDetailsRepository.save(scheduleDetails);
  }

  async findAll() {
    return this.clientRepository.find({
      relations: ['clientSubscriptions']
    });
  };

  async findOneById(id: number) {
    const client = await this.clientRepository.findOne({
      where: { idClient: id },
      relations: [
        'clientSubscriptions',
        'clientSubscriptions.subscription',
        'scheduleDetails.barber',
      ],
      select: [
        'idClient',
        'name',
        'email',
        'phone',
        'scheduleDetails',
        'clientSubscriptions',
      ],
    });

    if (!client) 
      throw new NotFoundException('Client not found in database.');
    
      return client;
  }

  update(id: number, updateClientDto: UpdateClientDto) {
    return `This action updates a #${id} client`;
  }

  remove(id: number) {
    return `This action removes a #${id} client`;
  }
}
