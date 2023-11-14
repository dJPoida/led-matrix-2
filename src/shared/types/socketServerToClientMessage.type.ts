import { SocketServerMessageAckMap, SocketServerMessagePayloadMap } from './socketServerMessagePayloadMap.type';

import { SOCKET_SERVER_MESSAGE } from '../constants/socketServerMessage.const';

export type SocketServerToClientMessage = {
  // Request the authorisation token from the client
  challenge: (
    payload: SocketServerMessagePayloadMap[SOCKET_SERVER_MESSAGE['CHALLENGE']],
    response: SocketServerMessageAckMap[SOCKET_SERVER_MESSAGE['CHALLENGE']]
  ) => void;

  // Notify the client that it's authorized
  authorized: (payload: SocketServerMessagePayloadMap[SOCKET_SERVER_MESSAGE['AUTHORIZED']]) => void;

  // Notify the client that the challenge response was invalid and they are not authorized
  unauthorized: (payload: SocketServerMessagePayloadMap[SOCKET_SERVER_MESSAGE['UNAUTHORIZED']]) => void;

  // Send a status update to the client
  status: (payload: SocketServerMessagePayloadMap[SOCKET_SERVER_MESSAGE['SERVER_STATUS']]) => void;

  // Let the client know the server has been shut down
  serverShutDown: (payload: SocketServerMessagePayloadMap[SOCKET_SERVER_MESSAGE['SERVER_SHUT_DOWN']]) => void;
};
