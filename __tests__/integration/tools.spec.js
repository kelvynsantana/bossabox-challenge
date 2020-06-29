import { MongoClient } from 'mongodb';
import request from 'supertest';

import app from '../../src/app';
import factory from '../factories';
import User from '../../src/app/models/User';
// import Tool from '../../src/app/models/Tool';

describe('Tools', () => {
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
    await db.collection('tools').deleteMany({});
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

  it('should not create tool without required fields', async () => {
    const user = await factory.create('User', {});

    const response = await request(app)
      .post('/tools')
      .set('Authorization', `Bearer ${await User.generateToken(user)}`)
      .send({});
    expect(response.status).toBe(400);
  });

  it('shout be able return all tools in database', async () => {
    const user = await factory.create('User', {});

    await factory.create('Tool', {});

    const response = await request(app)
      .get('/tools')
      .set('Authorization', `Bearer ${await User.generateToken(user)}`)

      .send({});
    expect(response.body[0]).toHaveProperty('id');
  });
});
