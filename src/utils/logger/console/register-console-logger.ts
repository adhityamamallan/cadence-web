import { type Logger } from '..';

import stripEscapesFromNextLog from './helpers/strip-escapes-from-next-log';
import { CONSOLE_LOG_LEVEL_TO_LOG_LEVEL_MAP } from './register-console-logger.constants';
import { type ConsoleLogLevel } from './register-console-logger.types';

/**
 * Registers a custom logger to override the default console logging used by Next.js.
 * See: https://github.com/vercel/next.js/discussions/63787#discussioncomment-11978877
 */
export default function registerConsoleLogger(
  logger: Logger,
  consoleLogLevel: ConsoleLogLevel
) {
  const level = CONSOLE_LOG_LEVEL_TO_LOG_LEVEL_MAP[consoleLogLevel];

  return (...args: unknown[]) => {
    const data: Record<string, unknown> = {};
    let hasData = false;
    let error: Error | null = null;
    const messages: Array<string> = [];

    for (const arg of args) {
      if (arg instanceof Error) {
        error = arg;
        continue;
      }

      if (typeof arg === 'object' && arg !== null) {
        Object.assign(data, arg);
        hasData = true;
        continue;
      }

      if (typeof arg === 'string') {
        messages.push(arg);
      }
    }

    let finalMessage = stripEscapesFromNextLog(messages.join(' ')).trim();

    // next.js uses an "⨯" for the error message when it's an error object
    if (finalMessage === '⨯' && error) {
      finalMessage = error?.message || '';
    }

    if (error && hasData && messages.length > 0) {
      logger[level]({ data, error }, finalMessage);
    } else if (error && messages.length > 0) {
      logger[level]({ error }, finalMessage);
    } else if (hasData && messages.length > 0) {
      logger[level]({ data }, finalMessage);
    } else if (error && hasData && messages.length === 0) {
      logger[level]({ data, error }, error.message);
    } else if (error && messages.length === 0) {
      logger[level]({ error }, error.message);
    } else if (hasData && messages.length === 0) {
      logger[level]({ data });
    } else {
      logger[level](finalMessage);
    }
  };
}
