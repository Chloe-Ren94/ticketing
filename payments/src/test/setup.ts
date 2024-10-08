import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
  function signup(id?: string): string[]
}

jest.mock('../nats-wrapper');

process.env.STRIPE_KEY = 'sk_test_51PshuJH8tFkgYljuTcbVwYHktcy7Mi7mXw9HPhI6zWmsZJWBPF9pKVa3jr9Y6QJ11wS1FBV86mZ74m6i3Yg1GN2700z62QpYV6';

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'asdf';
  
  mongo = new MongoMemoryServer();
  await mongo.start();
  const mongoUri = await mongo.getUri();
  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db!.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

// id is an optional parameter
global.signup = (id?: string) => {
  // Build a JWT payload { id, email }
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com'
  }
  
  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session object { jwt: MY_JWT }
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session); 

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // Return a string that is the cookie with the encoded data
  return [`session=${base64}`];
}