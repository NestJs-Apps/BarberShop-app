import { Barber } from "src/barber/entities/barber.entity";
import { Client } from "src/client/entities/client.entity";
import { TypeUserEnum } from "src/utils/enums/type-user.enum";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  idUser: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  status: string;

  @Column({ type: 'enum', enum: TypeUserEnum })
  typeUser: TypeUserEnum;

  @OneToOne(() => Client)
  @JoinColumn({ name: 'clientId' })
  client: Client;

  @OneToOne(() => Barber)
  @JoinColumn({ name: 'barberId' })
  barber: Barber;
}