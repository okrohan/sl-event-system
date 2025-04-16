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
  static info(message: string) {
    logger.info(message);
  }

  static error(message: string, error?: any) {
    logger.error(message, error);
  }

  static warn(message: string) {
    logger.warn(message);
  }

  static debug(message: string) {
    logger.debug(message);
  }
} 