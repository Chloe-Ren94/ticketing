import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();

// create a client to connect to the NATS server
const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222'
});

stan.on('connect', async () => {
  console.log('Publisher connected to NATS');

  const publisher = new TicketCreatedPublisher(stan);
  await publisher.publish({
    id: '123',
    title: 'concert',
    price: 20
  });

  // wrap the object into JSON to transport in NATS
  // const data = JSON.stringify({
  //   id: '123',
  //   title: 'concert',
  //   price: 20
  // });

  // stan.publish('ticket:created', data, () => {
  //   console.log('Event published');
  // })
})