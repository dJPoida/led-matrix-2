"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyExpressMiddleware = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = require("path");
const fourZeroFour_middleware_1 = require("./middleware/fourZeroFour.middleware");
const errorHandler_middleware_1 = require("./middleware/errorHandler.middleware");
const applyWebpackDevelopment_middleware_1 = require("./applyWebpackDevelopment.middleware");
const config_1 = require("../lib/config");
/**
 * Create an express server to handle requests
 */
function applyExpressMiddleware(expressApp) {
    expressApp.use(express_1.default.json());
    expressApp.use(express_1.default.urlencoded({ extended: false }));
    // When in development mode, apply the Webpack Development Middleware (hot reload etc...)
    (0, applyWebpackDevelopment_middleware_1.applyWebpackDevelopmentMiddleware)(expressApp);
    // Serve the client static js assets
    expressApp.use('/js/:filename', (req, res) => {
        const { filename } = req.params;
        res.sendFile((0, path_1.resolve)(__dirname, config_1.config.env.distPath, `client/js/${filename}`));
    });
    // Serve the client index
    expressApp.get(['/', '/index'], (req, res) => {
        res.sendFile((0, path_1.resolve)(__dirname, config_1.config.env.distPath, 'client/index.html'));
    });
    // Static assets
    expressApp.use(express_1.default.static((0, path_1.join)((0, path_1.resolve)(__dirname, config_1.config.env.distPath), 'client')));
    // Catch errors in async code and pipe through to Express' error handler
    expressApp.use('/', fourZeroFour_middleware_1.fourZeroFourMiddleware);
    // Error handling middleware
    expressApp.use(errorHandler_middleware_1.errorHandlerMiddleware);
    return expressApp;
}
exports.applyExpressMiddleware = applyExpressMiddleware;
