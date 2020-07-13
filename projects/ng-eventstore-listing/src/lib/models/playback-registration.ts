import { PlaybackList } from '.';

export interface PlaybackRegistration {
  playbackScript: any;
  owner: Object;
  registrationId: string;
  playbackList: PlaybackList;
}
