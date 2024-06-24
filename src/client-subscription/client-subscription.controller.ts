import { Controller } from '@nestjs/common';
import { ClientSubscriptionService } from './client-subscription.service';

@Controller('client-subscription')
export class ClientSubscriptionController {
  constructor(private readonly clientSubscriptionService: ClientSubscriptionService) {}
}
