"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SOCKET_SERVER_MESSAGE = void 0;
/**
 * Messages sent by the socket server
 */
exports.SOCKET_SERVER_MESSAGE = {
    // Auth
    CHALLENGE: 'challenge',
    AUTHORIZED: 'authorized',
    UNAUTHORIZED: 'unauthorized',
    // Status
    SERVER_STATUS: 'status',
    // Events
    SERVER_SHUT_DOWN: 'serverShutDown',
    // Info
    // TODO: Implement the 'LOG' Server Message
    // LOG: 'log'
};
