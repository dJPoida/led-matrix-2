"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initLogger = exports.logger = void 0;
const path_1 = __importDefault(require("path"));
const winston_1 = __importDefault(require("winston"));
const stream_1 = require("stream");
const safeJsonStringify_helper_1 = require("../../shared/helpers/safeJsonStringify.helper");
const config_1 = require("./config");
const logLevel_const_1 = require("../../shared/constants/logLevel.const");
// Default Configuration
const MAX_LOG_FILE_SIZE = 10000000; // 10MB
const LOG_FILEPATH = path_1.default.resolve(config_1.config.env.logPath, 'led-matrix.log');
const { combine, timestamp, splat, colorize, printf } = winston_1.default.format;
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
        const error = logEntry.meta;
        let result = `\n${logEntry.timestamp} ${context}${logEntry.level}: ${error.name}`;
        result = `${result}\n============================================================`;
        result = `${result}\n${logEntry.message}\n${error.message}\n${error.stack}`;
        result = `${result}\n============================================================`;
        return result;
    }
    // Format other log types which have a meta object
    if (logEntry.meta) {
        const formattedMeta = typeof logEntry.meta === 'string' || typeof logEntry.meta === 'number'
            ? ` "${logEntry.meta}"`
            : `\n${(0, safeJsonStringify_helper_1.safeJsonStringify)(logEntry.meta)}`;
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
     * @constructor
     */
    constructor() {
        const consoleTimestampFormat = 'HH:mm:ss.SSS';
        // Create a transport for streaming to the socket for client debugging
        const streamTransport = new winston_1.default.transports.Stream({
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            stream: new stream_1.Writable({ write( /*...args*/) { } }),
            format: timestamp(),
            level: config_1.config.env.logLevel,
        });
        this.streamTransport = streamTransport;
        // Create a transport for logging to the console for server debugging
        const consoleTransport = new winston_1.default.transports.Console({
            format: combine(colorize({ all: true, colors: logLevel_const_1.LOG_COLOURS }), timestamp({ format: consoleTimestampFormat }), splat(), consoleFormatter),
            level: config_1.config.env.logLevel,
        });
        // Create a transport for logging to a file
        const fileTransport = new winston_1.default.transports.File({
            filename: path_1.default.resolve(config_1.config.env.logPath, LOG_FILEPATH),
            maxsize: MAX_LOG_FILE_SIZE,
            level: config_1.config.env.logLevel,
        });
        // Create the winston instance
        this._winston = winston_1.default.createLogger({
            // format: combine(timestamp({ format: timestampFormat }), splat()),
            transports: [consoleTransport, streamTransport, fileTransport],
            levels: logLevel_const_1.LOG_LEVELS,
        });
        this._winston.on('error', this.handleError.bind(this));
    }
    /**
     * Handle an error in winston
     */
    handleError(err) {
        console.error(`!!!WARNING!!! - WINSTON ERROR - UNABLE TO LOG TO TRANSPORTS - ${err}`, err);
    }
    /**
     * Write a standard 'log' ('info') level message
     */
    log(message, context, meta) {
        this._winston.log({
            level: logLevel_const_1.LOG_LEVEL.INFO,
            context,
            message,
            meta,
        });
    }
    /**
     * Write an 'error' level message
     */
    error(message, context, error) {
        this._winston.log({
            level: logLevel_const_1.LOG_LEVEL.ERROR,
            context,
            message,
            meta: error,
        });
    }
    /**
     * Write a 'warn' level log message
     */
    warn(message, context, meta) {
        this._winston.log({
            level: logLevel_const_1.LOG_LEVEL.WARN,
            context,
            message,
            meta,
        });
    }
    /**
     * Write an 'info' level log message
     */
    info(message, context, meta) {
        this._winston.log({
            level: logLevel_const_1.LOG_LEVEL.INFO,
            context,
            message,
            meta,
        });
    }
    /**
     * Write a `debug` level log message
     */
    debug(message, context, meta) {
        this._winston.log({
            level: logLevel_const_1.LOG_LEVEL.DEBUG,
            context,
            message,
            meta,
        });
    }
    /**
     * Write a 'verbose' level log message
     */
    verbose(message, context, meta) {
        this._winston.log({
            level: logLevel_const_1.LOG_LEVEL.VERBOSE,
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
function initLogger() {
    exports.logger = new Logger();
}
exports.initLogger = initLogger;
