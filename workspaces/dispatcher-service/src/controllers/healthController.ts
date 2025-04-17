import { Request, Response } from 'express';
import { Logger } from '@sl-event-system/shared';

export class HealthController {
  static async checkHealth(req: Request, res: Response) {
    try {
      Logger.info('Health check requested');
      res.status(200).json({ status: 'ok' });
    } catch (error) {
      Logger.error('Health check failed:', error);
      res.status(500).json({ error: 'Health check failed' });
    }
  }
}
