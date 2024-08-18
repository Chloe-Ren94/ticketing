import express from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@chloe_ticketing/common';

import { createOrderRouter } from './routes/create';
import { displayOrderRouter } from './routes/display';
import { indexOrderRouter } from './routes';
import { deleteOrderRouter } from './routes/delete';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    // don't encrypt cookie
    signed: false,
    // only send the cookie over HTTPS connections in non-testing env
    secure: process.env.NODE_ENV !== 'test'
  })
);
app.use(currentUser);

app.use(createOrderRouter);
app.use(displayOrderRouter);
app.use(indexOrderRouter);
app.use(deleteOrderRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
