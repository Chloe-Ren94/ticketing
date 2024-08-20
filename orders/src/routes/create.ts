import express, { NextFunction, Request, Response } from 'express';
import { BadRequstError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@chloe_ticketing/common';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import { natsWrapper } from '../nats-wrapper';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post('/api/orders', requireAuth, [
  body('ticketId')
    .not()
    .isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage('TicketId must be provided')
], validateRequest, async (req: Request, res: Response, next: NextFunction) => {
  const { ticketId } = req.body;

  // Find the ticket the user is trying to order in the database
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    return next(new NotFoundError());
  }

  // Make sure the ticket is not already reserved
  // Run query to look at all orders. Find an order where the ticket is what we
  // found and the order status is not cancelled.
  const isReserved = await ticket.isReserved();
  if (isReserved) {
    return next(new BadRequstError('Ticket is already reserved'));
  }

  // Calculate an expiration date for the order
  const expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

  // Build the order and save it to the database
  const order = Order.build({
    userId: req.currentUser!.id,
    status: OrderStatus.Created,
    expiresAt: expiration,
    ticket
  });
  await order.save();

  // Publish an event saying an order has been created
  new OrderCreatedPublisher(natsWrapper.client).publish({
    id: order.id,
    version: order.version,
    status: order.status,
    userId: order.userId,
    // use UTC timestamp to avoid time zone difference
    expiresAt: order.expiresAt.toISOString(),
    ticket: {
      id: ticket.id,
      price: ticket.price,
    }
  });

  res.status(201).send(order);
})

export { router as createOrderRouter };