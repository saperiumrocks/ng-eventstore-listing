import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Filter, Sort, PlaybackListResponse } from '../models';
export declare class PlaybackListService {
    private http;
    constructor(http: HttpClient);
    getPlaybackList(playbackListBaseUrl: string, playbackListName: string, startIndex: number, limit: number, filters?: Filter[], sort?: Sort): Observable<PlaybackListResponse>;
    getPlaybackListCsv(playbackListBaseUrl: string, playbackListName: string, startIndex: number, limit: number, filters?: Filter[], sort?: Sort): Observable<any>;
}
