import { Request, Response } from 'express';
import { Logger } from '../../../shared/logger';

export class HealthController {
  static async checkHealth(_req: Request, res: Response) {
    try {
      Logger.info('Health check requested');
      return res.status(200).json({
        status: 'ok',
        service: 'retry-service',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      Logger.error('Health check failed', error);
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error'
      });
    }
  }
} 