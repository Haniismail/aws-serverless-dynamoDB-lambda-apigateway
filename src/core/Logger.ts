import { createLogger, transports, format } from 'winston';
import { environment } from '../config/envVar';

const logLevel = environment === 'development' ? 'debug' : 'warn';

const consoleFormat = format.combine(
  format.errors({ stack: true }),
  format.timestamp(),
  format.printf(({ level, message, timestamp }) => {
    let logLevel = level.toUpperCase();

    switch (level) {
      case 'info':
        logLevel = `\x1b[36m${logLevel}\x1b[0m`; // Cyan color
        break;
      case 'debug':
        logLevel = `\x1b[34m${logLevel}\x1b[0m`; // Blue color
        break;
      case 'warn':
        logLevel = `\x1b[33m${logLevel}\x1b[0m`; // Yellow color
        break;
      case 'error':
        logLevel = `\x1b[31m${logLevel}\x1b[0m`; // Red color
        break;
      default:
        break;
    }

    return `[${timestamp}] ${logLevel} \t${message}`;
  }),
);

export default createLogger({
  transports: [
    new transports.Console({
      level: logLevel,
      format: consoleFormat,
    }),
  ],
  exitOnError: false,
  silent: environment === 'test' ? true : false,
});
