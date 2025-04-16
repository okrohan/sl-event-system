import { 
  IEventChannel, 
  ISMSPayload, 
  IEmailPayload, 
  IPushNotificationPayload,
} from '@shared/types/event';

import { twilioSmsClient } from './twilioSmsClient';
import { messageBirdSmsClient } from './messageBirdSmsClient';
import { sendGridEmailClient } from './sendGridEmailClient';
import { mailgunEmailClient } from './mailgunEmailClient';
import { firebasePushClient } from './firebasePushClient';
import { oneSignalPushClient } from './oneSignalPushClient';

// Define a type for the client interface
interface NotificationClient {
  send(payload: any): Promise<boolean>;
}

// Provider to client mapping
const PROVIDER_CLIENTS: Record<string, NotificationClient> = {
  'twilio': twilioSmsClient,
  'messagebird': messageBirdSmsClient,
  'sendgrid': sendGridEmailClient,
  'mailgun': mailgunEmailClient,
  'firebase': firebasePushClient,
  'onesignal': oneSignalPushClient
};

export class DispatcherClient {
  /**
   * Send the payload using the appropriate client
   * @param channel The channel type
   * @param payload The payload to send
   * @param provider The provider to use
   * @returns Promise<boolean> indicating success or failure
   */
  async sendPayload(
    channel: IEventChannel, 
    payload: ISMSPayload | IEmailPayload | IPushNotificationPayload, 
    provider: string
  ): Promise<boolean> {
    // Get the appropriate client for the provider
    const client = PROVIDER_CLIENTS[provider.toLowerCase()];
    
    if (!client) {
      throw new Error(`No client found for provider: ${provider}`);
    }
    
    switch (channel) {
      case IEventChannel.SMS:
        return await client.send(payload as ISMSPayload);
      
      case IEventChannel.EMAIL:
        return await client.send(payload as IEmailPayload);
      
      case IEventChannel.PUSH:
        return await client.send(payload as IPushNotificationPayload);
      
      default:
        throw new Error(`Unsupported channel: ${channel}`);
    }
  }
}

// Export a singleton instance
export const dispatcherClient = new DispatcherClient(); 