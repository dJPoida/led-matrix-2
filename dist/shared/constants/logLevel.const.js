"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOG_COLOURS = exports.LOG_LEVELS = exports.LOG_LEVEL = void 0;
exports.LOG_LEVEL = {
    INFO: 'info',
    ERROR: 'error',
    WARN: 'warn',
    DEBUG: 'debug',
    VERBOSE: 'verbose',
};
exports.LOG_LEVELS = {
    [exports.LOG_LEVEL.INFO]: 0,
    [exports.LOG_LEVEL.ERROR]: 1,
    [exports.LOG_LEVEL.WARN]: 2,
    [exports.LOG_LEVEL.DEBUG]: 3,
    [exports.LOG_LEVEL.VERBOSE]: 4,
};
exports.LOG_COLOURS = {
    [exports.LOG_LEVEL.INFO]: 'green',
    [exports.LOG_LEVEL.ERROR]: 'red',
    [exports.LOG_LEVEL.WARN]: 'yellow',
    [exports.LOG_LEVEL.DEBUG]: 'magenta',
    [exports.LOG_LEVEL.VERBOSE]: 'blue',
};
