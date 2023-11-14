import { ClientCommandDto } from './dtos/clientCommand.dto.type';
import { SocketIoSocket } from './socketIoSocket.type';

import { SOCKET_SERVER_EVENT } from '../../server/constants/socketServerEvent.const';

/**
 * Socket Server Event Payloads
 */
export type SocketServerEventMap = {
  [SOCKET_SERVER_EVENT.INITIALISED]: undefined;
  [SOCKET_SERVER_EVENT.CLIENT_CONNECTED]: { socket: SocketIoSocket; connectedClientCount: number };
  [SOCKET_SERVER_EVENT.CLIENT_DISCONNECTED]: { socket: SocketIoSocket; connectedClientCount: number };
  [SOCKET_SERVER_EVENT.CLIENT_COMMAND]: { socket: SocketIoSocket; command: ClientCommandDto };
};
