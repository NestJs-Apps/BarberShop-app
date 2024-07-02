import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class ReserveScheduleDto {
  @ApiProperty()
  @IsInt()
  idClient: number;

  @ApiProperty()
  @IsInt()
  idSchedule: number;

  @ApiProperty()
  @IsInt()
  idBarber: number;
}
