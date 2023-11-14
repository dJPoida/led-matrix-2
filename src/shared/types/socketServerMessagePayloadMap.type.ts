import { ServerStatusDto } from './dtos/serverStatus.dto.type';

import { SOCKET_SERVER_MESSAGE } from '../constants/socketServerMessage.const';

/**
 * Message Payload map from the socket server
 */
export type SocketServerMessagePayloadMap = {
  [SOCKET_SERVER_MESSAGE.CHALLENGE]: undefined;
  [SOCKET_SERVER_MESSAGE.AUTHORIZED]: undefined;
  [SOCKET_SERVER_MESSAGE.UNAUTHORIZED]: { reason: string };

  [SOCKET_SERVER_MESSAGE.SERVER_STATUS]: ServerStatusDto;

  [SOCKET_SERVER_MESSAGE.SERVER_SHUT_DOWN]: { reason?: string };

  // TODO: Log Server Message
  // [SOCKET_SERVER_MESSAGE.LOG]: { logSummary: LogSummary };
};

/**
 * Message Ack map from the socket server
 */
export type SocketServerMessageAckMap = {
  [SOCKET_SERVER_MESSAGE.CHALLENGE]: (clientKey: string) => void;
};
