import express from 'express';
import { join, resolve } from 'path';

import { fourZeroFourMiddleware } from './middleware/fourZeroFour.middleware';
import { errorHandlerMiddleware } from './middleware/errorHandler.middleware';
import { applyWebpackDevelopmentMiddleware } from './applyWebpackDevelopment.middleware';

import { config } from '../lib/config';

/**
 * Create an express server to handle requests
 */
export function applyExpressMiddleware(expressApp: express.Express): express.Express {
  expressApp.use(express.json());
  expressApp.use(express.urlencoded({ extended: false }));

  // When in development mode, apply the Webpack Development Middleware (hot reload etc...)
  applyWebpackDevelopmentMiddleware(expressApp);

  // Serve the client static js assets
  expressApp.use('/js/:filename', (req, res) => {
    const { filename } = req.params;
    res.sendFile(resolve(__dirname, config.env.distPath, `client/js/${filename}`));
  });

  // Serve the client index
  expressApp.get(['/', '/index'], (req, res) => {
    res.sendFile(resolve(__dirname, config.env.distPath, 'client/index.html'));
  });

  // Static assets
  expressApp.use(express.static(join(resolve(__dirname, config.env.distPath), 'client')));

  // Catch errors in async code and pipe through to Express' error handler
  expressApp.use('/', fourZeroFourMiddleware);

  // Error handling middleware
  expressApp.use(errorHandlerMiddleware);

  return expressApp;
}
