import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from './entities/schedule.entity';
import { format, isMatch, isValid, parse } from 'date-fns';
import { Barber } from 'src/barber/entities/barber.entity';
import { PaginationDto } from 'src/utils/pagination.dto';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    @InjectRepository(Barber)
    private readonly barberRepository: Repository<Barber>,
  ) {}

  async createSchedule(idBarber: number, date: string) {
    const barber = await this.barberRepository.findOne({
      where: { idBarber },
      relations: [
        'schedules',
        'scheduleDetails',
        'scheduleDetails.schedule',
      ],
      select: ['idBarber', 'name', 'email'],
    });

    if (!barber) {
      throw new NotFoundException('Barber not found');
    };

    const dateFormat = 'dd-MM-yyyy HH:mm';
    if (!isMatch(date, dateFormat)) {
      throw new BadRequestException(`Invalid date format. Expected format: ${dateFormat}`);
    }

    const parseDate: Date = parse(date, dateFormat, new Date());

    if (!isValid(parseDate)) {
      throw new BadRequestException('Invalid date format. Expected format: dd-MM-yyyy HH:mm')
    };

    const formatDate = format(parseDate, 'yyyy-MM-dd HH:mm');
    
    const existingSchedule = await this.scheduleRepository.findOne({
      where: {
        date: parseDate,
        barber: {
          idBarber: barber.idBarber,
        }
      }
    })

    if (existingSchedule) {
      throw new BadRequestException('The selected date and time are already booked.');
    };

    const schedule = this.scheduleRepository.create({
      date: formatDate, 
      barber,
    });
    
    barber.schedules.push(schedule);
    
    const savedSchedule = await this.scheduleRepository.save(schedule);
    
    await this.barberRepository.save(barber);

    const response: Partial<Schedule> = {
      idSchedule: savedSchedule.idSchedule,
      date: savedSchedule.date,
      barber: savedSchedule.barber,
    }

    return response;
  };

  async findAll(paginationDto: PaginationDto) {
    return this.scheduleRepository.find({
      skip: paginationDto.skip,
      take: paginationDto.limit,
      relations: ['barber'], 
    });
  }

  async findOneScheduling(idBarber: number) {
    const barber = await this.barberRepository.findOne({
      where: { idBarber },
      relations: ['schedules'],
    });
    
    if (!barber)
      throw new NotFoundException('Barber not found.');;

    if (barber.schedules.length < 0) {
      throw new NotFoundException('Barber dont have scheduling');
    };

    let obj = {};
    let response = {};

    for (const schedule of barber.schedules) {
     response =  Object.assign(obj, {
      idSchedule: schedule.idSchedule,
      date: schedule.date,
    });
    };

    return response;
  }

  update(id: number, date: Date) {
    return `This action updates a #${id} schedule`;
  }

  remove(id: number) {
    return `This action removes a #${id} schedule`;
  }
}
