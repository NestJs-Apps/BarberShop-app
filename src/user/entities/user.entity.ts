import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column } from "typeorm";
import { RolesEnum } from "../enum/role.enum";
import { Barber } from "src/barber/entities/barber.entity";
import { Client } from "src/client/entities/client.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  idUser: number;

  @Column()
  typeUSer: RolesEnum;

  @OneToOne(() => Client, client => client.user, { cascade: true })
  @JoinColumn()
  client: Client;

  @OneToOne(() => Barber, barber => barber.user, { cascade: true })
  @JoinColumn()
  barber: Barber;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;
}
