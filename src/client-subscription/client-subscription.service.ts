import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ClientSubscription } from './entities/client-subscription.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { ClientService } from 'src/client/client.service';
import { CreateClientSubscriptionDto } from 'src/client-subscription/dto/create-client-subscription.dto';
import { TypeSubscriptionEnum } from 'src/utils/enums/type-subscription.enum';
import { StatusSubscriptionEnum } from 'src/utils/enums/status-subscription.enum';

@Injectable()
export class ClientSubscriptionService {
  constructor(
    @InjectRepository(ClientSubscription)
    private readonly clientSubscriptionRepository: Repository<ClientSubscription>,
    private readonly clientService: ClientService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  async clientSignAPlan(createClienteSubscriptionDto: CreateClientSubscriptionDto) {
    const { idClient, idSubscription } = createClienteSubscriptionDto;

    const client = await this.clientService.findOneById(idClient);
    const subscription = await this.subscriptionService.findOneById(idSubscription);

    let startDate = new Date()
    let endDate: Date;

    if (client.clientSubscriptions) {
      throw new BadRequestException(`The client ${client.name} already has a subscription`);
    }

    if (subscription.typeSubscription === TypeSubscriptionEnum.MENSAL) {
      endDate = new Date(startDate);
      endDate.setMonth(startDate.getMonth() + 1);
    } else if (subscription.typeSubscription === TypeSubscriptionEnum.ANUAL) {
      endDate = new Date(startDate);
      endDate.setFullYear(startDate.getFullYear() + 1);
    } else {
      throw new BadRequestException('Invalid subscription type');
    }

    const clientSubscription = this.clientSubscriptionRepository.create({
      client,
      subscription,
      endDate,
      startDate,
      status: StatusSubscriptionEnum.ACTIVE,
    });

    const savedClientSubscription = await this.clientSubscriptionRepository.save(
      clientSubscription,
    );

    const response = {
      idClientSubscription: savedClientSubscription.idClientSubscription,
      subscription: {
        id: savedClientSubscription.subscription.id,
        name: savedClientSubscription.subscription.name,
        description: savedClientSubscription.subscription.description,
        price: savedClientSubscription.subscription.price,
        typeSubscription: savedClientSubscription.subscription.typeSubscription,
        startDate: savedClientSubscription.startDate,
        endDate: savedClientSubscription.endDate,
        status: savedClientSubscription.status,
      },
      client: {
        idClient: client.idClient,
        name: client.name,
        email: client.email,
        cpf: client.cpf,
      },
    };

    return response;
  };

  async clientCancelSubscription(idClient: number) {
    const client = await this.clientService.findOneById(idClient);

    if (client.clientSubscriptions.length === 0) {
      throw new NotFoundException('Client does not have a signed plan');
    };

    const currentSubscription = client.clientSubscriptions[0];
    
    if (currentSubscription.status === StatusSubscriptionEnum.CANCELLED) {
      throw new NotFoundException('This subscription is already cancelled');
    };

    currentSubscription.status = StatusSubscriptionEnum.CANCELLED;
    currentSubscription.cancellationDate = new Date();

    await this.clientSubscriptionRepository.save(currentSubscription);

    return {
      message: 'Subscription cancelled successfully',
      idClientSubscription: currentSubscription.idClientSubscription,
      cancellationDate: currentSubscription.cancellationDate,
    };
  };

  async clientViewsSignature(idClient: number) {
    const client = await this.clientService.findOneById(idClient);

    if (client.clientSubscriptions.length === 0) {
      throw new NotFoundException('Client does not have a signed plan');
    };

    const currentSignature = client.clientSubscriptions[0];

    const response: any = {
      name: currentSignature.subscription.name,
      price: currentSignature.subscription.price,
      description: currentSignature.subscription.description,
      status: currentSignature.status === ''
        ? StatusSubscriptionEnum.ACTIVE 
        : currentSignature.status,
      typeSubscription: currentSignature.subscription.typeSubscription,
      createdAt: currentSignature.subscription.createdAt,
    };

    const cancellationDate = currentSignature.cancellationDate;
    if (cancellationDate !== null) {
      response.cancellationDate = cancellationDate;
    }

    return response;
  };
}





