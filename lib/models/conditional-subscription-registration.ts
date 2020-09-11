import { StateFunctions } from './state-functions';
import { Query, PlaybackList } from '.';
export interface ConditionalSubscriptionRegistration {
  owner: any;
  playbackList: PlaybackList;
  scriptName: string;
  query: Query;
  stateFunctions: StateFunctions;
  streamRevisionFunction: (item) => number;
  conditionFunction: (item) => boolean;
  pushSubscriptionId?: string;
  playbackSubscriptionId?: string;
  rowIdFunction?: (item: any) => string;
}
