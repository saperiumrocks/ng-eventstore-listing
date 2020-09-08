import { Query } from '.';

export interface SubscriptionConfiguration {
  query: Query;
  playbackScriptName: string;
  rowIdFieldName?: string;
  streamRevisionFunction?: (item) => number;
  condition?: (item: object) => boolean;
}
