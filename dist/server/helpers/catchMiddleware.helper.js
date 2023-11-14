"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchMiddleware = void 0;
/**
 * Wrap async Express middleware so errors are passed on to the NextFunction properly
 *
 * Without it, async errors are not piped to the error handling middleware properly (causes 500'd requests to hang)
 */
function catchMiddleware(middleware) {
    const doCatchMiddleware = async function doCatchMiddleware(req, res, next) {
        try {
            const result = await middleware(req, res, next);
            return result;
        }
        catch (error) {
            // pass error to the error handler middleware
            return next(error);
        }
    };
    return doCatchMiddleware;
}
exports.catchMiddleware = catchMiddleware;
