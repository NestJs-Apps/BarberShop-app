import { DataSource, Repository } from "typeorm";
import { Client } from "./client.entity";
import { Injectable } from "@nestjs/common";
import { PaginationDto } from "src/utils/pagination.dto";

@Injectable()
export class ClientRepository extends Repository<Client> {
  constructor(private dataSource: DataSource) {
    super(Client, dataSource.createEntityManager());
  }

  async findAllClients(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const skip = Math.max((page - 1) * limit, 0);
    const take = Math.max(limit, 0);

    const [results, total] = await this.createQueryBuilder('client')
    .select([
      'client.idClient',
      'client.name',
      'client.email',
      'client.phone',
      'client.status',
      'clientSubs.status',
      'clientSubs.startDate',
      'clientSubs.endDate',
      'clientSubs.cancellationDate',
      'clientSubs.idClientSubscription',
      'clScheDetai.id',
      'clScheDetai.status',
      'barber.idBarber',
      'barber.name',
    ])
    .leftJoin('client.clientSubscriptions', 'clientSubs')
    .leftJoin('client.scheduleDetails', 'clScheDetai')
    .leftJoin('clScheDetai.barber', 'barber')
    .skip(skip)
    .take(take)
    .getManyAndCount();

    const currentPage = page
    const totalItems = total
    const totalPage = Math.ceil(total / limit);

    return {
      results,
      currentPage,
      totalItems,
      totalPage,
    };
  };

  async findOneClientById(idClient: number) {
    return this.createQueryBuilder('client')
    .select([
      'client.idClient',
      'client.name',
      'client.email',
      'client.phone',
      'client.status',
      'clientSubs.status',
      'clientSubs.startDate',
      'clientSubs.endDate',
      'clientSubs.cancellationDate',
      'clientSubs.idClientSubscription',
      'clScheDetai.id',
      'clScheDetai.status',
      'barber.idBarber',
      'barber.name',
    ])
    .leftJoin('client.clientSubscriptions', 'clientSubs')
    .leftJoin('client.scheduleDetails', 'clScheDetai')
    .leftJoin('clScheDetai.barber', 'barber')
    .where('client.idClient = :idClient', { idClient })
    .getOne();
  }
}