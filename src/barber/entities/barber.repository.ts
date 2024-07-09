import { DataSource, Repository } from "typeorm";
import { Barber } from "./barber.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class BarberRepository extends Repository<Barber> {
  constructor(private dataSource: DataSource) {
    super(Barber, dataSource.createEntityManager());
  }

  async findBarberById(idBarber: number) {
    return this.createQueryBuilder('barber')
      .select([
        'barber.idBarber',
        'barber.name',
        'barber.email',
        'barber.phone',
        'schedules.idSchedule',
        'schedules.date',
        'schedules.status',
      ])
      .leftJoin('barber.schedules', 'schedules')
      .where('barber.idBarber = :idBarber', { idBarber })
      .getOne();
  }
}
