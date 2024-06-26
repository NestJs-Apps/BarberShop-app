import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ScheduleDetails } from 'src/schedule-detail/entities/schedule-details.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';

@Entity()
export class Barber {
  @PrimaryGeneratedColumn()
  idBarber: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  cpf: string;

  @Column()
  codeBarber: string;

  @Column()
  phone: string;

  @Column()
  typeUser: string;

  @OneToMany(() => Schedule, schedule => schedule.barber)
  schedules: Schedule[];

  @OneToMany(() => ScheduleDetails, scheduleDetails => scheduleDetails.barber)
  scheduleDetails: ScheduleDetails[];

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;
}
