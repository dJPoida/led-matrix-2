export const LOG_LEVEL = {
  INFO: 'info',
  ERROR: 'error',
  WARN: 'warn',
  DEBUG: 'debug',
  VERBOSE: 'verbose',
} as const;

export const LOG_LEVELS = {
  [LOG_LEVEL.INFO]: 0,
  [LOG_LEVEL.ERROR]: 1,
  [LOG_LEVEL.WARN]: 2,
  [LOG_LEVEL.DEBUG]: 3,
  [LOG_LEVEL.VERBOSE]: 4,
} as const;

export const LOG_COLOURS = {
  [LOG_LEVEL.INFO]: 'green',
  [LOG_LEVEL.ERROR]: 'red',
  [LOG_LEVEL.WARN]: 'yellow',
  [LOG_LEVEL.DEBUG]: 'magenta',
  [LOG_LEVEL.VERBOSE]: 'blue',
} as const;

export type LOG_LEVEL = typeof LOG_LEVEL;
export type A_LOG_LEVEL = LOG_LEVEL[keyof LOG_LEVEL];
