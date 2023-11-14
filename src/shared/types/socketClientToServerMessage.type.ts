import { SOCKET_CLIENT_MESSAGE } from '../constants/socketClientMessage.const';
import { ClientSocketMessagePayloadMap } from './socketClientMessagePayloadMap.type';

export type SocketClientToServerMessage = {
  command: (payload: ClientSocketMessagePayloadMap[SOCKET_CLIENT_MESSAGE['COMMAND']]) => void;
};
