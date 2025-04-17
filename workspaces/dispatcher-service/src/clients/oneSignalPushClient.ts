import { IPushNotificationPayload } from '@sl-event-system/shared';

export class OneSignalPushClient {
  async send(payload: IPushNotificationPayload): Promise<boolean> {
    console.log(`[OneSignal Push] Sending push notification`);
    console.log(`Title: ${payload.title}`);
    console.log(`Body: ${payload.body}`);
    console.log(`Image: ${payload.image}`);
    console.log(`Link: ${payload.link}`);
    //Simulate successful sending
    return true;
  }
}

//Export instance
export const oneSignalPushClient = new OneSignalPushClient();
