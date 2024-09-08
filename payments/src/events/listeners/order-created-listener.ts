import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderCreatedEvent } from '@chloe_ticketing/common';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const { id, version, status, userId, ticket } = data;

    const order = await Order.build({
      id, version, status, userId, price: ticket.price
    });
    await order.save();

    msg.ack();
  }
}