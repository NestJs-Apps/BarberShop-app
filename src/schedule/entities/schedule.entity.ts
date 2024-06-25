import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Client } from 'src/client/entities/client.entity';
import { Barber } from 'src/barber/entities/barber.entity';
import { ScheduleDetails } from 'src/schedule-detail/entities/schedule-details.entity';

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn()
  idSchedule: number;

  @Column()
  date: Date;

  @Column({ nullable: true })
  serviceDescription: string;

  @OneToMany(() => ScheduleDetails, (scheduleDetails) => scheduleDetails.schedule)
  scheduleDetails: ScheduleDetails[];

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;
}

