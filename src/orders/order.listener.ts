import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Queue } from 'bull';

@Injectable()
export class OrderCreatedListener {
  constructor(
    @InjectQueue('orderConfirmation')
    private orderConfirmation: Queue,
  ) {}

  @OnEvent('order.created')
  async handleOrderCreatedEvent(orderData: any) {
    await this.orderConfirmation.add('sendOrderConfirmation', orderData, {
      attempts: 3,
    });
  }
}
