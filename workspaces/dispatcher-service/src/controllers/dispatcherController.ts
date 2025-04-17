import { DispatcherService } from '../services/dispatcherService';
import {
  Logger,
  IEvent,
} from '@sl-event-system/shared';

export class DispatcherController {
  static async processEvent(event: IEvent) {
    try {
      await DispatcherService.processEvent(event);
      return true;
    } catch (error) {
      Logger.error('Error dispatching event:', error);
      throw error;
    }
  }
}
