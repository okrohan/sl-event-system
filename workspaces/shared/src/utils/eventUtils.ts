import { IEvent, IFailureLog, IEventProvider } from '../types/event';
import { EventModel, IEventStatus, IEventDocument } from '../models/Event';
import { Logger } from '../logger';
import { KafkaService } from '../kafka';

export async function updateDBEntryForEvent(
  event: IEvent,
  status: IEventStatus
): Promise<IEventDocument> {
  try {
    const eventDoc = await EventModel.findOneAndUpdate(
      { id: event.id },
      {
        id: event.id,
        eventId: event.eventId,
        channel: event.channel,
        provider: event.metadata.provider,
        payload: event.payload,
        status,
        retryCount: event.metadata?.attempt || 0,
        totalRetryAttempts: event.metadata?.totalAttempts || 0,
        failureLogs: event.failureLogs,
        priority: event.priority,
      } as unknown as IEventDocument,
      {
        upsert: true,
        new: true,
      }
    );

    Logger.info(`Event ${event.id} updated in database with status: ${status}`);
    return eventDoc;
  } catch (error) {
    Logger.error(`Failed to update event ${event.id} in database:`, error);
    throw error;
  }
}

export function fetchEventFromDB(
  status: IEventStatus,
  limit: number,
  from: number
): Promise<IEventDocument[]> {
  return EventModel.find({ status }).skip(from).limit(limit);
}

export function mutateEventFailureLogs(event: IEvent, failureLog: IFailureLog): IEvent {
  const failureLogs = [...(event.failureLogs || []), failureLog];
  event.failureLogs = failureLogs;
  return event;
}

export function mutateEventRetryCount(event: IEvent): IEvent {
  event.metadata.attempt = event.metadata.attempt + 1;
  event.metadata.totalAttempts = event.metadata.totalAttempts + 1;
  return event;
}

/**
 * Handle event failure by updating failure logs and setting status to DEAD_LETTERED
 * @param event The event that failed
 * @param error The error that occurred
 * @returns Promise<IEventDocument> The updated event document
 */
export async function mutateEventFailure(event: IEvent, error: unknown): Promise<IEventDocument> {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
  console.error(`Error processing event ${event.id}:`, error);

  return await updateDBEntryForEvent(
    mutateEventFailureLogs(event, {
      timestamp: new Date().toISOString(),
      provider: event.metadata.provider as unknown as IEventProvider,
      error: errorMessage,
    }),
    IEventStatus.FAILED
  );
}

/**
 * Send event to Kafka with error handling
 * @param event The event to send
 * @param topic The Kafka topic to send to
 * @returns Promise<void>
 */
export async function sendEventToKafkaWithDeadLetter(event: IEvent, topic: string): Promise<void> {
  try {
    await KafkaService.sendEventToKafka(event, topic);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(`Error sending event to Kafka:`, error);
    mutateEventFailureLogs(event, {
      timestamp: new Date().toISOString(),
      provider: event.metadata.provider as unknown as IEventProvider,
      error: errorMessage,
    });

    updateDBEntryForEvent(event, IEventStatus.DEAD_LETTERED);
    throw error;
  }
}
