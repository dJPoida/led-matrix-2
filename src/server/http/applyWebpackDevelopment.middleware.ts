/* eslint-disable @typescript-eslint/no-var-requires */

import express from 'express';
import { Configuration } from 'webpack';

import { config } from '../lib/config';
import { ContextLogger } from '../lib/contextLogger';

import { wait } from '../../shared/helpers/wait.helper';
import { existsSync } from 'fs';
import { join, resolve } from 'path';

let developmentEnvironmentCompiling = false;

/**
 * Initialise webpack to compile and serve the client in development mode
 * This emulates running webpack dev server for the front end application
 *
 * @note: the `require()` statements are intentionally localised to prevent import in production builds
 */
export function applyWebpackDevelopmentMiddleware(expressApp: express.Express) {
  const log = new ContextLogger('applyWebpackDevelopmentMiddleware()');
  log.info('Enabling webpack for client compilation');

  // Only apply the middleware if this is a development environment
  if (config.env.isDevelopment && config.env.useWebPack) {
    const webpack = require('webpack');
    const webpackConfig: Configuration = require('../../../webpack.config.dev.js');
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');

    const compiler = webpack({
      ...webpackConfig,
      stats: 'errors-only',
    });

    // Tell express to use the webpack-dev-middleware and use the webpack.config.js
    // configuration file as a base.
    expressApp.use(
      webpackDevMiddleware(compiler, {
        publicPath: webpackConfig.output?.publicPath,
      })
    );

    // Attach the hot middleware to the compiler & the server
    expressApp.use(
      webpackHotMiddleware(compiler, {
        log: (message: string) => log.debug(message),
        path: '/__webpack_hmr',
        heartbeat: 10 * 1000,
        // quiet: true,
        // reload: true,
      })
    );

    // Assume the first time that the server is run that the webpack bundle is not available
    developmentEnvironmentCompiling = true;

    // Keep track of when webpack is compiling so that we don't attempt to serve assets that haven't been created
    compiler.hooks.watchRun.tap('onBeforeRun', (/*params: unknown*/) => {
      log.debug('Compiling Webpack...');
      developmentEnvironmentCompiling = true;
    });
    compiler.hooks.done.tap('onWebpackDone', (/*params: unknown*/) => {
      developmentEnvironmentCompiling = false;
      log.debug('Webpack Compilation Done.');
    });

    // Attach some middleware that holds incoming request until webpack has compiled
    expressApp.use(async (req, res, next) => {
      if (developmentEnvironmentCompiling) {
        log.info(`Holding incoming request "${req.url}" while compiling webpack...`);
        while (developmentEnvironmentCompiling) {
          await wait(100);
        }
        log.info(`Releasing held request "${req.url}" now that webpack is compiled.`);
      }
      next();
    });
  }

  // Notify the developer that the webpack compilation is disabled and they will be serving
  // any previously built client that exists in the dist/client path
  if (config.env.isDevelopment && !config.env.useWebPack) {
    log.warn('Webpack Development Server is disabled. Client will be served from the `dist/client` path.');

    // Check that the client exists
    if (!existsSync(join(resolve(__dirname, config.env.distPath), 'client/index.html'))) {
      log.error(
        'No client found in `dist/client`. Make sure you run `yarn build` or `yarn build:dev` to build a client bundle'
      );
    }
  }
}
