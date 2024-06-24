import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Client } from 'src/client/entities/client.entity';
import { Barber } from 'src/barber/entities/barber.entity';

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn()
  idSchedule: number;

  @Column()
  date: Date;

  @Column()
  time: string;

  @ManyToOne(() => Client, client => client.schedules)
  client: Client;

  @ManyToOne(() => Barber, barber => barber.schedules)
  barber: Barber;
}

