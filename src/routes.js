import { Router } from 'express';

import authMiddleware from './app/middlewares/auth';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import ToolsController from './app/controllers/ToolsController';

const route = Router();

route.get('/', (request, response) => {
  response.json({
    title: 'Desafio Bossa Box',
  });
});

/** Users */

route.post('/users', UserController.store);

/** Sessions */

route.post('/sessions', SessionController.store);

route.use(authMiddleware);
/** Tools */
route.get('/tools', ToolsController.index);

route.post('/tools', ToolsController.store);
route.delete('/tools/:id', ToolsController.destroy);

export default route;
