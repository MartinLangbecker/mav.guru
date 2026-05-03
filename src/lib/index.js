import createExpress from 'express';
import * as http from 'http';
import compression from 'compression';
import helmet from 'helmet';

import createRoutes from './routes/index.js';
import * as api from '../api/index.js';

// Simple in-memory response cache
const cache = new Map();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

const cacheMiddleware = (req, res, next) => {
  const key = req.originalUrl;
  const cached = cache.get(key);
  if (cached && Date.now() - cached.time < CACHE_TTL) {
    res.set('Content-Type', cached.contentType || 'text/html');
    return res.send(cached.body);
  }
  const originalSend = res.send.bind(res);
  res.send = (body) => {
    cache.set(key, {
      body,
      time: Date.now(),
      contentType: res.get('Content-Type'),
    });
    return originalSend(body);
  };
  next();
};

const createServer = () => {
  const express = createExpress();
  const server = http.createServer(express);

  express.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );

  express.use(cacheMiddleware);
  express.use(compression());
  express.use('/assets', createExpress.static('assets'));

  const {
    greetingRoute,
    startRoute,
    bestpreisRoute,
    imprintRoute,
    faqRoute,
    stationsRoute,
  } = createRoutes(api);
  express.get('/', greetingRoute, startRoute);
  express.get('/start', startRoute);
  express.get('/bestpreis', bestpreisRoute, startRoute);
  express.get('/imprint', imprintRoute);
  express.get('/faq', faqRoute);
  express.get('/stations', stationsRoute);
  return server;
};

export default createServer;
