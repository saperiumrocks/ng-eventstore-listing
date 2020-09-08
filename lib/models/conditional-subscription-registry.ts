import { ConditionalSubscriptionRegistration } from '.';

export interface ConditionalSubscriptionRegistry {
  [key: string]: ConditionalSubscriptionRegistration[];
}
