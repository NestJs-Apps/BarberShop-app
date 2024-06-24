import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Schedule } from 'src/schedule//entities/schedule.entity';

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
  phone: string;

  @OneToOne(() => User, user => user.barber)
  @JoinColumn()
  user: User;

  @OneToMany(() => Schedule, schedule => schedule.barber)
  schedules: Schedule[];

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;
}
