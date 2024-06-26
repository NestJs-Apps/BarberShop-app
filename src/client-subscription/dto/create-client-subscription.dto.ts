import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class CreateClientSubscriptionDto {
  @ApiProperty({ name: 'idClient' })
  @IsNumber()
  idClient: number;

  @ApiProperty({ name: 'idSubscription' })
  @IsNumber()
  idSubscription: number;
}