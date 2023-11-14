"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextLogger = void 0;
const logger_1 = require("./logger");
/**
 * Wrap the global logger in a context so that output from the
 * log methods can be traced back to the appropriate source
 */
class ContextLogger {
    constructor(context) {
        this.context = context;
    }
    getContext() {
        return this.context;
    }
    /**
     * Write a standard 'log' ('info') level message
     */
    log(message, meta) {
        logger_1.logger.log(message, this.context, meta);
    }
    /**
     * Write an 'error' level message
     */
    error(message, error) {
        logger_1.logger.error(message, this.context, error);
    }
    /**
     * Write a 'warn' level log message
     */
    warn(message, meta) {
        logger_1.logger.warn(message, this.context, meta);
    }
    /**
     * Write an 'info' level log message
     */
    info(message, meta) {
        logger_1.logger.info(message, this.context, meta);
    }
    /**
     * Write a `debug` level log message
     */
    debug(message, meta) {
        logger_1.logger.debug(message, this.context, meta);
    }
    /**
     * Write a 'verbose' level log message
     */
    verbose(message, meta) {
        logger_1.logger.verbose(message, this.context, meta);
    }
}
exports.ContextLogger = ContextLogger;
