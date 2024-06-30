import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber } from "class-validator";

export class PaginationDto {
  @ApiProperty({ name: 'limit' })
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  @IsNumber()
  limit: number = 10;

  @ApiProperty({ name: 'skip' })
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  @IsNumber()
  skip: number = 0;
}