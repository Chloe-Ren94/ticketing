import mongoose from "mongoose";
import { Message } from 'node-nats-streaming';
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteEvent, OrderStatus } from "@chloe_ticketing/common";
import { Ticket } from "../../../models/ticket";
import { Order } from "../../../models/order";

const setup = async () => {
  // create an instance of the listener
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20
  });
  await ticket.save();

  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'asdf',
    expiresAt: new Date(),
    ticket
  });
  await order.save();

  // create a fake data event
  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id
  }

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, ticket, order, data, msg };
}

it('updates the order status to cancelled, emits an order cancelled event and acks the message', async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  // check the order status
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);

  // check the emitted event 
  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(eventData.id).toEqual(order.id);

  // check message ack
  expect(msg.ack).toHaveBeenCalled();
});