import {
  IEvent,
  IEventChannel,
  IEmailPayload,
  ISMSPayload,
  IPushNotificationPayload,
} from '@sl-event-system/shared';

import { twilioSmsClient } from './twilioSmsClient';
import { messageBirdSmsClient } from './messageBirdSmsClient';
import { sendGridEmailClient } from './sendGridEmailClient';
import { mailgunEmailClient } from './mailgunEmailClient';
import { firebasePushClient } from './firebasePushClient';
import { oneSignalPushClient } from './oneSignalPushClient';

interface NotificationClient {
  //eslint-disable-next-line 
  send(_payload: never): Promise<boolean>;
}

const PROVIDER_CLIENTS: Record<string, NotificationClient> = {
  twilio: twilioSmsClient,
  messagebird: messageBirdSmsClient,
  sendgrid: sendGridEmailClient,
  mailgun: mailgunEmailClient,
  firebase: firebasePushClient,
  onesignal: oneSignalPushClient,
};

export class DispatcherClient {
  async sendPayload(
    payload: ISMSPayload | IEmailPayload | IPushNotificationPayload,
    provider: string
  ): Promise<boolean> {
    const client = PROVIDER_CLIENTS[provider.toLowerCase()];

    if (!client) {
      throw new Error(`No client found for provider: ${provider}`);
    }

    return await client.send(payload as never);
  }
}

//Export a singleton instance
export const dispatcherClient = new DispatcherClient();
