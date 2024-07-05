import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional } from 'class-validator';

export class UpdateBarberDto {
  @IsString()
  @ApiProperty({ name: 'name' })
  name: string;

  @ApiProperty({ name: 'email' })
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ name: 'phone' })
  phone?: string;
}

