import { Query } from '../services/playback.service';
import { StateFunctions } from './state-functions';

export interface SubscriptionConfiguration {
  query: Query;
  playbackScriptName: string;
  stateFunctions: StateFunctions;
}
