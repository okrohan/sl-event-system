import { IEvent, IEventChannel } from '@shared/types/event';
import { dispatcherClient } from '../clients';

// Default providers for each channel
const DEFAULT_PROVIDERS = {
  [IEventChannel.SMS]: 'twilio',
  [IEventChannel.EMAIL]: 'sendgrid',
  [IEventChannel.PUSH]: 'firebase'
};

export class DispatcherService {
  /**
   * Process an event and send it to the appropriate provider
   * @param event The event to process
   * @returns Promise<boolean> indicating success or failure
   */
  async processEvent(event: IEvent): Promise<boolean> {
    try {
      // Determine which provider to use
      const provider = event.metadata.provider || DEFAULT_PROVIDERS[event.channel];
      
      // Send the payload using the dispatcher client
      return await dispatcherClient.sendPayload(event.channel, event.payload, provider);
    } catch (error) {
      console.error(`Error processing event ${event.id}:`, error);
      throw error;
    }
  }
}

// Export a singleton instance
export const dispatcherService = new DispatcherService();
