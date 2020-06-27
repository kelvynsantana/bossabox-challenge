import faker from 'faker';
import { factory } from 'factory-girl';

import User from '../src/app/models/User';
import Tool from '../src/app/models/Tool';

factory.define('User', User, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});

factory.define('Tool', Tool, {
  title: faker.random.alphaNumeric(),
  link: faker.internet.url(),
  description: faker.lorem.text(),
  tags: faker.random.arrayElement(),
});

export default factory;
