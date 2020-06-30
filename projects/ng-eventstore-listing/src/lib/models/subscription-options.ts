export interface SubscriptionOptions {
  // stream name
  streamId?: string;
  // query
  context?: string;
  aggregate?: string;

  offset: number;
}
