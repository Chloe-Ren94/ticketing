import express from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@chloe_ticketing/common';
import { createChargeRouter } from './routes/create';

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

app.use(createChargeRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
