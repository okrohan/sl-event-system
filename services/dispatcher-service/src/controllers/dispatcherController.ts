import { Request, Response } from 'express';
import { Logger } from '@shared/logger';
import { IEvent } from '@shared/types/event';
import { dispatcherService } from '../services/dispatcherServices';

export class DispatcherController {

  static async processEvent(event: IEvent): Promise<boolean> {
    try {
      Logger.info(`Processing event ${event.id}`);
      return await dispatcherService.processEvent(event);
    } catch (error) {
      Logger.error(`Error processing event ${event.id}`);
      throw error;
    }
  }
} 