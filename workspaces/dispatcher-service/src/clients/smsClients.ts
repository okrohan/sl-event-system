import { ISMSPayload } from '@sl-event-system/shared';

//SMS Clients
export class TwilioSMSClient {
  async send(payload: ISMSPayload): Promise<boolean> {
    console.log(`[Twilio SMS] Sending SMS to ${payload.phoneNumber}: ${payload.message}`);
    //Simulate successful sending
    return true;
  }
}

export class MessageBirdSMSClient {
  async send(payload: ISMSPayload): Promise<boolean> {
    console.log(`[MessageBird SMS] Sending SMS to ${payload.phoneNumber}: ${payload.message}`);
    //Simulate successful sending
    return true;
  }
}

//Export instances
export const twilioSMSClient = new TwilioSMSClient();
export const messageBirdSMSClient = new MessageBirdSMSClient();
