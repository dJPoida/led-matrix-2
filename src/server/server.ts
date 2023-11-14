/* eslint-disable @typescript-eslint/no-unused-vars */
import { Kernel } from './lib/kernel';
import { initLogger } from './lib/logger';
import { ContextLogger } from './lib/contextLogger';
import { config } from './lib/config';

// Initialise the logger
initLogger();

// Create a context logger for the server
const log = new ContextLogger('server.ts');
log.info('Booting...');
log.info(`Environment: ${config.env.isDevelopment ? 'Development' : 'Production'}`);

// Start the kernel
log.verbose('Starting the Kernel...');
const kernel = new Kernel();
