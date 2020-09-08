import { Query } from '.';
export interface SubscriptionConfiguration {
    query: Query;
    playbackScriptName: string;
    rowIdFieldName?: string;
    streamRevisionFunction?: (item: any) => number;
    condition?: (item: object) => boolean;
}
