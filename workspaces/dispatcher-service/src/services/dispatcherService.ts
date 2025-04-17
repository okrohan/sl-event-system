import {
  IEvent,
  IEventStatus,
  mutateEventFailure,
  sendEventToKafkaWithDeadLetter,
  KafkaTopic,
} from '@sl-event-system/shared';
import { dispatcherClient } from '../clients';
import { updateDBEntryForEvent } from '@sl-event-system/shared';

export class DispatcherService {
  static async processEvent(event: IEvent): Promise<boolean> {
    try {
      //Determine which provider to use
      await updateDBEntryForEvent(event, IEventStatus.PROCESSING);
      const provider = event.metadata.provider;

      //Send the payload using the dispatcher client
      await dispatcherClient.sendPayload(event.payload, provider as string);
      await updateDBEntryForEvent(event, IEventStatus.COMPLETED);
      return true;
    } catch (error) {
      mutateEventFailure(event, error);
      sendEventToKafkaWithDeadLetter(event, KafkaTopic.RETRY);
      throw error;
    }
  }
}
