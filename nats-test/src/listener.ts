import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear();

// create a client to connect to the NATS server
const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222'
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  stan.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  })

  new TicketCreatedListener(stan).listen();
});

// Handle SIGINT (Ctrl+C)
process.on('SIGINT', () => stan.close);
// Handle SIGTERM (e.g., from `kill` command)
process.on('SIGTERM', () => stan.close);
