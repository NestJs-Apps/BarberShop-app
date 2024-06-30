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
      relations: ['schedules'],
      select: ['name', 'email', 'schedules'],
    });

    if (!barber) {
      throw new NotFoundException('Barber not found.');
    };

    if (barber.schedules.length < 0) {
      throw new NotFoundException('Barber not have schedulings.');
    }

    return barber.schedules;
  };

  async reserveSchedule(idClient: number, idSchedule: number) {
    const client = await this.findOneById(idClient);

    const schedule = await this.scheduleRepository.findOne({
      where: { idSchedule: idSchedule },
      relations: ['scheduleDetails'],
    });

    if (!schedule) {
      throw new NotFoundException('Schedule not found.');
    };

    const reservedSchedule = schedule.scheduleDetails.some(
      detail => detail.client,
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
      barber: schedule.barber,
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
