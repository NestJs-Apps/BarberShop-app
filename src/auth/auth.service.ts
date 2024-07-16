import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BarberService } from 'src/barber/barber.service';
import { ClientService } from 'src/client/client.service';
import { LoginDto } from './dto/login.dto';
import { Client } from 'src/client/entities/client.entity';
import { Barber } from 'src/barber/entities/barber.entity';
import { compare } from 'bcrypt';
import { TypeUserEnum } from 'src/utils/enums/type-user.enum';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validate(email: string, password: string): Promise<any> {
    const user = await this.userService.validateUser(email, password);
    
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    
    return null;
  }

  async login(user: LoginDto) {
    const payload = {
      email: user.email,
      sub: user.idUser,
      typeUser: user.typeUser,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
