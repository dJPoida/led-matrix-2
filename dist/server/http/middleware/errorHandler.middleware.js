"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandlerMiddleware = void 0;
const contextLogger_1 = require("../../lib/contextLogger");
const errorHandlerMiddleware = function errorHandlerMiddleware(err, req, res, next) {
    const log = new contextLogger_1.ContextLogger('errorHandlerMiddleware()');
    log.error('Express handling error', err);
    if (res.writable) {
        res.status(500).json({ message: 'Internal server error', details: err });
    }
};
exports.errorHandlerMiddleware = errorHandlerMiddleware;
