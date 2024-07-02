import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

@Injectable()
export class BarberService {
  constructor(
    @InjectRepository(Barber)
    private readonly barberRepository: Repository<Barber>,
    @InjectRepository(ScheduleDetails)
    private readonly scheduleDetailRepository: Repository<ScheduleDetails>,
  ) {}

  async create(createBarberDto: CreateBarberDto) {
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
      codeBarber: uuid(),
      typeUser: TypeUserEnum.BARBER,
      password: hashedPassword,
      ...createBarberDto,
    });

    return this.barberRepository.save(createBarber);
  };

  findAll() {
    return this.barberRepository.find();
  }

  async findOneById(id: number) {
    const barber = await this.barberRepository.findOne({
      where: { idBarber: id },
      relations: [
        'schedules',
        'scheduleDetails',
        'scheduleDetails.schedule',
        'scheduleDetails.client',
      ],
      select: ['idBarber', 'name', 'email', 'schedules', 'scheduleDetails'],
    });

    if (!barber)
      throw new NotFoundException('Barber not found.');

    const response: Partial<Barber> = {
      name: barber.name,
      email: barber.email,
      schedules: barber.schedules,
      scheduleDetails: barber.scheduleDetails,
    };

    return response;
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

  update(id: number, updateBarberDto: UpdateBarberDto) {
    return `This action updates a #${id} barber`;
  }

  remove(id: number) {
    return `This action removes a #${id} barber`;
  }

  async saveBarber(barber: Partial<Barber>) {
    return this.barberRepository.save(barber);
  };
}
