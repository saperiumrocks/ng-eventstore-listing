import { PlaybackRegistration } from '.';

export interface PlaybackRegistry {
  [key: string]: PlaybackRegistration;
}
