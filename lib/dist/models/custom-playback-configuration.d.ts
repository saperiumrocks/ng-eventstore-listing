import { Event } from '.';
export interface CustomPlaybackConfiguration {
    eventName: string;
    playbackFunction: (event: Event) => void;
}
