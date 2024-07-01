import { Module } from '@nestjs/common';
import { ClientModule } from './client/client.module';
import { BarberModule } from './barber/barber.module';
import { ScheduleModule } from './schedule/schedule.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { ClientSubscriptionModule } from './client-subscription/client-subscription.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleDetailModule } from './schedule-detail/schedule-detail.module';

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
        timezone: 'BRT',
        autoLoadEntities: true,
        synchronize: true,
        entities: [__dirname + '**/*.entities/{.ts.,js}'],
      }),
      inject: [ConfigService],
    }),
    ClientModule,
    BarberModule, 
    ScheduleModule,
    SubscriptionModule,
    ClientSubscriptionModule,
    ScheduleDetailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
