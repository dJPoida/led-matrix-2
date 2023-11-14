import { ClientCommandDto } from './dtos/clientCommand.dto.type';

import { SOCKET_CLIENT_MESSAGE } from '../constants/socketClientMessage.const';

/**
 * Message Type map from the Socket Client messages
 */
export type ClientSocketMessagePayloadMap = {
  [SOCKET_CLIENT_MESSAGE.COMMAND]: ClientCommandDto;
};

/**
 * Payload map from the Socket Client messages
 */
export type ClientSocketMessagePayload = {
  type: SOCKET_CLIENT_MESSAGE['COMMAND'];
  payload: ClientSocketMessagePayloadMap[SOCKET_CLIENT_MESSAGE['COMMAND']];
};
