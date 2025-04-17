import { IEmailPayload } from '@sl-event-system/shared';

export class MailgunEmailClient {
  async send(payload: IEmailPayload): Promise<boolean> {
    console.log(`[Mailgun Email] Sending email from ${payload.from} to ${payload.to}`);
    console.log(`Subject: ${payload.subject}`);
    console.log(`Body: ${payload.body}`);
    // UNCOMMENT FOR FAILURE
    // throw new Error('Failed to send email');
    return true;
  }
}

//Export instance
export const mailgunEmailClient = new MailgunEmailClient();
