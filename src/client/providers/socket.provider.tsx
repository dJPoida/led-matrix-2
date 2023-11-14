import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Socket, io } from 'socket.io-client';

import { SocketServerToClientMessage } from '../../shared/types/socketServerToClientMessage.type';
import { SocketClientToServerMessage } from '../../shared/types/socketClientToServerMessage.type';

import { SOCKET_CLIENT_MESSAGE } from '../../shared/constants/socketClientMessage.const';
import { SOCKET_SERVER_MESSAGE } from '../../shared/constants/socketServerMessage.const';

import { global } from '../constants/global.const';
import { ClientContextLogger } from '../helpers/client-context-logger.helper';
import { ClientCommandDto } from '../../shared/types/dtos/clientCommand.dto.type';
import { ClientSocketMessagePayload } from '../../shared/types/socketClientMessagePayloadMap.type';
import { SocketServerMessagePayloadMap } from '../../shared/types/socketServerMessagePayloadMap.type';

type SocketContext = {
  sendCommand: (payload: ClientCommandDto) => unknown;
  sendMessage: (payload: ClientSocketMessagePayload) => unknown;
  socketConnected: boolean;
  socket: Socket<SocketServerToClientMessage, SocketClientToServerMessage>;
};

export const SocketContext = createContext<SocketContext>(null as never);

type SocketProviderProps = {
  children?: ReactNode;
};

const socket: Socket<SocketServerToClientMessage, SocketClientToServerMessage> = io({
  autoConnect: false, // Don't attempt to connect until we're ready
  reconnection: true, // Reconnect when the connection is lost
  reconnectionAttempts: Infinity, // Keep reconnecting until the sun explodes
});

const log = new ClientContextLogger('SocketProvider');

/**
 * Provides access to the web socket for transmitting and receiving data from the server
 */
export const SocketProvider: React.FC<SocketProviderProps> = function SocketProvider({ children }) {
  const [connected, setConnected] = useState<SocketContext['socketConnected']>(false);

  /**
   * Method to send a command to the server
   */
  const sendMessage = useCallback(
    function sendMessage(payload: ClientSocketMessagePayload) {
      if (!connected) {
        log.error('[sendMessage] Unable to send message: not connected', payload);
      } else {
        socket.emit(payload.type, payload.payload);
      }
    },
    [connected]
  );

  /**
   * Method to send a command to the server
   */
  const sendCommand = useCallback(
    function sendCommand(payload: ClientCommandDto) {
      if (!connected) {
        log.error('[sendCommand] Unable to send command: not connected', payload);
      } else {
        socket.emit(SOCKET_CLIENT_MESSAGE.COMMAND, payload);
      }
    },
    [connected]
  );

  /**
   * Connect listeners on connection to the webRTC peer
   */
  useEffect(() => {
    log.info('connecting...');
    /**
     * Attempt to reconnect
     */
    const reconnect = () => {
      setTimeout(() => {
        if (!socket.connected) {
          socket.connect();
        }
      }, 500);
    };

    /**
     * Respond to a successful Authorization
     */
    const handleAuthorized = () => {
      setConnected(true);
    };

    /**
     * Respond to a Failed Authorization
     */
    const handleUnauthorized = (reason: SocketServerMessagePayloadMap[SOCKET_SERVER_MESSAGE['UNAUTHORIZED']]) => {
      log.error(`Unauthorized: ${reason}`);

      // If the authorisation fails - reload the page. This should trigger a login page load
      // TODO: Make authorisation failures more graceful. Perhaps trigger an event that can be consumed and handled instead
      setTimeout(() => {
        window.location.reload();
      }, 500);
    };

    /**
     * Respond to a challenge for authorization
     * TODO: Implement proper auth in the Socket Client
     */
    const handleChallenge = (payload: undefined, callback: (response: string) => void) => {
      callback(global.CLIENT_KEY);
    };

    // bindings
    const handleConnection = () => {
      log.info('Socket connection established');
    };

    /**
     * Fired when the socket is disconnected for some reason
     */
    const handleDisconnection = (reason: string) => {
      log.warn(`Socket connection lost: ${reason}`);
      setConnected(false);

      // if the server booted us - let's attempt to re-connect
      if (reason === 'io server disconnect') {
        reconnect();
      }
    };

    /**
     * Fired when a connection attempt fails
     */
    const handleConnectError = () => {
      log.warn('Socket connection attempt failed.');
      setConnected(false);

      // If the socket cannot connect to the server - reload the page so that the browser updates (i.e. leaves the )
      // TODO: Make Socket connection errors more graceful and use state to render a different interface
      setTimeout(() => {
        window.location.reload();
      }, 500);
    };

    socket.on('connect', handleConnection);
    socket.on('disconnect', handleDisconnection);
    socket.on('connect_error', handleConnectError);
    socket.on(SOCKET_SERVER_MESSAGE.CHALLENGE, handleChallenge);
    socket.on(SOCKET_SERVER_MESSAGE.AUTHORIZED, handleAuthorized);
    socket.on(SOCKET_SERVER_MESSAGE.UNAUTHORIZED, handleUnauthorized);

    // begin connection
    socket.connect();

    // destroy listeners on un-mount
    return () => {
      socket.off('connect', handleConnection);
      socket.off('disconnect', handleDisconnection);
      socket.off('connect_error', handleConnectError);
      socket.off(SOCKET_SERVER_MESSAGE.CHALLENGE, handleChallenge);
      socket.off(SOCKET_SERVER_MESSAGE.AUTHORIZED, handleAuthorized);
      socket.off(SOCKET_SERVER_MESSAGE.UNAUTHORIZED, handleUnauthorized);

      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        sendCommand,
        sendMessage,
        socket,
        socketConnected: connected,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
