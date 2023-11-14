"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unused-vars */
const kernel_1 = require("./lib/kernel");
const logger_1 = require("./lib/logger");
const contextLogger_1 = require("./lib/contextLogger");
const config_1 = require("./lib/config");
// Initialise the logger
(0, logger_1.initLogger)();
// Create a context logger for the server
const log = new contextLogger_1.ContextLogger('server.ts');
log.info('Booting...');
log.info(`Environment: ${config_1.config.env.isDevelopment ? 'Development' : 'Production'}`);
// Start the kernel
log.verbose('Starting the Kernel...');
const kernel = new kernel_1.Kernel();
