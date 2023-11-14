import { A_LOG_LEVEL } from '../../shared/constants/logLevel.const';

declare const __VERSION__: string;
declare const __CLIENT_KEY__: string;
declare const __ENVIRONMENT__: string;
declare const __LOG_LEVEL__: string;

export const global: {
  VERSION: string;
  ENVIRONMENT: string;
  LOG_LEVEL: A_LOG_LEVEL;
  CLIENT_KEY: string;
} = {
  VERSION: __VERSION__,
  ENVIRONMENT: __ENVIRONMENT__,
  LOG_LEVEL: __LOG_LEVEL__ as A_LOG_LEVEL,

  // TODO: Implement Proper Auth
  // @deprecated: Need to introduce proper auth
  CLIENT_KEY: __CLIENT_KEY__,
};
