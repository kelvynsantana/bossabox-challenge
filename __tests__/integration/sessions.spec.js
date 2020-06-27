import { MongoClient } from 'mongodb';
import request from 'supertest';

import app from '../../src/app';
import User from '../../src/app/models/User';

import factory from '../factories';

describe('Authentication', () => {
  let connection;
  let db;
  beforeAll(async () => {
    if (!process.env.MONGO_URL) {
      throw new Error('MongoDB server not initialized');
    }

    connection = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db();
  });
  afterAll(async () => {
    await connection.close();
  });
  beforeEach(async () => {
    await db.collection('users').deleteMany({});
  });

  it('should be able return JWT token when recieve valid credentials.', async () => {
    const user = await factory.create('User', {
      password: '123456',
    });

    const response = await request(app).post('/sessions').send({
      email: user.email,
      password: '123456',
    });

    expect(response.status).toBe(200);
  });

  it('should not authenticate with invalid credentials', async () => {
    const user = await factory.create('User', {});

    const response = await request(app).post('/sessions').send({
      email: user.email,
      password: '123456',
    });

    expect(response.status).toBe(401);
  });

  it('should return JWT token when authenticated', async () => {
    const user = await factory.create('User', {
      password: '123456',
    });

    const response = await request(app).post('/sessions').send({
      email: user.email,
      password: '123456',
    });

    expect(response.body).toHaveProperty('token');
  });

  it('should not be able to access privated routes when unauthenticated', async () => {
    const response = await request(app).get('/tools');

    expect(response.status).toBe(401);
  });

  it('should not be able to access privated routes when invalid JWT token', async () => {
    const response = await request(app)
      .get('/tools')
      .set('Authorization', 'Bearer 123455');
    expect(response.status).toBe(401);
  });

  it('should be able to access privated routes when recieve a valid token', async () => {
    const user = await factory.create('User', {});

    const response = await request(app)
      .get('/tools')
      .set('Authorization', `Bearer ${await User.generateToken(user)}`);
    expect(response.status).toBe(200);
  });
});
