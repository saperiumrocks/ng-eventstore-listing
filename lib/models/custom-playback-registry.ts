import { CustomPlaybackConfiguration } from '.';

export interface CustomPlaybackRegistry {
  [key: string]: CustomPlaybackConfiguration[];
}
