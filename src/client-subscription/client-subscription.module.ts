import { Module } from '@nestjs/common';
import { ClientSubscriptionService } from './client-subscription.service';
import { ClientSubscriptionController } from './client-subscription.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientSubscription } from './entities/client-subscription.entity';
import { ClientModule } from 'src/client/client.module';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { Subscription } from 'src/subscription/entities/subscription.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientSubscription, Subscription]),
    ClientModule,
    SubscriptionModule,
  ],
  controllers: [ClientSubscriptionController],
  providers: [ClientSubscriptionService]
})
export class ClientSubscriptionModule {}
