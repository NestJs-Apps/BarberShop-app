import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcrypt';
import { BarberService } from 'src/barber/barber.service';
import { ClientService } from 'src/client/client.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly clientService: ClientService,
    private readonly barberService: BarberService,
  ) {}

  async findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findOneByEmail(email);
    
    if (user) {
      const isPasswordValid = await compare(password, user.password);
      
      if (isPasswordValid) {
        return user;
      }
    }
    
    return null;
  }
}
