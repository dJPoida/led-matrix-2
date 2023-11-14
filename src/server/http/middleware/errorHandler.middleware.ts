import { ErrorRequestHandler } from 'express';
import { ContextLogger } from '../../lib/contextLogger';

export const errorHandlerMiddleware: ErrorRequestHandler = function errorHandlerMiddleware(err, req, res, next) {
  const log = new ContextLogger('errorHandlerMiddleware()');
  log.error('Express handling error', err);
  if (res.writable) {
    res.status(500).json({ message: 'Internal server error', details: err });
  }
};
