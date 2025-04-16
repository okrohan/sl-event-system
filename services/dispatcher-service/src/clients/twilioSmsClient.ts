import { ISMSPayload } from '@shared/types/event';

export class TwilioSmsClient {
  async send(payload: ISMSPayload): Promise<boolean> {
    console.log(`[Twilio SMS] Sending SMS to ${payload.phoneNumber}: ${payload.message}`);
    // Simulate successful sending
    return true;
  }
}

// Export instance
export const twilioSmsClient = new TwilioSmsClient(); 