import { ApiProperty } from "@nestjs/swagger";
import { Client } from "../entities/client.entity";
import { Subscription } from 'src/subscription/entities/subscription.entity';
import { IsDateString, IsString } from "class-validator";
import { TypeSubscriptionEnum } from "src/utils/enums/type-subscription.enum";

export class CreateClientSubscriptionDto {
  @ApiProperty({ name: 'status', enum: TypeSubscriptionEnum })
  @IsString()
  status: TypeSubscriptionEnum;

  @ApiProperty({ name: 'startDate' })
  @IsDateString()
  startDate: Date;
  
  @ApiProperty({ name: 'endDate' })
  @IsDateString()
  endDate: Date;

  @ApiProperty({ name: 'client' })
  client: Client[];

  @ApiProperty({ name: 'subscription' })
  subscription: Subscription[];
}