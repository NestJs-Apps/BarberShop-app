import { BadRequestException, Injectable, NotFoundException, forwardRef, Inject } from '@nestjs/common';
import { CreateBarberDto } from './dto/create-barber.dto';
import { UpdateBarberDto } from './dto/update-barber.dto';
import { Repository } from 'typeorm';
import { Barber } from './entities/barber.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { TypeUserEnum } from 'src/utils/enums/type-user.enum';
import { v4 as uuid } from 'uuid';
import { subHours } from 'date-fns';
import { ScheduleDetails } from 'src/schedule-detail/entities/schedule-details.entity';
import { StatusScheduleEnum } from 'src/utils/enums/status-schedule.enum';
import { Client } from 'src/client/entities/client.entity';
import { BarberRepository } from './entities/barber.repository';
import { ScheduleService } from 'src/schedule/schedule.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class BarberService {
  constructor(
    @InjectRepository(BarberRepository)
    private readonly barberRepository: BarberRepository,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ScheduleDetails)
    private readonly scheduleDetailRepository: Repository<ScheduleDetails>,
    @Inject(forwardRef(() => ScheduleService))
    private readonly scheduleService: ScheduleService,
  ) {}

  async createBarber(createBarberDto: CreateBarberDto) {
    const barber = await this.barberRepository.findOne({
      where: { cpf: createBarberDto.cpf },
    });

    if (barber)
      throw new BadRequestException('Barber already exists in database.');

    if (createBarberDto.password !== createBarberDto.confirmedPassword)
      throw new BadRequestException('Passwords must be identical.');

    const salt = 10;
    const hashedPassword = await bcrypt.hash(createBarberDto.password, salt);

    const createBarber = this.barberRepository.create({
      ...createBarberDto,
      password: hashedPassword,
      codeBarber: uuid(),
      typeUser: TypeUserEnum.BARBER,
    });

    const user = this.userRepository.create({
      email: createBarberDto.email,
      password: hashedPassword,
      typeUser: TypeUserEnum.BARBER,
      barber: createBarber,
    });

    await this.userRepository.save(user);

    const savedBarber = await this.barberRepository.save(createBarber);

    const response: Partial<Barber> = {
      idBarber: savedBarber.idBarber,
      name: savedBarber.name,
      email: savedBarber.email,
      cpf: savedBarber.cpf,
      phone: savedBarber.phone,
    };

    return response;
  };

  findAll() {
    return this.barberRepository.find();
  }

  async findOneById(idBarber: number) {
    const barber = await this.barberRepository.findBarberById(idBarber);

    if (!barber)
      throw new NotFoundException('Barber not found.');

    return barber;
  }

  async findBarberWithSchedules(idBarber: number) {
    const barber = await this.barberRepository.findOne({
      where: { idBarber },
      relations: ['schedules'],
      select: ['idBarber', 'name', 'email', 'schedules'],
    });

    if (!barber)
      throw new NotFoundException('Barber not found.');

    barber.schedules = barber.schedules.map(schedule => {
      return {
        ...schedule,
        date: subHours(schedule.date, 3)
      };
    });

    return barber;
  };

  async cancelledSchedulingDetails(idBarber: number, idClient: number, idSchedule: number) {
    const scheduleDetail = await this.scheduleDetailRepository.findOne({
      where: {
        barber: { idBarber },
        client: { idClient },
        schedule: { idSchedule },
      },
      relations: ['barber', 'client', 'schedule'],
      select: ['id', 'barber', 'client', 'schedule', 'status'],
    });

    if (!scheduleDetail) {
      throw new NotFoundException('Schedule details not found.');
    };

    if (scheduleDetail.status === StatusScheduleEnum.CANCELLED) {
      throw new BadRequestException('This schedule detail is already cancelled');
    };

    scheduleDetail.status = StatusScheduleEnum.CANCELLED;
    await this.scheduleDetailRepository.save(scheduleDetail);

    return {
      message: `Schedule detail of client: ${scheduleDetail.client.name} its cancelled.`,
      idScheduleDetail: scheduleDetail.id,
      idClient: scheduleDetail.client.idClient,
      idBarber: scheduleDetail.barber.idBarber,
    };  
  }

  async barberConfirmedSchedule(idSchedule: number, idBarber: number, idScheduleDetail: number) {
    const scheduleDetail = await this.scheduleDetailRepository.findOne({
      where: {
        id: idScheduleDetail,
        barber: { idBarber },
        schedule: { idSchedule },
      },
      relations: ['barber', 'schedule'],
    });

    if (!scheduleDetail) {
      throw new NotFoundException('Schedule Details not found.');
    }

    const barber = await this.barberRepository.findBarberById(idBarber)
    
    if (!barber) {
      throw new NotFoundException('Barber not found.');
    }

    const schedule = await this.scheduleService.findOneScheduling(idSchedule);

    if (!schedule) {
      throw new NotFoundException('Schedule not found.');
    };

    // Verifique se o agendamento pertence ao barbeiro
    if (scheduleDetail.barber.idBarber !== idBarber) {
      throw new BadRequestException('This schedule is not assigned to the specified barber.');
    }

    if (scheduleDetail.id !== idScheduleDetail && scheduleDetail.barber.idBarber !== barber.idBarber) {
      throw new NotFoundException('ScheduleDetail not found for this schedule and barber.');
    }

      schedule.status = StatusScheduleEnum.CONFIRMED;
      await this.scheduleService.saveSchedule(schedule);

      await this.scheduleDetailRepository.update(scheduleDetail.id, {
        status: StatusScheduleEnum.CONFIRMED,
      });

    return {
      message: `Schedule: ${scheduleDetail.schedule.date} is confirmed.`,
      idSchedule: scheduleDetail.schedule.idSchedule,
      idScheduleDetail: scheduleDetail.id,
    };
  }

  async findClientScheduling(idBarber: number) {
    await this.findOneById(idBarber);

    const scheduleDetails = await this.scheduleDetailRepository.find({
      where: { barber: { idBarber } },
      relations: ['client', 'schedule'],
    });

    const clientsScheduling = scheduleDetails.filter(
      detail => detail.client !== null,
    );

    if (clientsScheduling.length < 0) {
      throw new NotFoundException('No scheduling with clients found')
    };

    const clients = clientsScheduling.map(detail => detail.client);
    // Remove duplicados da lista de clientes
    const uniqueClients = Array.from(new Set(clients.map(client => client.idClient)))
        .map(idClient => {
            return clients.find(client => client.idClient === idClient);
        });

    const client = uniqueClients.map((cl): Partial<Client> => {
      return {
        idClient: cl.idClient,
        name: cl.name,
        email: cl.email,
        cpf: cl.cpf,
      };
    });

    const clientSchedulingResponse = clientsScheduling.map((detail: Partial<ScheduleDetails>) => {
      return {
          idClient: detail.client.idClient,
          idScheduleDetail: detail.id,
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

  async updateBarber(idBarber: number, updateBarberDto: UpdateBarberDto) {
    const barber = await this.findOneById(idBarber);

    if (!barber.codeBarber) {
      throw new BadRequestException('This barber dont have code')
    };

    await this.barberRepository.update(barber.idBarber, {
      ...updateBarberDto,
    });

    return {
      message: `Barber ${barber.name} was updated with success`,
      idBarber: barber.idBarber,
    };
  }

  async findOneByEmail(email: string) {
    return this.barberRepository.findOneByEmail(email);
  };

  async saveBarber(barber: Partial<Barber>) {
    return this.barberRepository.save(barber);
  };

  remove(id: number) {
    return `This action removes a #${id} barber`;
  }

  
}
