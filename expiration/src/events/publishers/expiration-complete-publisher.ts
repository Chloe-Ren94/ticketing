import { Publisher, Subjects, ExpirationCompleteEvent } from '@chloe_ticketing/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}