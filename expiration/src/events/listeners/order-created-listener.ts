import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderCreatedEvent } from '@chloe_ticketing/common';
import { queueGroupName } from './queue-group-name';
import { expirationQueue } from '../../queues/expiration-queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

    await expirationQueue.add({
      orderId: data.id
    }, {
      // how long (in ms) the job should be delayed before it is processed.
      delay
    });
    msg.ack();
  }
}