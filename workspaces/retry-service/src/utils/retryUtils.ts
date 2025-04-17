import { IEvent } from '@sl-event-system/shared';

//Define supported channels
export type Channel = 'push' | 'sms' | 'email';

//Define supported providers
export type Provider = 'firebase' | 'onesignal' | 'twilio' | 'messagebird' | 'sendgrid' | 'mailgun';

interface IRetryConfig {
  channel: Channel;
  provider: Provider;
  totalMaxRetries: number;
  alternate: Provider | null;
  backoff: number;
}

interface IRetryResponse {
  provider: Provider;
  backoff: number;
}

const PROVIDER_RETRY_RULES: IRetryConfig[] = [
  //Push Notification Providers
  {
    channel: 'push',
    provider: 'firebase',
    totalMaxRetries: 2,
    alternate: 'onesignal',
    backoff: 2000,
  },
  {
    channel: 'push',
    provider: 'onesignal',
    totalMaxRetries: 3,
    alternate: null,
    backoff: 3000,
  },

  //SMS Providers
  {
    channel: 'sms',
    provider: 'twilio',
    totalMaxRetries: 3,
    alternate: 'messagebird',
    backoff: 1000,
  },
  {
    channel: 'sms',
    provider: 'messagebird',
    totalMaxRetries: 2,
    alternate: null,
    backoff: 2000,
  },

  //Email Providers
  {
    channel: 'email',
    provider: 'sendgrid',
    totalMaxRetries: 3,
    alternate: 'mailgun',
    backoff: 1500,
  },
  {
    channel: 'email',
    provider: 'mailgun',
    totalMaxRetries: 5,
    alternate: null,
    backoff: 5000,
  },
];

/**
 * Get retry configuration for a given event and retry count
 * @param event The event containing provider information
 * @param retryCount Current retry attempt count
 * @returns IRetryResponse containing next provider to try and backoff time
 */
export function getRetryBackoff(event: IEvent, retryCount: number): IRetryResponse | null {
  const currentProvider = event.metadata.provider as Provider;
  const providerConfig = PROVIDER_RETRY_RULES.find(rule => rule.provider === currentProvider);

  if (!providerConfig) {
    return null;
  }

  //If retry count exceeds max retries, check for alternate provider
  if (retryCount >= providerConfig.totalMaxRetries) {
    if (providerConfig.alternate) {
      return getRetryBackoff(
        { ...event, metadata: { ...event.metadata, provider: providerConfig.alternate } },
        retryCount
      );
    }
    //No alternate provider or alternate config not found
    return null;
  }

  //Return current provider config
  return {
    provider: providerConfig.provider,
    backoff: providerConfig.backoff,
  };
}

/**
 * Check if a provider has an alternate fallback
 * @param provider Current provider
 * @returns boolean indicating if provider has fallback
 */
export function hasAlternateProvider(provider: Provider): boolean {
  const config = PROVIDER_RETRY_RULES.find(rule => rule.provider === provider);
  return config?.alternate !== null;
}

/**
 * Get maximum retry attempts for a provider including its fallback chain
 * @param provider Initial provider
 * @returns Total number of retry attempts possible
 */
export function getMaxRetryAttempts(provider: Provider): number {
  let totalRetries = 0;
  let currentProvider = provider;

  while (currentProvider) {
    const config = PROVIDER_RETRY_RULES.find(rule => rule.provider === currentProvider);
    if (!config) break;

    totalRetries += config.totalMaxRetries;
    currentProvider = config.alternate as Provider;
  }

  return totalRetries;
}
