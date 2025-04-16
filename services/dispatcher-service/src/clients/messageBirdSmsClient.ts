import { ISMSPayload } from '@shared/types/event';

export class MessageBirdSmsClient {
  async send(payload: ISMSPayload): Promise<boolean> {
    console.log(`[MessageBird SMS] Sending SMS to ${payload.phoneNumber}: ${payload.message}`);
    // Simulate successful sending
    return true;
  }
}

// Export instance
export const messageBirdSmsClient = new MessageBirdSmsClient(); 