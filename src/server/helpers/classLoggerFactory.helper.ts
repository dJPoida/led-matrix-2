import { ContextLogger } from '../lib/contextLogger';

/**
 * Create a context logger which automatically detects the class name as the context
 */
export function classLoggerFactory(classToLog: { constructor: { name: string } }): ContextLogger {
  const {
    constructor: { name },
  } = classToLog;

  return new ContextLogger(name);
}
