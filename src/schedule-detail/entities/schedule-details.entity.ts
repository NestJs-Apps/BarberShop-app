import { Barber } from "src/barber/entities/barber.entity";
import { Client } from "src/client/entities/client.entity";
import { Schedule } from "src/schedule/entities/schedule.entity";
import { ServiceBarberEnum } from "src/utils/enums/service-barber.enum";
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Column } from "typeorm";

@Entity()
export class ScheduleDetails {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true, type: 'enum', enum: ServiceBarberEnum })
    serviceDescription: string;

    @Column()
    status: string;

    @ManyToOne(() => Schedule, (schedule) => schedule.scheduleDetails)
    @JoinColumn({ name: 'scheduleId' })
    schedule: Schedule;

    @ManyToOne(() => Barber, (barber) => barber.scheduleDetails)
    @JoinColumn({ name: 'barberId' })
    barber: Barber;

    @ManyToOne(() => Client, (client) => client.scheduleDetails)
    @JoinColumn({ name: 'clientId' })
    client: Client;

    @CreateDateColumn({ type: 'datetime', name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
    updatedAt: Date;
}