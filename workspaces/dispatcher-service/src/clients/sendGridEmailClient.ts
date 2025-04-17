import { IEmailPayload } from '@sl-event-system/shared';

export class SendGridEmailClient {
  async send(payload: IEmailPayload): Promise<boolean> {
    console.log(`[SendGrid Email] Sending email from ${payload.from} to ${payload.to}`);
    console.log(`Subject: ${payload.subject}`);
    console.log(`Body: ${payload.body}`);
    // UNCOMMEND FOR FAILURE
    // throw new Error('Failed to send email');
    return true;
  }
}

//Export instance
export const sendGridEmailClient = new SendGridEmailClient();
