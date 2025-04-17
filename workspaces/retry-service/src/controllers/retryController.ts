import { Request, Response } from 'express';
import { RetryService } from '../services/retryService';
import { Logger, IEvent, IEventStatus } from '@sl-event-system/shared';

export class RetryController {
  static async processEvent(event: IEvent) {
    try {
      await RetryService.processEvent(event);
      return true;
    } catch (error) {
      Logger.error('Error dispatching event:', error);
      throw error;
    }
  }

  static async processDeadLetterEvent(req: Request, res: Response): Promise<Response> {
    try {
      const body = req.body as { limit: number; from: number };
      const limit = body.limit || 1000;
      const from = body.from || 0;
      const cnt = await RetryService.replayEventsByStatus(IEventStatus.DEAD_LETTERED, limit, from);
      return res.status(201).json({ message: 'Event Replayed', count: cnt, from, limit });
    } catch (error) {
      Logger.error('Error dispatching event:', error);
      throw error;
    }
  }
}
