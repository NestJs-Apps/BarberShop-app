import { Body, Controller, Get, Post } from '@nestjs/common';
import { ClientSubscriptionService } from './client-subscription.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateClientSubscriptionDto } from './dto/create-client-subscription.dto';

@ApiTags('Client Subscription')
@Controller('client-subscription')
export class ClientSubscriptionController {
  constructor(
    private readonly clientSubscriptionService: ClientSubscriptionService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Client signs a plan' })
  @ApiBearerAuth()
  async clientSingPlan(
    @Body() createClienteSubscriptionDto: CreateClientSubscriptionDto,
  ) {
    return this.clientSubscriptionService.clientSignAPlan(createClienteSubscriptionDto);
  }

}
