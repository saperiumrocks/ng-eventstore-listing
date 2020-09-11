import { Query } from '.';

export interface SubscriptionConfiguration {
  query: Query;
  playbackScriptName: string;
  streamRevisionFunction?: (item) => number;
  condition?: (item: object) => boolean;
  rowIdFunction?: (item: any) => string;
}
