import { IEvent, IEventPriority } from '@shared/types/event';
import { KafkaService, KafkaTopic } from '@shared/kafka';
import { Logger } from '@shared/logger';
export class EventService {
  // Core logic for processing events
  async processEvent(event: IEvent): Promise<void> {
    try {
      // Send event to Kafka
      await KafkaService.sendEventToKafka(event, event.priority === IEventPriority.CRITICAL ? KafkaTopic.CRITICAL : KafkaTopic.DEFAULT);
      Logger.info('Event processed successfully');
    } catch (error) {
     // TODO: Handle Replay L1 Failure
      Logger.error('Error processing event in service layer:', error);
      throw new Error('Error processing event');
    }
  }
}
