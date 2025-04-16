import { IEmailPayload } from '@shared/types/event';

export class MailgunEmailClient {
  async send(payload: IEmailPayload): Promise<boolean> {
    console.log(`[Mailgun Email] Sending email from ${payload.from} to ${payload.to}`);
    console.log(`Subject: ${payload.subject}`);
    console.log(`Body: ${payload.body}`);
    // Simulate successful sending
    return true;
  }
}

// Export instance
export const mailgunEmailClient = new MailgunEmailClient(); 