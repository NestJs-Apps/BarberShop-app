import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { Client } from './entities/client.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Barber } from 'src/barber/entities/barber.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { ScheduleDetails } from 'src/schedule-detail/entities/schedule-details.entity';
import { ClientRepository } from './entities/client.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Client,
      Barber,
      Schedule,
      ScheduleDetails,
    ]),
  ],
  controllers: [ClientController],
  providers: [ClientService, ClientRepository],
  exports: [ClientService],
})
export class ClientModule {}
