import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Filter, Sort, PlaybackListResponse } from '../models';

@Injectable({
  providedIn: 'root',
})
export class PlaybackListService {
  constructor(private http: HttpClient) {}

  getPlaybackList(
    playbackListName: string,
    startIndex: number,
    limit: number,
    filters?: Filter[],
    sort?: Sort
  ): Observable<PlaybackListResponse> {
    let url = `${environment.vehicleHost}/playback-list/${playbackListName}?startIndex=${startIndex}&limit=${limit}`;

    if (filters) {
      url += `&filters=${JSON.stringify(filters)}`;
    }

    if (sort) {
      console.log(sort);
      url += `&sort=${JSON.stringify(sort)}`;
    }

    return this.http.get<PlaybackListResponse>(url);
  }
}
