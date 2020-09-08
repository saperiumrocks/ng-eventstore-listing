import { PlaybackList } from '.';

export interface PlaybackRegistration {
  playbackScript: any;
  owner: object;
  registrationId: string;
  playbackList: PlaybackList;
  scriptName?: string;
  rowId: string;
  // conditionFunction?: Function;
  // streamRevisionFunction?: Function;
}
