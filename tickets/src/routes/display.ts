import express, { NextFunction, Request, Response } from "express";
import { NotFoundError } from "@chloe_ticketing/common";
import { Ticket } from "../models/ticket";


const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response, next: NextFunction) => {
  const ticket = await Ticket.findById(req.params.id);

  // Use next() to pass the error to the error handler.
  // Don't throw the error directly!
  if (!ticket) {
    return next(new NotFoundError());
  }

  res.send(ticket);
});

export { router as displayTicketRouter };