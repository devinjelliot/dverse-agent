// src/pages/api/middleware.ts
import nextConnect from 'next-connect';
import cors from 'cors';

const middleware = nextConnect();

middleware.use(
  cors({
    origin: '*', // You can set specific origins here, like 'https://example.com'
    methods: ['GET', 'POST'], // You can specify allowed methods
  })
);

export default middleware;
