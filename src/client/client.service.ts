import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import * as bcrypt from 'bcrypt';
import { TypeUserEnum } from 'src/utils/enums/type-user.enum';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}
  async create(createClientDto: CreateClientDto) {
    const client = await this.clientRepository.findOne({
      where: { cpf: createClientDto.cpf },
    });

    if (client) 
      throw new NotFoundException('Client already exists in database.');

    if (createClientDto.password !== createClientDto.confirmedPassword)
      throw new BadRequestException('Passwords must be identical');

    const salt = 10;
    const hashedPassword = await bcrypt.hash(createClientDto.password, salt);

    const clientEntity = this.clientRepository.create({
      ...createClientDto,
      password: hashedPassword,
      typeUser: TypeUserEnum.CLIENT,
    });
    
    await this.clientRepository.save(clientEntity);

    return clientEntity;
  };

  findAll() {
    return this.clientRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} client`;
  }

  update(id: number, updateClientDto: UpdateClientDto) {
    return `This action updates a #${id} client`;
  }

  remove(id: number) {
    return `This action removes a #${id} client`;
  }
}
