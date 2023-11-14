/* eslint-disable @typescript-eslint/no-var-requires */

import express from 'express';
import { Configuration } from 'webpack';

import { config } from '../lib/config';
import { ContextLogger } from '../lib/contextLogger';

import { wait } from '../../shared/helpers/wait.helper';

let developmentEnvironmentCompiling = false;

/**
 * Initialise webpack to compile and serve the client in development mode
 * This emulates running webpack dev server for the front end application
 *
 * @note: the `require()` statements are intentionally localised to prevent import in production builds
 */
export function applyWebpackDevelopmentMiddleware(expressApp: express.Express) {
  // Only apply the middleware if this is a development environment
  if (config.env.isDevelopment) {
    const log = new ContextLogger('applyWebpackDevelopmentMiddleware()');
    log.info('Enabling webpack for client compilation');

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
}
