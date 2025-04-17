import {
  Logger,
  IEvent,
  IEventPriority,

  KafkaTopic,
  IEventChannel,
  IEventMetadata,
  IEventPayload,
  IEventStatus,
  updateDBEntryForEvent,
  DEFAULT_PROVIDERS,

  sendEventToKafkaWithDeadLetter,
} from '@sl-event-system/shared';
import { v4 as uuidv4 } from 'uuid';

export interface IEventBody {
  eventId: string;
  channel: string;
  payload: IEventPayload;
  metadata: IEventMetadata;
  priority: IEventPriority;
  provider?: string;
}

export class EventService {
  static async processEvent(eventData: IEventBody): Promise<void> {
    const { channel, payload, priority, eventId, provider } = eventData;

    const id = uuidv4();
    const metaProvider = provider || DEFAULT_PROVIDERS[channel as never] || 'err';

    const event: IEvent = {
      id: id,
      eventId: eventId || id,
      createdAt: new Date().toISOString(),
      channel: channel as IEventChannel,
      payload,
      metadata: {
        attempt: 0,
        totalAttempts: 0,
        provider: metaProvider,
      },
      priority,
      failureLogs: [],
    };

    try {
      //Validate event
      if (!channel || !payload) {
        throw new Error('Invalid event format');
      }

      await updateDBEntryForEvent(event, IEventStatus.SCHEDULED);
      await sendEventToKafkaWithDeadLetter(
        event,
        event.priority === IEventPriority.CRITICAL ? KafkaTopic.CRITICAL : KafkaTopic.DEFAULT
      );

      Logger.info(`Event ${event.id} processed successfully`);
    } catch (error) {
      Logger.error('Error in processEvent:', error);
      throw error;
    }
  }
}
