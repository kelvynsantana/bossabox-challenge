import request from 'supertest';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

import factory from '../factories';
import app from '../../src/app';

describe('User', () => {
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

  it('should be able to register a new user', async (done) => {
    const response = await request(app).post('/users').send({
      name: 'Kelvyn Santana',
      email: 'santanakelvyn@gmail.com',
      password: '123456',
    });
    done();

    expect(response.body).toHaveProperty('id');
  });

  it('should encrypt user password', async () => {
    const user = await factory.create('User', {
      password: '123456',
    });

    const compareHash = await bcrypt.compare('123456', user.password);

    expect(compareHash).toBe(true);
  });

  it('shoult not create user with duplicated email', async () => {
    const user = await factory.create('User', {});

    const response = await request(app).post('/users').send({
      name: 'Kelvyn Santana',
      email: user.email,
      password: '123456',
    });

    expect(response.status).toBe(400);
  });
});
