"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kernel = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const socketServer_1 = require("./socketServer");
const typedEventEmitter_1 = require("../../shared/lib/typedEventEmitter");
const applyExpressMiddleware_1 = require("../http/applyExpressMiddleware");
const config_1 = require("./config");
const kernelEvent_const_1 = require("../constants/kernelEvent.const");
const socketServerEvent_const_1 = require("../constants/socketServerEvent.const");
class Kernel extends typedEventEmitter_1.TypedEventEmitter {
    /**
     * @constructor
     */
    constructor() {
        super();
        this._initialised = false;
        this._shuttingDown = false;
        // Create the express app
        this.log.debug('Creating the expressApp');
        this.expressApp = (0, express_1.default)();
        // Create the http server
        this.log.debug('Creating the http server');
        this.httpServer = http_1.default.createServer((req, res) => {
            this.expressApp(req, res);
        });
        // Start the initialisation sequence
        this.initialise();
    }
    /**
     * @property whether the class has been initialised or not
     */
    get initialised() {
        return this._initialised;
    }
    /**
     * @property whether the kernel is in the process of being shut down
     */
    get shuttingDown() {
        return this._shuttingDown;
    }
    /**
     * @property build the dto object which represents the server status
     */
    get statusDto() {
        // TODO: Put some real data in the `ServerStatusDto`
        return {
            someData: 69,
        };
    }
    /**
     * Initialise the kernel
     */
    async initialise() {
        this.log.info('Kernel initialising...');
        // initialise the socket server
        try {
            this.log.debug('Initialising the Socket Server');
            await socketServer_1.socketServer.initialise(new socket_io_1.Server(this.httpServer, {}));
        }
        catch (error) {
            this.log.error(`Error while initialising the Socket Server: ${error}`);
            // eslint-disable-next-line no-process-exit
            process.exit(1);
        }
        // Perform all other asynchronous initialisation
        Promise.all([
        // TODO: Initialise the ledMatrixDriver
        // this.ledMatrixDriver.initialise(),
        ])
            .then(() => {
            this.log.debug('Binding Events...');
            this.bindEvents();
            this._initialised = true;
            this.emit(kernelEvent_const_1.KERNEL_EVENT.INITIALISED, undefined);
        })
            .catch((error) => {
            this.log.error(error);
            // eslint-disable-next-line no-process-exit
            process.exit(1);
        });
    }
    /**
     * Bind the event listeners this class cares about
     */
    bindEvents() {
        // When the process is requested to exit, clean up prior to exit.
        process.once('exit', (code) => {
            this.handleTerminated({ cleanUp: true }, code);
        });
        // catch ctrl+c events
        process.once('SIGINT', () => {
            this.log.verbose('\n\n### CTRL+C Received ###\n\n');
            this.handleTerminated({ exit: true }, 0);
        });
        // catches "kill pid" (for example: nodemon restart)
        process.once('SIGUSR1', () => {
            this.handleTerminated({ exit: true }, 0);
        });
        process.once('SIGUSR2', () => {
            this.handleTerminated({ exit: true }, 0);
        });
        // catches uncaught exceptions
        process.once('uncaughtException', (error) => {
            this.log.error('\n\nUncaught Exception: ', error);
            this.handleTerminated({ exit: true }, 1);
        });
        // Listen for Kernel Events
        this.once(kernelEvent_const_1.KERNEL_EVENT.INITIALISED, this.handleInitialised.bind(this));
        // Listen for Socket Events
        socketServer_1.socketServer
            .on(socketServerEvent_const_1.SOCKET_SERVER_EVENT.CLIENT_CONNECTED, this.handleClientConnected.bind(this))
            .on(socketServerEvent_const_1.SOCKET_SERVER_EVENT.CLIENT_DISCONNECTED, this.handleClientDisconnected.bind(this));
    }
    /**
     * Fired once after the kernel has initialised
     */
    handleInitialised() {
        this.log.info('Kernel initialised.');
        this.run();
    }
    /**
     * Fired by any of the appropriate termination events like SIGINT or CTRL+C etc...
     */
    async handleTerminated(options, exitCode) {
        this.log.warn(`Kernel Terminating with exit code ${exitCode}...`);
        // Perform the graceful shutdown
        await this.shutDown();
        if (options.exit) {
            // eslint-disable-next-line no-process-exit
            process.nextTick(() => {
                process.exit(exitCode || 0);
            });
        }
    }
    /**
     * Run the application
     * Fired by the handleInitialised event
     */
    async run() {
        // Apply the routing and middleware to the express app
        (0, applyExpressMiddleware_1.applyExpressMiddleware)(this.expressApp);
        // Server running
        this.log.debug('Starting Http Server...');
        this.httpServer.listen(config_1.config.transport.HTTPPort, () => {
            this.log.info(`Http server running at http://localhost:${config_1.config.transport.HTTPPort}`);
        });
        this.log.info('Kernel Running');
    }
    /**
     * Perform the graceful sequence of shutting down the hardware
     */
    async shutDown() {
        // Only allow the shutdown once.
        if (!this.shuttingDown) {
            this._shuttingDown = true;
            this.log.info('Shutting Down...');
            try {
                // shutdown the socket server
                this.log.info('Shutting down the Socket Server...');
                await socketServer_1.socketServer.shutDown();
            }
            catch (error) {
                this.log.error(`Error while shutting down the Socket Server: ${error}`);
            }
            try {
                // TODO: Shutdown the LED Matrix driver
                this.log.warn('TODO: Shutdown the LED Matrix Driver');
                // await this.ledStripDriver.shutDown();
            }
            catch (error) {
                this.log.error(`Error while shutting down LED Strip Driver: ${error}`);
            }
        }
    }
    /**
     * Fired when a client connects
     */
    handleClientConnected({ socket }) {
        // On connect, send an update directly to the socket with the status of the server
        setTimeout(() => socketServer_1.socketServer.sendServerStatusToClients(this.statusDto, socket), 200);
    }
    /**
     * Fired when a client disconnects
     */
    handleClientDisconnected({ socket }) {
        // TODO: Handle Socket disconnection events
    }
}
exports.Kernel = Kernel;
