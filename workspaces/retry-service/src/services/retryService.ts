import {
  IEvent,
  IEventStatus,
  KafkaTopic,
  
  IEventPriority,
  
  fetchEventFromDB,
  IEventDocument,
  IEventChannel,
  mutateEventRetryCount,
  sendEventToKafkaWithDeadLetter,
  mutateEventFailure,
  DEFAULT_PROVIDERS,
  Logger,
} from '@sl-event-system/shared';
import { updateDBEntryForEvent } from '@sl-event-system/shared';
import { getRetryBackoff } from '../utils/retryUtils';

export class RetryService {
  static async processEvent(event: IEvent): Promise<boolean> {
    const eventToRetry: IEvent = event;
    try {
      const retryResponse = getRetryBackoff(event, event.metadata.attempt);
      if (retryResponse) {
        mutateEventRetryCount(eventToRetry);
        eventToRetry.metadata.provider = retryResponse.provider;
        await updateDBEntryForEvent(eventToRetry, IEventStatus.RETRYING);
        setTimeout(() => {
          sendEventToKafkaWithDeadLetter(
            eventToRetry,
            event.priority === IEventPriority.CRITICAL ? KafkaTopic.CRITICAL : KafkaTopic.DEFAULT
          );
        }, retryResponse.backoff);
      } else {
        throw new Error('Dead letter event');
      }

      return true;
    } catch (error) {
      mutateEventFailure(event, error);
      await updateDBEntryForEvent(event, IEventStatus.DEAD_LETTERED);
      throw error;
    }
  }

  static async replayEventsByStatus(
    status: IEventStatus,
    limit: number,
    from: number
  ): Promise<number> {
    try {
      const events = await fetchEventFromDB(status, limit, from);
      const promises = [];
      for (const event of events) {
        const eventDoc = event.toJSON() as IEventDocument;
        const eventItem: IEvent = {
          id: eventDoc.id,
          eventId: eventDoc.eventId,
          createdAt: eventDoc.createdAt.toISOString(),
          channel: eventDoc.channel as unknown as IEventChannel,
          payload: eventDoc.payload,
          metadata: {
            attempt: 0,
            totalAttempts: eventDoc.retryCount,
            provider: DEFAULT_PROVIDERS[eventDoc.channel as never],
          },
          failureLogs: eventDoc.failureLogs,
          priority: eventDoc.priority as unknown as IEventPriority,
        };

        promises.push(RetryService.processEvent(eventItem));
      }

      await Promise.all(promises);
      return events.length;
    } catch (error) {
      Logger.error('Error replaying events by status:', error);
      throw error;
    }
  }
}
