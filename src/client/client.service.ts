import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { TypeUserEnum } from 'src/utils/enums/type-user.enum';
import { Barber } from 'src/barber/entities/barber.entity';
import { ScheduleDetails } from 'src/schedule-detail/entities/schedule-details.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { StatusSubscriptionEnum } from 'src/utils/enums/status-subscription.enum';
import { StatusScheduleEnum } from 'src/utils/enums/status-schedule.enum';
import { ServiceBarberEnum } from 'src/utils/enums/service-barber.enum';
import { ReserveScheduleDto } from './dto/reserve-schedule.dto';
import { ClientStatusEnum } from 'src/utils/enums/client-status.enum';
import { ClientRepository } from './entities/client.repository';
import { PaginationDto } from 'src/utils/pagination.dto';
import { User } from 'src/user/entities/user.entity';
import { subHours } from 'date-fns';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(ClientRepository)
    private readonly clientRepository: ClientRepository,
    @InjectRepository(Barber)
    private readonly barberRepository: Repository<Barber>,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    @InjectRepository(ScheduleDetails)
    private readonly scheduleDetailsRepository: Repository<ScheduleDetails>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createClientDto: CreateClientDto) {
    const client = await this.clientRepository.findOneByEmail(
      createClientDto.email,
    );

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
      status: ClientStatusEnum.ALLOWED,
    });

    await this.clientRepository.save(clientEntity);
    
    await this.userRepository.save({
      email: createClientDto.email,
      password: hashedPassword,
      typeUser: TypeUserEnum.CLIENT,
      status: ClientStatusEnum.ALLOWED, 
      client: clientEntity,
    });

    const {
      password,
      createdAt,
      updatedAt, 
      ...response
    } = clientEntity;

    return response;
  };

  async findAvailableSchedules(idBarber: number) {
    const barber = await this.barberRepository.findOne({
      where: { idBarber },
      relations: [
        'schedules',
        'scheduleDetails',
        'scheduleDetails.client',
        'scheduleDetails.schedule',
      ],
    });

    if (!barber) {
      throw new NotFoundException('Barber not found.');
    };

    if (barber.schedules.length === 0) {
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

    if (availableSchedule.length === 0) {
      throw new NotFoundException('No available schedules found.');
    }

    const corretcHoursSchedule = availableSchedule.map(sc => {
      return {
        idSchedule: sc.idSchedule,
        date: subHours(sc.date, 3),
        status: sc.status,
      };
    });

    // Retorna os agendamentos disponíveis.
    return corretcHoursSchedule;
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
      select: [
        'idBarber',
        'codeBarber',
        'email',
        'schedules',
        'scheduleDetails',
      ],
    })

    if (!schedule) {
      throw new NotFoundException('Schedule not found.');
    };

    if (!barber) {
      throw new NotFoundException('Barber not found.');
    };
      
    if (schedule.status === StatusScheduleEnum.CONFIRMED ||
        schedule.status === StatusScheduleEnum.PENDING
    ) {
      throw new BadRequestException('Schedule already booked');
    };

    if (client.clientSubscriptions[0].status === StatusSubscriptionEnum.CANCELLED) {
      throw new BadRequestException('Client with canceled subscription');
    };

    if (client.status === ClientStatusEnum.BLOCKED) {
      throw new BadRequestException('Client blocked');
    };

    const scheduleDetails = this.scheduleDetailsRepository.create({
      client,
      schedule,
      barber,
      status: StatusScheduleEnum.PENDING,
      serviceDescription: serviceBarberEnum || null, 
    });

    await this.scheduleRepository.update(scheduleDetails.schedule.idSchedule, {
      status: StatusScheduleEnum.PENDING,
    });

    return this.scheduleDetailsRepository.save(scheduleDetails);
  }

  async findAll(paginationDto: PaginationDto) {
    return this.clientRepository.findAllClients(paginationDto);
  };

  async findOneById(idClient: number) {
    const client = await this.clientRepository.findOneClientById(idClient);

    if (!client) 
      throw new NotFoundException('Client not found in database.');
    
      return client;
  };

  async findOneByEmail(email: string) {
    return this.clientRepository.findOneByEmail(email);
  }

  async softDeleteClient(idClient: number) {
    const client = await this.findOneById(idClient);

    if (client.status === ClientStatusEnum.BLOCKED) {
      throw new BadRequestException(`The client ${client.name} is already blocked.`);
    }

    client.status = ClientStatusEnum.BLOCKED,
    await this.clientRepository.save(client);

    return {
      message: `The client ${client.name} was blocked with success`,
      client: {
        idClient: client.idClient,
        status: client.status,
      },
    };
  };
}
