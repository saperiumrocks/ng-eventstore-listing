import { ScriptService } from './script.service';
import { PushService } from './push.service';
import { StateFunctions, PlaybackList, Query } from '../models';
export declare class PlaybackService {
    private scriptService;
    private pushService;
    private playbackRegistry;
    private conditionalSubscriptionRegistry;
    constructor(scriptService: ScriptService, pushService: PushService);
    init(socketUrl: string): void;
    unRegisterForPlayback(tokens: string[]): Promise<void>;
    registerForPlayback(owner: object, scriptName: string, query: Query, stateFunctions: StateFunctions, playbackList: PlaybackList, streamRevisionFunction?: (item: any) => number, rowId?: string, conditionFunction?: (item: any) => boolean): Promise<string>;
    registerConditionalSubscriptions(conditionFunction: (item: any) => boolean, scriptName: string, owner: object, query: Query, stateFunctions: StateFunctions, playbackList: PlaybackList, rowId?: string, streamRevisionFunction?: (item: any) => number, subscriptionToken?: string): Promise<void>;
    _updateConditionalSubscriptions(rowId: any, rowData: any): void;
}
