import { Server } from 'socket.io';

import { SocketServerToClientMessage } from './socketServerToClientMessage.type';
import { SocketClientToServerMessage } from './socketClientToServerMessage.type';
import { SocketData } from './socketData.type';

/**
 * Socket IO Server with Typed Events
 */
export type SocketIoServer = Server<
  SocketClientToServerMessage,
  SocketServerToClientMessage,
  Record<string, unknown>,
  SocketData
>;
