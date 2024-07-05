import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from './entities/schedule.entity';
import { parse, subHours } from 'date-fns';
import { PaginationDto } from 'src/utils/pagination.dto';
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

  async findAllSchedulings(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    
    const [ results, total ] = await this.scheduleRepository.createQueryBuilder('schedule')
    .select([
      'schedule.idSchedule',
      'schedule.date',
      'barber.idBarber',
      'barber.name',
      'barber.email',
      'barber.phone',
    ])
    .leftJoin('schedule.barber', 'barber')
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount();

    return {
      data: results,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    }
  }

  async findOneScheduling(idSchedule: number) {
    const schedule = await this.scheduleRepository.createQueryBuilder('schedule')
    .select([
      'schedule.idSchedule',
      'schedule.date',
      'barber.idBarber',
      'barber.name',
      'barber.email',
      'barber.phone',
    ])
    .leftJoin('schedule.barber', 'barber')
    .where('schedule.idSchedule = :idSchedule', { idSchedule })
    .getOne();
  
    if (!schedule) {
      throw new NotFoundException('Barber dont have scheduling');
    };

    const scheduleSubHours = subHours(schedule.date, 3);

    schedule.date = scheduleSubHours;

    await this.scheduleRepository.save(schedule);

    return schedule;
  }

  update(id: number, date: Date) {
    return `This action updates a #${id} schedule`;
  }

  remove(id: number) {
    return `This action removes a #${id} schedule`;
  }
}
