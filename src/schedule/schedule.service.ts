import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from './entities/schedule.entity';
import { parse, subHours } from 'date-fns';
import { PaginationDto } from 'src/utils/pagination.dto';
import * as moment from 'moment-timezone';
import { BarberService } from 'src/barber/barber.service';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    private readonly barberService: BarberService,
  ) {}

  async createSchedule(idBarber: number, date: string) {
    const barber = await this.barberService.findBarberWithSchedules(idBarber);

    const parsedDate = parse(date, 'dd-MM-yyyy HH:mm', new Date())
    
    if (isNaN(parsedDate.getTime())) {
      throw new BadRequestException('Invalid date format');
    };    

    const adjustedDate = subHours(parsedDate, 3);

    const existingSchedule = await this.scheduleRepository.findOne({
      where: {
        date: adjustedDate,
        barber: {
          idBarber: barber.idBarber,
        }
      }
    })

    if (existingSchedule) {
      throw new BadRequestException('The selected date and time are already booked.');
    };

    const schedule = this.scheduleRepository.create({
      date: adjustedDate, 
      barber,
    });
    
    barber.schedules.push(schedule);
    await this.barberService.saveBarber(barber);
    
    const savedSchedule = await this.scheduleRepository.save(schedule);

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
    const schedules = await this.scheduleRepository.find({
      where: {barber: { idBarber }},
      relations: ['barber'],
    });
  
    if (!schedules.length) {
      throw new NotFoundException('Barber dont have scheduling');
    };

    schedules.forEach(schedule => {
      schedule.date = moment(schedule.date)
        .tz('America/Sao_Paulo')
        .toDate();
    });

    let obj = {};
    let response = {};

    for (const schedule of schedules) {
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
