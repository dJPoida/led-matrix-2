import { LogMetaType } from '../../shared/types/logMeta.type';
import { logger } from './logger';

/**
 * Wrap the global logger in a context so that output from the
 * log methods can be traced back to the appropriate source
 */
export class ContextLogger {
  constructor(private context: string) {}

  getContext(): Readonly<string> {
    return this.context;
  }

  /**
   * Write a standard 'log' ('info') level message
   */
  log(message: string, meta?: LogMetaType) {
    logger.log(message, this.context, meta);
  }

  /**
   * Write an 'error' level message
   */
  error(message: string, error?: LogMetaType<Error>) {
    logger.error(message, this.context, error);
  }

  /**
   * Write a 'warn' level log message
   */
  warn(message: string, meta?: LogMetaType) {
    logger.warn(message, this.context, meta);
  }

  /**
   * Write an 'info' level log message
   */
  info(message: string, meta?: LogMetaType) {
    logger.info(message, this.context, meta);
  }

  /**
   * Write a `debug` level log message
   */
  debug(message: string, meta?: LogMetaType) {
    logger.debug(message, this.context, meta);
  }

  /**
   * Write a 'verbose' level log message
   */
  verbose(message: string, meta?: LogMetaType) {
    logger.verbose(message, this.context, meta);
  }
}
