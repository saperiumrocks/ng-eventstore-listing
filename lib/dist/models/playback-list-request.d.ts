import { Filter } from './filter';
import { Sort } from './sort';
export interface PlaybackListRequest {
    playbackListName: string;
    startIndex: number;
    limit: number;
    filters?: Filter[];
    sort?: Sort;
}
