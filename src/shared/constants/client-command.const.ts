export const CLIENT_COMMAND = {
  SET_BRIGHTNESS: 'sb',
} as const;
export type CLIENT_COMMAND = typeof CLIENT_COMMAND;
export type A_CLIENT_COMMAND = CLIENT_COMMAND[keyof CLIENT_COMMAND];
