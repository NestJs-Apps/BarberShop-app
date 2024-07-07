import { DataSource, Repository } from "typeorm";
import { Barber } from "./barber.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class BarberRepository extends Repository<Barber> {
  constructor(private dataSource: DataSource) {
    super(Barber, dataSource.createEntityManager());
  }

  async findBarberById(idbarber: number) {
    return this.createQueryBuilder('barber')
      .select([
        'barber.idbarber',
        'barber.name',
        'barber.email',
        'barber.phone',
        'schedules.idSchedule',
        'schedules.date',
      ])
      .leftJoin('barber.schedules', 'schedules')
      .where('barber.idBarber = :idBarber', { idbarber })
      .getOne();
  }
}
