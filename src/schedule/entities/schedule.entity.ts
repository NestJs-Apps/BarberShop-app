import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { ScheduleDetails } from 'src/schedule-detail/entities/schedule-details.entity';
import { Barber } from 'src/barber/entities/barber.entity';
import { IsDate } from 'class-validator';
import { Expose, Transform } from 'class-transformer';

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn()
  idSchedule: number;

  @Column()
  @IsDate()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @Expose({ name: 'date' })
  date: Date;

  @Column({ default: null })
  status: string;

  @ManyToOne(() => Barber, (barber) => barber.schedules)
  @JoinColumn({ name: 'barberId', referencedColumnName: 'idBarber' })
  barber: Barber;

  @OneToMany(() => ScheduleDetails, (scheduleDetails) => scheduleDetails.schedule)
  scheduleDetails: ScheduleDetails[];
}

