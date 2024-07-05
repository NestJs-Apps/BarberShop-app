import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber, IsPositive } from "class-validator";

export class PaginationDto {
  @ApiProperty({ name: 'limit', default: 10 })
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  @IsNumber()
  limit: number = 10;

  @ApiProperty({ name: 'page', default: 0 })
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  @IsNumber()
  page: number = 0;
}