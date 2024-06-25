import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
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

  @Column()
  typeUser: string;

  @OneToMany(() => ScheduleDetails, scheduleDetails => scheduleDetails.client)
  scheduleDetails: ScheduleDetails[];

  @OneToMany(() => ClientSubscription, clientSubscriptions => clientSubscriptions.client)
  clientSubscriptions: ClientSubscription[];

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;
}
