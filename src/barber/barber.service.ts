import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBarberDto } from './dto/create-barber.dto';
import { UpdateBarberDto } from './dto/update-barber.dto';
import { Repository } from 'typeorm';
import { Barber } from './entities/barber.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { TypeUserEnum } from 'src/utils/enums/type-user.enum';
import { v4 as uuid } from 'uuid';

@Injectable()
export class BarberService {
  constructor(
    @InjectRepository(Barber)
    private readonly barberRepository: Repository<Barber>,
  ) {}

  async create(createBarberDto: CreateBarberDto) {
    const barber = await this.barberRepository.findOne({
      where: { cpf: createBarberDto.cpf },
    });

    if (barber)
      throw new BadRequestException('Barber already exists in database.');

    if (createBarberDto.password !== createBarberDto.confirmedPassword)
      throw new BadRequestException('Passwords must be identical.');

    const salt = 10;
    const hashedPassword = await bcrypt.hash(createBarberDto.password, salt);

    const createBarber = this.barberRepository.create({
      codeBarber: uuid(),
      typeUser: TypeUserEnum.BARBER,
      password: hashedPassword,
      ...createBarberDto,
    });

    return this.barberRepository.save(createBarber);
  }

  findAll() {
    return this.barberRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} barber`;
  }

  update(id: number, updateBarberDto: UpdateBarberDto) {
    return `This action updates a #${id} barber`;
  }

  remove(id: number) {
    return `This action removes a #${id} barber`;
  }
}
