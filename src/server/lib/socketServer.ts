import { env } from 'process';
import { TypedEventEmitter } from '../../shared/lib/typedEventEmitter';
import { SocketServerEventMap } from '../../shared/types/socketServerEventPayloadMap.type';
import { SocketIoServer } from '../../shared/types/socketIoServer.type';
import { SOCKET_SERVER_EVENT } from '../constants/socketServerEvent.const';
import { SocketIoSocket } from '../../shared/types/socketIoSocket.type';
import { SOCKET_SERVER_MESSAGE } from '../../shared/constants/socketServerMessage.const';
import { SOCKET_CLIENT_MESSAGE } from '../../shared/constants/socketClientMessage.const';
import { ClientSocketMessagePayloadMap } from '../../shared/types/socketClientMessagePayloadMap.type';
import { SocketServerMessagePayloadMap } from '../../shared/types/socketServerMessagePayloadMap.type';

let socketServerInstance: null | SocketServer = null;

/**
 * Controls the sending and receiving of information from and to the connected clients
 * over sockets
 */
class SocketServer extends TypedEventEmitter<SocketServerEventMap> {
  private _io: SocketIoServer | null = null;

  private _initialised = false;

  private connectedClientCount = 0;

  /**
   * The SocketIO Server
   */
  get io(): SocketIoServer {
    if (!this._io) throw ReferenceError('Attempt to access SocketServer.io prior to assignment!');
    return this._io;
  }

  get initialised(): boolean {
    return this._initialised;
  }

  /**
   * Create a new instance of the Socket Server Class if one does not already exist
   *
   * @returns {SocketServer}
   */
  static getInstance() {
    if (!socketServerInstance) {
      socketServerInstance = new SocketServer();
    }

    return socketServerInstance;
  }

  /**
   * Bind the event listeners this class cares about
   */
  private bindEvents() {
    this.handleInitialised = this.handleInitialised.bind(this);
    this.handleSocketConnected = this.handleSocketConnected.bind(this);

    this.once(SOCKET_SERVER_EVENT.INITIALISED, this.handleInitialised);

    this.io.on('connection', this.handleSocketConnected);
  }

  /**
   * unbind the event listeners this class cares about
   */
  private unbindEvents() {
    this.once(SOCKET_SERVER_EVENT.INITIALISED, this.handleInitialised);

    this.io.on('connection', (socket) => this.handleSocketConnected(socket));
  }

  /**
   * Fired when the Server Socket Handler is initialised
   */
  private handleInitialised() {
    this.log.debug('Socket Server Initialised.');
  }

  /**
   * Fired when a client socket connection is established
   */
  private handleSocketConnected(socket: SocketIoSocket) {
    this.log.debug('Socket Connected. Awaiting identification...');

    // Create a temporary handler for this socket until they identify who / what they are
    socket.data.authKey = null;

    socket.on('disconnect', (reason) => this.handleSocketDisconnected(socket, reason));

    // Emit an auth challenge
    socket.emit(SOCKET_SERVER_MESSAGE.CHALLENGE, undefined, (clientKey: string) =>
      this.handleSocketAuthReceived(socket, clientKey)
    );

    // Setup a timeout to terminate the connection if we don't hear from them in 3 seconds.
    // TODO: Make the `authTimeout` configurable
    socket.data.authTimeout = setTimeout(() => {
      this.log.warn('Socket not authenticated. Booting.');
      if (socket.data.authTimeout) {
        clearTimeout(socket.data.authTimeout);
      }
      socket.emit(SOCKET_SERVER_MESSAGE.UNAUTHORIZED, { reason: 'No auth provided in the allotted time. Goodbye.' });
      socket.disconnect();
    }, 3000);
  }

  /**
   * Fired when an incoming socket attempts to authenticate.
   */
  private handleSocketAuthReceived(socket: SocketIoSocket, key: string) {
    // Clear the identity timeout on the socket
    if (socket.data.authTimeout) {
      clearTimeout(socket.data.authTimeout);
    }

    // TODO: Implement proper auth in the Socket Server
    if (key !== env.CLIENT_KEY) {
      this.log.warn('Socket provided an invalid CLIENT_KEY. Booting.', { key });
      socket.emit(SOCKET_SERVER_MESSAGE.UNAUTHORIZED, { reason: 'Invalid auth provided. Goodbye.' });
      socket.disconnect();
      return;
    }

    // Keeping the key lets us know the socket is authenticated
    socket.data.authKey = key;

    // Keep track of the connected client
    this.connectedClientCount += 1;

    this.log.debug('New Socket Authenticated OK.', { connectedClientCount: this.connectedClientCount });

    // If everything else checks out - setup the rest of the socket handler stuff
    socket.on('error', this.handleSocketClientError.bind(this));
    socket.on(
      SOCKET_CLIENT_MESSAGE.COMMAND,
      (payload: ClientSocketMessagePayloadMap[SOCKET_CLIENT_MESSAGE['COMMAND']]) =>
        this.emitImmediate(SOCKET_SERVER_EVENT.CLIENT_COMMAND, { socket, command: payload })
    );

    // Let the socket know they've been authenticated
    socket.emit(SOCKET_SERVER_MESSAGE.AUTHORIZED, undefined);

    // Notify any listeners of this class that a client has connected
    this.emit(SOCKET_SERVER_EVENT.CLIENT_CONNECTED, { socket, connectedClientCount: this.connectedClientCount });
  }

  /**
   * Fired when a client socket is disconnected
   */
  private handleSocketDisconnected(socket: SocketIoSocket, disconnectReason: string) {
    if (socket.data.authKey) {
      this.connectedClientCount -= 1;
      this.log.debug(`Client disconnected: "${disconnectReason}"`, { connectedClientCount: this.connectedClientCount });

      // Notify any listeners of this class that a socket has disconnected
      this.emit(SOCKET_SERVER_EVENT.CLIENT_DISCONNECTED, { socket, connectedClientCount: this.connectedClientCount });
    } else {
      this.log.debug('Unidentified client disconnected');
    }
  }

  /**
   * Handle an error in a socket
   */
  private handleSocketClientError(err: Error) {
    this.log.error(`Socket client error: `, err);
  }

  /**
   * Initialise the Server Socket Handler
   */
  async initialise(io: SocketIoServer) {
    this.log.info('Socket Server initialising...');

    // Attach the Socket Server
    this._io = io;

    this.bindEvents();

    // Let everyone know that the Socket Handler is initialised
    this._initialised = true;
    this.emit(SOCKET_SERVER_EVENT.INITIALISED, undefined);
  }

  /**
   * Called by the Kernel when it is time to tear down the application
   */
  async shutDown(reason?: string) {
    this.unbindEvents();

    if (this.initialised && this.io) {
      this.log.info('Socket Server shutting down...');
      this.io.emit(SOCKET_SERVER_MESSAGE.SERVER_SHUT_DOWN, { reason });

      // TODO: Kill all client connections during graceful shutdown with the appropriate reason
    }
  }

  /**
   * Send a message to a specific socket or to everyone
   */
  sendServerStatusToClients(
    payload: SocketServerMessagePayloadMap[SOCKET_SERVER_MESSAGE['SERVER_STATUS']],
    socket?: SocketIoSocket
  ) {
    // Emit to a specific socket
    if (socket) {
      socket.emit(SOCKET_SERVER_MESSAGE.SERVER_STATUS, payload);
    }

    // Emit to everyone
    else {
      this.io.emit(SOCKET_SERVER_MESSAGE.SERVER_STATUS, payload);
    }
  }
}

export const socketServer = SocketServer.getInstance();
