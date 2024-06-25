import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsPositive, IsString } from "class-validator";
import { TypeSubscriptionEnum } from "src/utils/enums/type-subscription.enum";

export class CreateSubscriptionDto {
  @ApiProperty({ name: 'name' })
  @IsString()
  name: string;

  @ApiProperty({ name: 'description' })
  @IsString()
  description: string;

  @ApiProperty({ name: 'price' })
  @IsPositive()
  @IsNumber()
  price: number;

  @ApiProperty({ name: 'typeSubscription', enum: TypeSubscriptionEnum })
  @IsString()
  typeSubscription: string;
}
