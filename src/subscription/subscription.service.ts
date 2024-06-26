import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  async create(createSubscriptionDto: CreateSubscriptionDto) {
    const subscription = await this.subscriptionRepository.findOne({
      where: { name: createSubscriptionDto.name },
    });

    if (subscription)
      throw new BadRequestException('Subscription already exists in database.');

    const createSubscription = this.subscriptionRepository.create(
      createSubscriptionDto,
    );

    return this.subscriptionRepository.save(createSubscription);
  }

  findAll() {
    return this.subscriptionRepository.find();
  }

  async findOneById(id: number) {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id: id },
    });

    if (!subscription) 
      throw new NotFoundException('Client not found in database.');
    
      return subscription;
  }

  update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
    return `This action updates a #${id} subscription`;
  }

  remove(id: number) {
    return `This action removes a #${id} subscription`;
  }
}
