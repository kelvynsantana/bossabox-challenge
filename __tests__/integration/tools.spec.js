import mongoose from 'mongoose';
import request from 'supertest';

import app from '../../src/app';
import factory from '../factories';
import User from '../../src/app/models/User';
import Tool from '../../src/app/models/Tool';

describe('Tools', async () => {
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
    await Tool.deleteMany({});
  });

  it('should be able create a tool', async () => {
    const user = await factory.create('User', {
      password: '123456',
    });

    const response = await request(app)
      .post('/tools')
      .set('Authorization', `Bearer ${await User.generateToken(user)}`)
      .send({
        title: 'Visual Studio Code',
        link: 'http://code.visualstudio.com',
        description: 'The best code editor',
        tags: ['code', 'development'],
      });
    expect(response.body).toHaveProperty('id');
  });
});
