import express, { Request, Response } from 'express';
import { requireAuth } from '@chloe_ticketing/common';
import { Order } from '../models/order';

const router = express.Router();

router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({ 
    userId: req.currentUser!.id 
  // replace the ticket field's ObjectId references with the actual Ticket documents.
  }).populate('ticket');

  res.send(orders);
})

export { router as indexOrderRouter };