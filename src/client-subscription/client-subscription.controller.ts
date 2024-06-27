import { Body, Controller, Get, Param, Query, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ClientSubscriptionService } from './client-subscription.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
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

  @Patch('idClient/:idClient/cancelled-subscriprion')
  @ApiOperation({ summary: 'Client cancel a plan' })
  @ApiBearerAuth()
  async clientCancelSubscription(
    @Param('idClient', ParseIntPipe) idclient: number,
  ) {
    return this.clientSubscriptionService.clientCancelSubscription(idclient);
  }

  @Patch('client/:idClient/subscription/:idSubscription/updated-subscriprion')
  @ApiOperation({ summary: 'Client updated a plan' })
  @ApiBearerAuth()
  async clientUpdateSubscription(
    @Param('idClient', ParseIntPipe) idclient: number,
    @Param('idSubscription', ParseIntPipe) idSubscription: number,
  ) {
    return this.clientSubscriptionService.clientUpdateSignature(idclient, idSubscription);
  }

  @Get('idClient/:idClient/views-signature')
  @ApiOperation({ summary: 'Client views your signature' })
  @ApiBearerAuth()
  async clientViewsYourSignature(
    @Param('idClient', ParseIntPipe) idclient: number,
  ) {
    return this.clientSubscriptionService.clientViewsSignature(idclient);
  }

}
