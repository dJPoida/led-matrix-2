import path from 'path';
import winston from 'winston';
import { Writable } from 'stream';
import { StreamTransportInstance } from 'winston/lib/winston/transports';

import { Listener } from '../../shared/types/listener.type';
import { LogDto } from '../../shared/types/dtos/log.dto.type';
import { LogMetaType } from '../../shared/types/logMeta.type';

import { safeJsonStringify } from '../../shared/helpers/safeJsonStringify.helper';

import { config } from './config';

import { LOG_COLOURS, LOG_LEVEL, LOG_LEVELS } from '../../shared/constants/logLevel.const';

// Default Configuration
const MAX_LOG_FILE_SIZE = 10000000; // 10MB
const LOG_FILEPATH = path.resolve(config.env.logPath, 'led-matrix.log');

const { combine, timestamp, splat, colorize, printf } = winston.format;

// if used before it's initialised, will likely throw "cannot find 'x' on undefined"
export let logger: Logger;

/**
 * Formats a string for output into the console
 */
const consoleFormatter = printf((logEntry) => {
  let context = '';
  if (logEntry.context) {
    context = `[${logEntry.context}] `;
  }

  // Format an error log
  if (logEntry.meta && logEntry.meta instanceof Error) {
    const error: Error = logEntry.meta;
    let result: string = `\n${logEntry.timestamp} ${context}${logEntry.level}: ${error.name}`;
    result = `${result}\n============================================================`;
    result = `${result}\n${logEntry.message}\n${error.message}\n${error.stack}`;
    result = `${result}\n============================================================`;
    return result;
  }

  // Format other log types which have a meta object
  if (logEntry.meta) {
    const formattedMeta =
      typeof logEntry.meta === 'string' || typeof logEntry.meta === 'number'
        ? ` "${logEntry.meta}"`
        : `\n${safeJsonStringify(logEntry.meta)}`;

    return `${logEntry.timestamp} ${context}${logEntry.level}: ${logEntry.message}${formattedMeta}`;
  }

  // Format message only logs
  return `${logEntry.timestamp} ${context}${logEntry.level}: ${logEntry.message}`;
});

/**
 * A local replacement for console.log
 */
class Logger {
  /**
   * Transport that may be listened to for "logged" events
   */
  streamTransport: StreamTransportInstance & {
    on: (evt: 'logged', listener: Listener<LogDto>) => void;
  };

  private _winston: winston.Logger;

  /**
   * @constructor
   */
  constructor() {
    const consoleTimestampFormat = 'HH:mm:ss.SSS';

    // Create a transport for streaming to the socket for client debugging
    const streamTransport = new winston.transports.Stream({
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      stream: new Writable({ write(/*...args*/) {} }),
      format: timestamp(),
      level: config.env.logLevel,
    });
    this.streamTransport = streamTransport;

    // Create a transport for logging to the console for server debugging
    const consoleTransport = new winston.transports.Console({
      format: combine(
        colorize({ all: true, colors: LOG_COLOURS }),
        timestamp({ format: consoleTimestampFormat }),
        splat(),
        consoleFormatter
      ),
      level: config.env.logLevel,
    });

    // Create a transport for logging to a file
    const fileTransport = new winston.transports.File({
      filename: path.resolve(config.env.logPath, LOG_FILEPATH),
      maxsize: MAX_LOG_FILE_SIZE,
      level: config.env.logLevel,
    });

    // Create the winston instance
    this._winston = winston.createLogger({
      // format: combine(timestamp({ format: timestampFormat }), splat()),
      transports: [consoleTransport, streamTransport, fileTransport],
      levels: LOG_LEVELS,
    });

    this._winston.on('error', this.handleError.bind(this));
  }

  /**
   * Handle an error in winston
   */
  private handleError(err: Error) {
    console.error(`!!!WARNING!!! - WINSTON ERROR - UNABLE TO LOG TO TRANSPORTS - ${err}`, err);
  }

  /**
   * Write a standard 'log' ('info') level message
   */
  log(message: string, context: string, meta?: LogMetaType) {
    this._winston.log({
      level: LOG_LEVEL.INFO,
      context,
      message,
      meta,
    });
  }

  /**
   * Write an 'error' level message
   */
  error(message: string, context: string, error?: LogMetaType<Error>) {
    this._winston.log({
      level: LOG_LEVEL.ERROR,
      context,
      message,
      meta: error,
    });
  }

  /**
   * Write a 'warn' level log message
   */
  warn(message: string, context: string, meta?: LogMetaType) {
    this._winston.log({
      level: LOG_LEVEL.WARN,
      context,
      message,
      meta,
    });
  }

  /**
   * Write an 'info' level log message
   */
  info(message: string, context: string, meta?: LogMetaType) {
    this._winston.log({
      level: LOG_LEVEL.INFO,
      context,
      message,
      meta,
    });
  }

  /**
   * Write a `debug` level log message
   */
  debug(message: string, context: string, meta?: LogMetaType) {
    this._winston.log({
      level: LOG_LEVEL.DEBUG,
      context,
      message,
      meta,
    });
  }

  /**
   * Write a 'verbose' level log message
   */
  verbose(message: string, context: string, meta?: LogMetaType) {
    this._winston.log({
      level: LOG_LEVEL.VERBOSE,
      context,
      message,
      meta,
    });
  }
}

/**
 * Initialise the logger singleton.
 * This must be run before the logger can be used.
 */
export function initLogger() {
  logger = new Logger();
}
