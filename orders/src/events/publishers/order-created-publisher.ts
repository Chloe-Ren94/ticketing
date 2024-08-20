import { Publisher, Subjects, OrderCreatedEvent } from '@chloe_ticketing/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}