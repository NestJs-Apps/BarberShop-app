import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsNotEmpty, IsEnum } from "class-validator";
import { TypeUserEnum } from "src/utils/enums/type-user.enum";

export class LoginDto {
  @IsString()
  @IsOptional()
  idUser?: number;

  @IsEnum(TypeUserEnum)
  @IsString()
  @IsOptional()
  typeUser?: TypeUserEnum;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}