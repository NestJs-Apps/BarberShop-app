import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, CreateDateColumn } from 'typeorm';
import { Client } from 'src/client/entities/client.entity';
import { Subscription } from 'src/subscription/entities/subscription.entity';

@Entity()
export class ClientSubscription {
  @PrimaryGeneratedColumn()
  idClientSubscription: number;

  @Column()
  status: string;

  @Column({ type: 'datetime' })
  startDate: Date;
  
  @Column({ type: 'datetime' })
  endDate: Date;

  @Column({ type: 'datetime', nullable: true, default: null })
  cancellationDate: Date;

  @ManyToOne(() => Client, client => client.clientSubscriptions)
  @JoinColumn({ name: 'clientId' })
  client: Client;

  @ManyToOne(() => Subscription, subscription => subscription.clientSubscriptions)
  @JoinColumn({ name: 'subscriptionId' })
  subscription: Subscription;
}
