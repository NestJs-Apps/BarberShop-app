import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateClientDto {
  @IsString()
  @ApiProperty({ name: 'name' })
  name: string;

  @ApiProperty({ name: 'email' })
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  @MaxLength(8)
  @ApiProperty({ name: 'password' })
  password: string;

  @IsString()
  @MinLength(3)
  @MaxLength(8)
  @ApiProperty({ name: 'confirmedPassword' })
  confirmedPassword: string;

  @IsString()
  @MaxLength(11)
  @ApiProperty({ name: 'cpf' })
  cpf: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ name: 'phone' })
  phone?: string;
}
