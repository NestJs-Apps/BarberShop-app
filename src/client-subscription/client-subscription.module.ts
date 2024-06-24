import { Module } from '@nestjs/common';
import { ClientSubscriptionService } from './client-subscription.service';
import { ClientSubscriptionController } from './client-subscription.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientSubscription } from './entities/client-subscription.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientSubscription]),
  ],
  controllers: [ClientSubscriptionController],
  providers: [ClientSubscriptionService]
})
export class ClientSubscriptionModule {}
