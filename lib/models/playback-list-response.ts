import { RowItem } from './row-item';

export interface PlaybackListResponse {
  count: number;
  rows: RowItem[];
  previousKey?: string;
  nextKey?: string;
}
