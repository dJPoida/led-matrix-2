"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classLoggerFactory = void 0;
const contextLogger_1 = require("../lib/contextLogger");
/**
 * Create a context logger which automatically detects the class name as the context
 */
function classLoggerFactory(classToLog) {
    const { constructor: { name }, } = classToLog;
    return new contextLogger_1.ContextLogger(name);
}
exports.classLoggerFactory = classLoggerFactory;
