import { Socket } from 'socket.io';

import { SocketServerToClientMessage } from './socketServerToClientMessage.type';
import { SocketClientToServerMessage } from './socketClientToServerMessage.type';
import { SocketData } from './socketData.type';

/**
 * Socket IO Socket with Typed Events
 */
export type SocketIoSocket = Socket<
  SocketClientToServerMessage,
  SocketServerToClientMessage,
  Record<string, unknown>,
  SocketData
>;
