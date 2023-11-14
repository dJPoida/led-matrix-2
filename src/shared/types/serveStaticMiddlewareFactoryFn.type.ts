import { AsyncMiddleware } from './asyncMiddleware.type';

export type ServeStaticMiddlewareFactoryFn = {
  (staticPath: string): AsyncMiddleware;
};
