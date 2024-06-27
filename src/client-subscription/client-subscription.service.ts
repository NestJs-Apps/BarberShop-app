import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ClientSubscription } from './entities/client-subscription.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { ClientService } from 'src/client/client.service';
import { CreateClientSubscriptionDto } from 'src/client-subscription/dto/create-client-subscription.dto';
import { TypeSubscriptionEnum } from 'src/utils/enums/type-subscription.enum';
import { StatusSubscriptionEnum } from 'src/utils/enums/status-subscription.enum';
import { start } from 'repl';

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
    const currentSubscription = client.clientSubscriptions[0];

    let startDate = new Date()
    let endDate: Date;

    if (currentSubscription) {
      throw new BadRequestException(`The client ${client.name} already has a subscription`);
    };

    this.validateDateTypeSignature(currentSubscription.subscription.typeSubscription);

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
    const currentSubscription = client.clientSubscriptions[0];

    if (!currentSubscription) {
      throw new NotFoundException('Client does not have a signed plan');
    };

    
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
    const currentSignature = client.clientSubscriptions[0];

    if (!currentSignature) {
      throw new NotFoundException('Client does not have a signed plan');
    };


    const response: any = {
      name: currentSignature.subscription.name,
      price: currentSignature.subscription.price,
      description: currentSignature.subscription.description,
      status: currentSignature.status === ''
        ? StatusSubscriptionEnum.ACTIVE 
        : currentSignature.status,
      typeSubscription: currentSignature.subscription.typeSubscription,
      startDate: currentSignature.startDate,
      endDate: currentSignature.endDate,
    };

    const cancellationDate = currentSignature.cancellationDate;
    if (cancellationDate !== null) {
      response.cancellationDate = cancellationDate;
    }

    return response;
  };

  async clientUpdateSignature(idClient: number, idSubscription: number) {
    const client = await this.clientService.findOneById(idClient);
    const subscription = await this.subscriptionService.findOneById(idSubscription);
    const currentSignature = client.clientSubscriptions[0];

    if (!currentSignature) {
      throw new NotFoundException('Client does not have a signed plan');
    };

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    };

    
    currentSignature.subscription = subscription;
    currentSignature.status = currentSignature.status === StatusSubscriptionEnum.CANCELLED
      ? StatusSubscriptionEnum.ACTIVE
      : currentSignature.status;
    currentSignature.cancellationDate = null;

    this.validateDateTypeSignature(currentSignature.subscription.typeSubscription);

    await this.clientSubscriptionRepository.save(currentSignature);

    return {
      message: `Updated subscription with success.`,
      subscription: currentSignature.subscription,
    };
  }
  
  async validateDateTypeSignature(typeSubscription: string) {
    let startDate = new Date();
    let endDate: Date;
    
    if (typeSubscription === TypeSubscriptionEnum.MENSAL) {
      endDate = new Date(startDate);
      endDate.setMonth(startDate.getMonth() + 1);
    } else if (typeSubscription === TypeSubscriptionEnum.ANUAL) {
      endDate = new Date(startDate);
      endDate.setFullYear(startDate.getFullYear() + 1);
    } else {
      throw new BadRequestException('Invalid subscription type');
    }
  } 
}





