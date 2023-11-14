import express, { Express } from 'express';
import http from 'http';
import { Server as SocketServer } from 'socket.io';

import { SocketServerEventMap } from '../../shared/types/socketServerEventPayloadMap.type';
import { ServerStatusDto } from '../../shared/types/dtos/serverStatus.dto.type';

import { socketServer } from './socketServer';

import { TypedEventEmitter } from '../../shared/lib/typedEventEmitter';

import { applyExpressMiddleware } from '../http/applyExpressMiddleware';
import { config } from './config';

import { KERNEL_EVENT, KernelEventMap } from '../constants/kernelEvent.const';
import { SOCKET_SERVER_EVENT } from '../constants/socketServerEvent.const';

export class Kernel extends TypedEventEmitter<KernelEventMap> {
  private _initialised = false;

  private _shuttingDown = false;

  public readonly expressApp: Express;

  public readonly httpServer: http.Server;

  /**
   * @constructor
   */
  constructor() {
    super();

    // Create the express app
    this.log.debug('Creating the expressApp');
    this.expressApp = express();

    // Create the http server
    this.log.debug('Creating the http server');
    this.httpServer = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
      this.expressApp(req, res);
    });

    // Start the initialisation sequence
    this.initialise();
  }

  /**
   * @property whether the class has been initialised or not
   */
  get initialised(): boolean {
    return this._initialised;
  }

  /**
   * @property whether the kernel is in the process of being shut down
   */
  get shuttingDown(): boolean {
    return this._shuttingDown;
  }

  /**
   * @property build the dto object which represents the server status
   */
  get statusDto(): ServerStatusDto {
    // TODO: Put some real data in the `ServerStatusDto`
    return {
      someData: 69,
    };
  }

  /**
   * Initialise the kernel
   */
  private async initialise(): Promise<void> {
    this.log.info('Kernel initialising...');

    // initialise the socket server
    try {
      this.log.debug('Initialising the Socket Server');
      await socketServer.initialise(new SocketServer(this.httpServer, {}));
    } catch (error) {
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
        this.emit(KERNEL_EVENT.INITIALISED, undefined);
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
  private bindEvents() {
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
    this.once(KERNEL_EVENT.INITIALISED, this.handleInitialised.bind(this));

    // Listen for Socket Events
    socketServer
      .on(SOCKET_SERVER_EVENT.CLIENT_CONNECTED, this.handleClientConnected.bind(this))
      .on(SOCKET_SERVER_EVENT.CLIENT_DISCONNECTED, this.handleClientDisconnected.bind(this));
  }

  /**
   * Fired once after the kernel has initialised
   */
  private handleInitialised() {
    this.log.info('Kernel initialised.');
    this.run();
  }

  /**
   * Fired by any of the appropriate termination events like SIGINT or CTRL+C etc...
   */
  private async handleTerminated(options: { cleanUp?: boolean; exit?: boolean }, exitCode: number) {
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
  private async run(): Promise<void> {
    // Apply the routing and middleware to the express app
    applyExpressMiddleware(this.expressApp);

    // Server running
    this.log.debug('Starting Http Server...');
    this.httpServer.listen(config.transport.HTTPPort, () => {
      this.log.info(`Http server running at http://localhost:${config.transport.HTTPPort}`);
    });

    this.log.info('Kernel Running');
  }

  /**
   * Perform the graceful sequence of shutting down the hardware
   */
  private async shutDown(): Promise<void> {
    // Only allow the shutdown once.
    if (!this.shuttingDown) {
      this._shuttingDown = true;
      this.log.info('Shutting Down...');

      try {
        // shutdown the socket server
        this.log.info('Shutting down the Socket Server...');
        await socketServer.shutDown();
      } catch (error) {
        this.log.error(`Error while shutting down the Socket Server: ${error}`);
      }

      try {
        // TODO: Shutdown the LED Matrix driver
        this.log.warn('TODO: Shutdown the LED Matrix Driver');
        // await this.ledStripDriver.shutDown();
      } catch (error) {
        this.log.error(`Error while shutting down LED Strip Driver: ${error}`);
      }
    }
  }

  /**
   * Fired when a client connects
   */
  private handleClientConnected({ socket }: SocketServerEventMap[SOCKET_SERVER_EVENT['CLIENT_CONNECTED']]) {
    // On connect, send an update directly to the socket with the status of the server
    setTimeout(() => socketServer.sendServerStatusToClients(this.statusDto, socket), 200);
  }

  /**
   * Fired when a client disconnects
   */
  private handleClientDisconnected({ socket }: SocketServerEventMap[SOCKET_SERVER_EVENT['CLIENT_DISCONNECTED']]) {
    // TODO: Handle Socket disconnection events
  }
}
