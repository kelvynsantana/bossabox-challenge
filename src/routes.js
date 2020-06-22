import { Router } from 'express';

import UserController from './app/controllers/UserController';
import ToolsController from './app/controllers/ToolsController';

const route = Router();

route.get('/', (request, response) => {
  response.json({
    title: 'Desafio Bossa Box',
  });
});

/** Users */

route.post('/users', UserController.store);

/** Tools */
route.get('/tools', ToolsController.index);

route.post('/tools', ToolsController.store);
route.delete('/tools/:id', ToolsController.destroy);

export default route;
