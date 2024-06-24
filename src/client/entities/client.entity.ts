import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Subscription } from 'src/subscription/entities/subscription.entity';
import { ClientSubscription } from 'src/client-subscription/entities/client-subscription.entity';
import { ScheduleDetails } from 'src/schedule-detail/entities/schedule-details.entity';

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  idClient: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  cpf: string;

  @Column()
  phone: string;

  @OneToOne(() => User, user => user.client)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => ScheduleDetails, scheduleDetails => scheduleDetails.client)
  scheduleDetails: ScheduleDetails[];

  @OneToMany(() => ClientSubscription, clientSubscriptions => clientSubscriptions.client)
  clientSubscriptions: ClientSubscription[];

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;
}
