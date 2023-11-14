"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketServer = void 0;
const process_1 = require("process");
const typedEventEmitter_1 = require("../../shared/lib/typedEventEmitter");
const socketServerEvent_const_1 = require("../constants/socketServerEvent.const");
const socketServerMessage_const_1 = require("../../shared/constants/socketServerMessage.const");
const socketClientMessage_const_1 = require("../../shared/constants/socketClientMessage.const");
let socketServerInstance = null;
/**
 * Controls the sending and receiving of information from and to the connected clients
 * over sockets
 */
class SocketServer extends typedEventEmitter_1.TypedEventEmitter {
    constructor() {
        super(...arguments);
        this._io = null;
        this._initialised = false;
        this.connectedClientCount = 0;
    }
    /**
     * The SocketIO Server
     */
    get io() {
        if (!this._io)
            throw ReferenceError('Attempt to access SocketServer.io prior to assignment!');
        return this._io;
    }
    get initialised() {
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
    bindEvents() {
        this.handleInitialised = this.handleInitialised.bind(this);
        this.handleSocketConnected = this.handleSocketConnected.bind(this);
        this.once(socketServerEvent_const_1.SOCKET_SERVER_EVENT.INITIALISED, this.handleInitialised);
        this.io.on('connection', this.handleSocketConnected);
    }
    /**
     * unbind the event listeners this class cares about
     */
    unbindEvents() {
        this.once(socketServerEvent_const_1.SOCKET_SERVER_EVENT.INITIALISED, this.handleInitialised);
        this.io.on('connection', (socket) => this.handleSocketConnected(socket));
    }
    /**
     * Fired when the Server Socket Handler is initialised
     */
    handleInitialised() {
        this.log.debug('Socket Server Initialised.');
    }
    /**
     * Fired when a client socket connection is established
     */
    handleSocketConnected(socket) {
        this.log.debug('Socket Connected. Awaiting identification...');
        // Create a temporary handler for this socket until they identify who / what they are
        socket.data.authKey = null;
        socket.on('disconnect', (reason) => this.handleSocketDisconnected(socket, reason));
        // Emit an auth challenge
        socket.emit(socketServerMessage_const_1.SOCKET_SERVER_MESSAGE.CHALLENGE, undefined, (clientKey) => this.handleSocketAuthReceived(socket, clientKey));
        // Setup a timeout to terminate the connection if we don't hear from them in 3 seconds.
        // TODO: Make the `authTimeout` configurable
        socket.data.authTimeout = setTimeout(() => {
            this.log.warn('Socket not authenticated. Booting.');
            if (socket.data.authTimeout) {
                clearTimeout(socket.data.authTimeout);
            }
            socket.emit(socketServerMessage_const_1.SOCKET_SERVER_MESSAGE.UNAUTHORIZED, { reason: 'No auth provided in the allotted time. Goodbye.' });
            socket.disconnect();
        }, 3000);
    }
    /**
     * Fired when an incoming socket attempts to authenticate.
     */
    handleSocketAuthReceived(socket, key) {
        // Clear the identity timeout on the socket
        if (socket.data.authTimeout) {
            clearTimeout(socket.data.authTimeout);
        }
        // TODO: Implement proper auth in the Socket Server
        if (key !== process_1.env.CLIENT_KEY) {
            this.log.warn('Socket provided an invalid CLIENT_KEY. Booting.', { key });
            socket.emit(socketServerMessage_const_1.SOCKET_SERVER_MESSAGE.UNAUTHORIZED, { reason: 'Invalid auth provided. Goodbye.' });
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
        socket.on(socketClientMessage_const_1.SOCKET_CLIENT_MESSAGE.COMMAND, (payload) => this.emitImmediate(socketServerEvent_const_1.SOCKET_SERVER_EVENT.CLIENT_COMMAND, { socket, command: payload }));
        // Let the socket know they've been authenticated
        socket.emit(socketServerMessage_const_1.SOCKET_SERVER_MESSAGE.AUTHORIZED, undefined);
        // Notify any listeners of this class that a client has connected
        this.emit(socketServerEvent_const_1.SOCKET_SERVER_EVENT.CLIENT_CONNECTED, { socket, connectedClientCount: this.connectedClientCount });
    }
    /**
     * Fired when a client socket is disconnected
     */
    handleSocketDisconnected(socket, disconnectReason) {
        if (socket.data.authKey) {
            this.connectedClientCount -= 1;
            this.log.debug(`Client disconnected: "${disconnectReason}"`, { connectedClientCount: this.connectedClientCount });
            // Notify any listeners of this class that a socket has disconnected
            this.emit(socketServerEvent_const_1.SOCKET_SERVER_EVENT.CLIENT_DISCONNECTED, { socket, connectedClientCount: this.connectedClientCount });
        }
        else {
            this.log.debug('Unidentified client disconnected');
        }
    }
    /**
     * Handle an error in a socket
     */
    handleSocketClientError(err) {
        this.log.error(`Socket client error: `, err);
    }
    /**
     * Initialise the Server Socket Handler
     */
    async initialise(io) {
        this.log.info('Socket Server initialising...');
        // Attach the Socket Server
        this._io = io;
        this.bindEvents();
        // Let everyone know that the Socket Handler is initialised
        this._initialised = true;
        this.emit(socketServerEvent_const_1.SOCKET_SERVER_EVENT.INITIALISED, undefined);
    }
    /**
     * Called by the Kernel when it is time to tear down the application
     */
    async shutDown(reason) {
        this.unbindEvents();
        if (this.initialised && this.io) {
            this.log.info('Socket Server shutting down...');
            this.io.emit(socketServerMessage_const_1.SOCKET_SERVER_MESSAGE.SERVER_SHUT_DOWN, { reason });
            // TODO: Kill all client connections during graceful shutdown with the appropriate reason
        }
    }
    /**
     * Send a message to a specific socket or to everyone
     */
    sendServerStatusToClients(payload, socket) {
        // Emit to a specific socket
        if (socket) {
            socket.emit(socketServerMessage_const_1.SOCKET_SERVER_MESSAGE.SERVER_STATUS, payload);
        }
        // Emit to everyone
        else {
            this.io.emit(socketServerMessage_const_1.SOCKET_SERVER_MESSAGE.SERVER_STATUS, payload);
        }
    }
}
exports.socketServer = SocketServer.getInstance();
