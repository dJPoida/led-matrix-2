/**
 * Messages sent by the Socket Client to the Server
 */
export const SOCKET_CLIENT_MESSAGE = {
  // A command that should be interpreted by the server
  COMMAND: 'command',
} as const;
export type SOCKET_CLIENT_MESSAGE = typeof SOCKET_CLIENT_MESSAGE;
export type A_SOCKET_CLIENT_MESSAGE = SOCKET_CLIENT_MESSAGE[keyof SOCKET_CLIENT_MESSAGE];
