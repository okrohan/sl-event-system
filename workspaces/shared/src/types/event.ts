export type ISOTimestamp = string;

export interface IFailureLog {
  timestamp: ISOTimestamp;
  provider: IEventProvider;
  error: string;
}

export interface IEvent {
  id: string;
  eventId: string;
  createdAt: ISOTimestamp;
  channel: IEventChannel;
  payload: IEventPayload;
  metadata: IEventMetadata;
  priority: IEventPriority;
  failureLogs: IFailureLog[];
}

export enum IEventPriority {
  DEFAULT = 'default',
  CRITICAL = 'critical',
}

export enum IEventChannel {
  SMS = 'sms',
  EMAIL = 'email',
  PUSH = 'push',
}

export enum IEventProvider {
  TWILIO = 'twilio',
  MESSAGE_BIRD = 'messagebird',
  SENDGRID = 'sendgrid',
  MAILGUN = 'mailgun',
  FIREBASE = 'firebase',
  ONE_SIGNAL = 'onesignal',
}

export type IEventPayload = ISMSPayload | IEmailPayload | IPushNotificationPayload;

export interface ISMSPayload {
  message: string;
  phoneNumber: string;
}

export interface IEmailPayload {
  subject: string;
  body: string;
  to: string;
  from: string;
}

export interface IPushNotificationPayload {
  title: string;
  body: string;
  image: string;
  link: string;
}

export interface IEventMetadata {
  attempt: number;
  totalAttempts: number;
  provider: string; //Service provider name
}
