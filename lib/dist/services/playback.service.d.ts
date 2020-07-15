import { ScriptService } from './script.service';
import { PushService } from './push.service';
import { StateFunctions, PlaybackList, Query } from '../models';
export declare class PlaybackService {
    private scriptService;
    private pushService;
    private playbackRegistry;
    constructor(scriptService: ScriptService, pushService: PushService);
    init(socketUrl: string): void;
    unRegisterForPlayback(token: any): Promise<void>;
    registerForPlayback(scriptName: string, owner: object, query: Query, stateFunctions: StateFunctions, offset?: number, playbackList?: PlaybackList): Promise<string>;
}
