import { Request, Response } from 'express';
import { EventService } from '../services/eventService';
import {
  Logger,
  IEvent,
  IEventMetadata,
  IEventPayload,
  IEventPriority,
  IEventChannel,
} from '@sl-event-system/shared';

export class EventController {
  static async handleEvent(req: Request, res: Response): Promise<Response> {
    try {
      //Delegate to the service layer
      EventService.processEvent(req.body);
      return res.status(201).json({ message: 'Event Ingested' });
    } catch (error) {
      Logger.error('Error processing event:', error);
      return res.status(500).json({ error: 'Failed to send event' });
    }
  }
}
