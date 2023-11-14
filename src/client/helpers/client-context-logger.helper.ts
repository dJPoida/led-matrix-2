/* eslint-disable no-console */

import { LogMetaType } from '../../shared/types/logMeta.type';

import { A_LOG_LEVEL, LOG_LEVEL } from '../../shared/constants/logLevel.const';
import { global } from '../constants/global.const';

/**
 * This is basically a wrapper around the console.log function that prefixes the log message
 * with the information about who logged the info/error/warning and also only outputs those
 * messages when appropriate based on the current environment
 */
export class ClientContextLogger {
  constructor(private context: string) {}

  getContext(): Readonly<string> {
    return this.context;
  }

  formatMessage(message: string): string {
    // TODO: Colourise and add icons to the client Context Logger
    return `[${this.context}] ${message}`;
  }

  /**
   * Write a standard console log
   */
  log(message: string, meta?: LogMetaType) {
    if (([LOG_LEVEL.DEBUG, LOG_LEVEL.VERBOSE] as A_LOG_LEVEL[]).includes(global.LOG_LEVEL)) {
      if (meta) {
        console.log(this.formatMessage(message), meta);
      } else {
        console.log(this.formatMessage(message), meta);
      }
    }
  }

  /**
   * Write a console log of type 'Error'
   */
  error(message: string, error?: LogMetaType) {
    if (
      ([LOG_LEVEL.ERROR, LOG_LEVEL.WARN, LOG_LEVEL.DEBUG, LOG_LEVEL.VERBOSE] as A_LOG_LEVEL[]).includes(
        global.LOG_LEVEL
      )
    ) {
      if (error) {
        console.error(this.formatMessage(message), error);
      } else {
        console.error(this.formatMessage(message));
      }
    }
  }

  /**
   * Write a console log of type 'Warning'
   */
  warn(message: string, meta?: unknown) {
    if (([LOG_LEVEL.WARN, LOG_LEVEL.DEBUG, LOG_LEVEL.VERBOSE] as A_LOG_LEVEL[]).includes(global.LOG_LEVEL)) {
      if (meta) {
        console.warn(this.formatMessage(message), meta);
      } else {
        console.warn(this.formatMessage(message));
      }
    }
  }

  /**
   * Write a console log of type 'Info'
   */
  info(message: string, meta?: unknown) {
    if (meta) {
      console.info(this.formatMessage(message), meta);
    } else {
      console.info(this.formatMessage(message));
    }
  }

  /**
   * Write a console log of type 'Debug'
   */
  debug(message: string, meta?: unknown) {
    if (([LOG_LEVEL.DEBUG, LOG_LEVEL.VERBOSE] as A_LOG_LEVEL[]).includes(global.LOG_LEVEL)) {
      if (meta) {
        console.log(this.formatMessage(message), meta);
      } else {
        console.log(this.formatMessage(message));
      }
    }
  }

  /**
   * Write a console log of type 'Verbose'
   */
  silly(message: string, meta?: unknown) {
    if (([LOG_LEVEL.VERBOSE] as A_LOG_LEVEL[]).includes(global.LOG_LEVEL)) {
      if (meta) {
        console.log(this.formatMessage(message), meta);
      } else {
        console.log(this.formatMessage(message));
      }
    }
  }
}
