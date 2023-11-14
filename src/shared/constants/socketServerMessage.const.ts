/**
 * Messages sent by the socket server
 */
export const SOCKET_SERVER_MESSAGE = {
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
} as const;

export type SOCKET_SERVER_MESSAGE = typeof SOCKET_SERVER_MESSAGE;
export type A_SOCKET_SERVER_MESSAGE = SOCKET_SERVER_MESSAGE[keyof SOCKET_SERVER_MESSAGE];
