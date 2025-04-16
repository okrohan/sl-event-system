import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

export class Logger {
  static info(message: string, ...args: any[]) {
    if (args.length > 0) {
      logger.info(message, ...args);
    } else {
      logger.info(message);
    }
  }

  static error(message: string, ...args: any[]) {
    if (args.length > 0) {
      logger.error(message, ...args);
    } else {
      logger.error(message);
    }
  }

  static warn(message: string, ...args: any[]) {
    if (args.length > 0) {
      logger.warn(message, ...args);
    } else {
      logger.warn(message);
    }
  }

  static debug(message: string, ...args: any[]) {
    if (args.length > 0) {
      logger.debug(message, ...args);
    } else {
      logger.debug(message);
    }
  }
} 