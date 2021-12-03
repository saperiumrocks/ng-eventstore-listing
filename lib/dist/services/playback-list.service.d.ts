import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Filter, Sort, PlaybackListResponse } from '../models';
import * as ɵngcc0 from '@angular/core';
export declare class PlaybackListService {
    private http;
    constructor(http: HttpClient);
    getPlaybackList(playbackListBaseUrl: string, playbackListName: string, startIndex: number, limit: number, filters?: Filter[], sort?: Sort[], previousKey?: string, nextKey?: string): Observable<PlaybackListResponse>;
    getPlaybackListCsv(playbackListBaseUrl: string, playbackListName: string, startIndex: number, limit: number, filters?: Filter[], sort?: Sort[], type?: string): Observable<any>;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<PlaybackListService, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDef<PlaybackListService>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheWJhY2stbGlzdC5zZXJ2aWNlLmQudHMiLCJzb3VyY2VzIjpbInBsYXliYWNrLWxpc3Quc2VydmljZS5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBGaWx0ZXIsIFNvcnQsIFBsYXliYWNrTGlzdFJlc3BvbnNlIH0gZnJvbSAnLi4vbW9kZWxzJztcbmV4cG9ydCBkZWNsYXJlIGNsYXNzIFBsYXliYWNrTGlzdFNlcnZpY2Uge1xuICAgIHByaXZhdGUgaHR0cDtcbiAgICBjb25zdHJ1Y3RvcihodHRwOiBIdHRwQ2xpZW50KTtcbiAgICBnZXRQbGF5YmFja0xpc3QocGxheWJhY2tMaXN0QmFzZVVybDogc3RyaW5nLCBwbGF5YmFja0xpc3ROYW1lOiBzdHJpbmcsIHN0YXJ0SW5kZXg6IG51bWJlciwgbGltaXQ6IG51bWJlciwgZmlsdGVycz86IEZpbHRlcltdLCBzb3J0PzogU29ydFtdLCBwcmV2aW91c0tleT86IHN0cmluZywgbmV4dEtleT86IHN0cmluZyk6IE9ic2VydmFibGU8UGxheWJhY2tMaXN0UmVzcG9uc2U+O1xuICAgIGdldFBsYXliYWNrTGlzdENzdihwbGF5YmFja0xpc3RCYXNlVXJsOiBzdHJpbmcsIHBsYXliYWNrTGlzdE5hbWU6IHN0cmluZywgc3RhcnRJbmRleDogbnVtYmVyLCBsaW1pdDogbnVtYmVyLCBmaWx0ZXJzPzogRmlsdGVyW10sIHNvcnQ/OiBTb3J0W10sIHR5cGU/OiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT47XG59XG4iXX0=