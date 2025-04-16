import { IEmailPayload } from '@shared/types/event';

export class SendGridEmailClient {
  async send(payload: IEmailPayload): Promise<boolean> {
    console.log(`[SendGrid Email] Sending email from ${payload.from} to ${payload.to}`);
    console.log(`Subject: ${payload.subject}`);
    console.log(`Body: ${payload.body}`);
    // Simulate successful sending
    return true;
  }
}

// Export instance
export const sendGridEmailClient = new SendGridEmailClient(); 