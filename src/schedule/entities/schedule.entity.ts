import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn, ManyToOne } from 'typeorm';
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

  @ManyToOne(() => Barber, (barber) => barber.schedules)
  @JoinColumn({ name: 'barberId', referencedColumnName: 'idBarber' })
  barber: Barber;

  @OneToMany(() => ScheduleDetails, (scheduleDetails) => scheduleDetails.schedule)
  scheduleDetails: ScheduleDetails[];

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;
}

