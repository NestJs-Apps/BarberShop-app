import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber } from "class-validator";

export class PaginationDto {
  @ApiProperty({ name: 'limit' })
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  @IsNumber()
  limit: number = 10;

  @ApiProperty({ name: 'page' })
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  @IsNumber()
  page: number = 0;
}