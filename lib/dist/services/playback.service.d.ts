import { ScriptService } from './script.service';
import { PushService } from './push.service';
import { StateFunctions, PlaybackList, PlaybackRegistry, Query, ConditionalSubscriptionRegistry } from '../models';
export declare class PlaybackService {
    private scriptService;
    private pushService;
    _playbackRegistry: PlaybackRegistry;
    _conditionalSubscriptionRegistry: ConditionalSubscriptionRegistry;
    constructor(scriptService: ScriptService, pushService: PushService);
    init(socketUrl: string): void;
    unregisterForPlayback(playbackTokens: string[]): Promise<void>;
    registerForPlayback(owner: object, scriptName: string, query: Query, stateFunctions: StateFunctions, playbackList: PlaybackList, streamRevisionFunction?: (item: any) => number, rowId?: string, conditionFunction?: (item: any) => boolean, rowIdFunction?: (item: any) => string): Promise<string>;
    _updateConditionalSubscriptions(rowId: any, rowData: any): void;
}
