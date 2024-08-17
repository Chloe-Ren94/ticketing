import { Publisher, Subjects, TicketCreatedEvent } from '@chloe_ticketing/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}