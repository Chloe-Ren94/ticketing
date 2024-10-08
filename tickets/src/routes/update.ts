import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest, NotFoundError, NotAuthorizedError, BadRequstError } from "@chloe_ticketing/common";
import { Ticket } from "../models/ticket";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.put('/api/tickets/:id', requireAuth, [
  body('title')
    .not()
    .isEmpty()
    .withMessage('Title is required'),
  body('price')
    .isFloat({ gt: 0 })
    .withMessage('Price must be greater than 0')
], validateRequest, async (req: Request, res: Response, next: NextFunction) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    return next(new NotFoundError());
  }

  if (ticket.orderId) {
    return next(new BadRequstError('Cannot edit a reserved ticket'));
  }

  if (ticket.userId != req.currentUser!.id) {
    return next(new NotAuthorizedError());
  }

  ticket.set({
    title: req.body.title,
    price: req.body.price
  });
  await ticket.save();

  new TicketUpdatedPublisher(natsWrapper.client).publish({
    id: ticket.id,
    version: ticket.version,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId
  });

  res.send(ticket);
});

export { router as updateTicketRouter };