import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ClientModule } from './client/client.module';
import { BarberModule } from './barber/barber.module';
import { ScheduleModule } from './schedule/schedule.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { ClientSubscriptionModule } from './client-subscription/client-subscription.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { Barber } from './barber/entities/barber.entity';
import { Client } from './client/entities/client.entity';
import { Schedule } from './schedule/entities/schedule.entity';
import { Subscription } from './subscription/entities/subscription.entity';
import { ClientSubscription } from './client-subscription/entities/client-subscription.entity';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
        entities: [
          User,
          Barber,
          Client,
          Schedule,
          Subscription,
          ClientSubscription,
        ],
      }),
      inject: [ConfigService]
    }),
    UserModule,
    ClientModule,
    BarberModule, 
    ScheduleModule, SubscriptionModule, ClientSubscriptionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
