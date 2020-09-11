import { StateFunctions } from './state-functions';
import { Query, PlaybackList } from '.';
export interface ConditionalSubscriptionRegistration {
    owner: any;
    playbackList: PlaybackList;
    scriptName: string;
    query: Query;
    stateFunctions: StateFunctions;
    streamRevisionFunction: (item: any) => number;
    conditionFunction: (item: any) => boolean;
    pushSubscriptionId?: string;
    playbackSubscriptionId?: string;
    rowIdFunction?: (item: any) => string;
}
