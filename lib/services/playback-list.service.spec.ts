import { SortDirection } from './../enums/sort-direction';
import { Sort } from './../models/sort';
import { TestBed } from '@angular/core/testing';

import { PlaybackListService } from './playback-list.service';

describe('playbackListService', () => {
  let service: PlaybackListService;
  let mockHttp: any;

  beforeEach(() => {
    mockHttp = jasmine.createSpyObj('http', ['get', 'post']);
    service = new PlaybackListService(mockHttp);
  });

  describe('getPlaybackList', () => {
    it('should call http.get with the proper URL', () => {
      const mockPlaybackListBaseUrl = 'test.com';
      const mockPlaybackListName = 'test_playback_list_name';
      const mockStartIndex = 1;
      const mockLimit = 1000;
      const mockFilters = [];
      const mockSort: Sort = { sortDirection: SortDirection.ASC, field: 'testField' };

      service.getPlaybackList(mockPlaybackListBaseUrl, mockPlaybackListName, mockStartIndex, mockLimit, mockFilters, mockSort);

      const expectedUrl = 'test.com/playback-list/test_playback_list_name?startIndex=1&limit=1000&' +
      'filters=[]&sort={"sortDirection":"ASC","field":"testField"}';

      expect(mockHttp.get).toHaveBeenCalledWith(expectedUrl);
    });
  });

  describe('getPlaybackListCsv', () => {
    it('should call http.get with the proper URL', () => {
      const mockPlaybackListBaseUrl = 'test.com';
      const mockPlaybackListName = 'test_playback_list_name';
      const mockStartIndex = 1;
      const mockLimit = 1000;
      const mockFilters = [];
      const mockSort: Sort = { sortDirection: SortDirection.ASC, field: 'testField' };

      service.getPlaybackListCsv(mockPlaybackListBaseUrl, mockPlaybackListName, mockStartIndex, mockLimit, mockFilters, mockSort);

      const expectedUrl = 'test.com/playback-list/test_playback_list_name/export?startIndex=1&limit=' +
      '1000&filters=[]&sort={"sortDirection":"ASC","field":"testField"}';

      expect(mockHttp.get).toHaveBeenCalledWith(expectedUrl);
    });
  });

});
