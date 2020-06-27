import mongoose from 'mongoose';
import request from 'supertest';

import app from '../../src/app';
import User from '../../src/app/models/User';

import factory from '../factories';

describe('Sessions', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
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
