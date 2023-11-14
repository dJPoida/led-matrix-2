import { A_LOG_LEVEL } from '../../constants/logLevel.const';
import { LogMetaType } from '../logMeta.type';

export interface LogDto<T = LogMetaType> {
  readonly timestamp: Date;
  readonly level: A_LOG_LEVEL;
  readonly context?: string;
  readonly message: string;
  readonly meta?: T;
}
