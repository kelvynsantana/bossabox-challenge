import { Router } from 'express';

const route = Router();

route.get('/', (request, response) => {
  response.json({
    title: 'Desafio Bossa Box',
  });
});

export default route;
