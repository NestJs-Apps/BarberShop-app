import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { ClientSubscription } from 'src/client-subscription/entities/client-subscription.entity';
import { ScheduleDetails } from 'src/schedule-detail/entities/schedule-details.entity';
import { User } from 'src/user/entities/user.entity';

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
  status: string;

  @Column()
  typeUser: string;

  @OneToOne(() => User)
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
