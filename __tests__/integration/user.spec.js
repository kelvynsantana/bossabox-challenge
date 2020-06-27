import request from 'supertest';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import factory from '../factories';
import app from '../../src/app';
import User from '../../src/app/models/User';

describe('User', () => {
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
