import { PushService } from './push.service';
import { StateFunctions, PlaybackList, PlaybackRegistry, Query, ConditionalSubscriptionRegistry, CustomPlaybackConfiguration } from '../models';
import { CustomPlaybackRegistry } from '../models/custom-playback-registry';
export declare class PlaybackService {
    private pushService;
    _playbackRegistry: PlaybackRegistry;
    _conditionalSubscriptionRegistry: ConditionalSubscriptionRegistry;
    _customPlaybackRegistry: CustomPlaybackRegistry;
    constructor(pushService: PushService);
    init(socketUrl: string): void;
    unregisterForPlayback(playbackTokens: string[]): Promise<void>;
    registerForPlayback(owner: object, scriptName: string, query: Query, stateFunctions: StateFunctions, playbackList: PlaybackList, streamRevisionFunction?: (item: any) => number, rowId?: string, conditionFunction?: (item: any) => boolean, rowIdFunction?: (item: any) => string): Promise<string>;
    registerCustomPlaybacks(customPlaybackConfigurations: CustomPlaybackConfiguration[]): void;
    resetCustomPlaybacks(): void;
    _updateConditionalSubscriptions(rowId: any, rowData: any): void;
}
