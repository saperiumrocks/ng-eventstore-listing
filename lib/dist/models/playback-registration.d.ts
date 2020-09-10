import { PlaybackList } from '.';
export interface PlaybackRegistration {
    owner: object;
    pushSubscriptionId: string;
    playbackList: PlaybackList;
    scriptName?: string;
    rowId: string;
}
