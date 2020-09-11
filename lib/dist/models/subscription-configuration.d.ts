import { Query } from '.';
export interface SubscriptionConfiguration {
    query: Query;
    playbackScriptName: string;
    streamRevisionFunction?: (item: any) => number;
    condition?: (item: object) => boolean;
    rowIdFunction?: (item: any) => string;
}
