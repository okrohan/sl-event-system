import { IPushNotificationPayload } from '@sl-event-system/shared';

export class FirebasePushClient {
  async send(payload: IPushNotificationPayload): Promise<boolean> {
    console.log(`[Firebase Push] Sending push notification`);
    console.log(`Title: ${payload.title}`);
    console.log(`Body: ${payload.body}`);
    console.log(`Image: ${payload.image}`);
    console.log(`Link: ${payload.link}`);
    //Simulate successful sending
    return true;
  }
}

//Export instance
export const firebasePushClient = new FirebasePushClient();
