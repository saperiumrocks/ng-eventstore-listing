import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Filter, Sort, PlaybackListResponse } from '../models';

@Injectable()
export class PlaybackListService {
  constructor(private http: HttpClient) {}

  getPlaybackList(
    playbackListBaseUrl: string,
    playbackListName: string,
    startIndex: number,
    limit: number,
    filters?: Filter[],
    sort?: Sort[]
  ): Observable<PlaybackListResponse> {
    let url = `${playbackListBaseUrl}/playback-list/${playbackListName}?startIndex=${startIndex}&limit=${limit}`;

    if (filters) {
      url += `&filters=${encodeURIComponent(JSON.stringify(filters))}`;
    }

    if (sort) {
      url += `&sort=${JSON.stringify(sort)}`;
    }

    return this.http.get<PlaybackListResponse>(url);
  }

  getPlaybackListCsv(
    playbackListBaseUrl: string,
    playbackListName: string,
    startIndex: number,
    limit: number,
    filters?: Filter[],
    sort?: Sort[],
    type?: string
  ): Observable<any> {
    let url = `${playbackListBaseUrl}/playback-list/${playbackListName}/export?startIndex=${startIndex}&limit=${limit}`;

    if (filters) {
      url += `&filters=${JSON.stringify(filters)}`;
    }

    if (sort) {
      url += `&sort=${JSON.stringify(sort)}`;
    }

    if (type) {
      url += `&type=${type}`;
    }
    return this.http.get<PlaybackListResponse>(url);
  }
}
