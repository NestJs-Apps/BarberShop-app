import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Client } from 'src/client/entities/client.entity';
import { ClientSubscription } from 'src/client-subscription/entities/client-subscription.entity';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('decimal')
  price: number;

  @ManyToMany(() => Client, client => client.clientSubscriptions)
  @JoinTable()
  clients: Client[];

  @OneToMany(() => ClientSubscription, clientSubscriptions => clientSubscriptions.subscription)
  @JoinTable()
  clientSubscriptions: ClientSubscription[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
