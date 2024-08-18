import express, { NextFunction, Request, Response } from 'express';
import { NotAuthorizedError, NotFoundError, requireAuth } from '@chloe_ticketing/common';
import { Order, OrderStatus } from '../models/order';

const router = express.Router();

// Update the order status to 'cancelled'. Not really delete the order.
router.delete('/api/orders/:orderId', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  const order = await Order.findById(req.params.orderId);

  if (!order) {
    return next(new NotFoundError());
  }

  if (order.userId !== req.currentUser!.id) {
    return next(new NotAuthorizedError());
  }

  order.status = OrderStatus.Cancelled;
  await order.save();

  // Publish an event saying an order has been cancelled
  
  // 204 stands for "No Content." It indicates that the request was successful, 
  // but there is no content to send in the response body.
  // It's commonly used for DELETE operations or successful updates 
  // where the server doesn't need to return any additional information.
  res.status(204).send(order);
})

export { router as deleteOrderRouter };