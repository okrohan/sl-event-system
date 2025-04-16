import { Request, Response } from 'express';

import { EventService } from '../services/eventService';
import { Logger } from '@shared/logger';
import { IEventMetadata, IEvent, ISMSPayload, IEventPayload, IEventPriority, IEventChannel } from '@shared/types/event';
import { v4 as uuidv4 } from 'uuid';


const eventService = new EventService();

interface IEventBody {
    channel: string;
    payload: IEventPayload
    metadata: IEventMetadata;
    priority: IEventPriority;
}

export class EventController {
  static async handleEvent(req: Request, res: Response): Promise<Response> {
    const { channel, priority, payload } = req.body as IEventBody;

    if(!channel || !priority || !payload) {
        return res.status(400).json({ error: 'Invalid Payload' });
    }
    try {
        const eventBody:IEvent = {
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            channel: channel as IEventChannel,
            payload,   
            metadata: {attempt: 0 },
            priority,
        }
      // Delegate to the service layer
      await eventService.processEvent(eventBody);
      return res.status(200).json({ message: 'Event ingested successfully', eventBody });
    } catch (error) {
      Logger.error('Error processing event:', error);
      return res.status(500).json({ error: 'Failed to send event' });
    }
  }
}
