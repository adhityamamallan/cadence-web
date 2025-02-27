import { stdSerializers, type LoggerOptions } from 'pino';

import getLogBody from './helpers/get-log-body';
import { type CustomLevels } from './pino.types';

const isDevelopment = process.env.NODE_ENV === 'development';

const LOGGER_CONFIG: LoggerOptions<CustomLevels> = {
  messageKey: 'message',
  errorKey: 'error',
  level: isDevelopment ? 'trace' : 'info',
  formatters: {
    level: (label) => ({ level: label }),
  },
  serializers: {
    error: stdSerializers.err,
    errors: (errors: Array<Error>) => errors.map(stdSerializers.err),
  },
  // To add custom levels, update the corresponding type and add the level values here
  // customLevels: {
  //   silly: 5,
  // },
  ...(!isDevelopment && {
    browser: {
      transmit: {
        level: 'warn',
        send: (level, logEvent) => {
          navigator.sendBeacon(
            '/api/log',
            JSON.stringify(getLogBody(level, logEvent))
          );
        },
      },
    },
  }),
};

export default LOGGER_CONFIG;
