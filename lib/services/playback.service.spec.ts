import { StateFunctions } from './../models/state-functions';
import { Query } from './../models/query';
import _isEmpty from 'lodash-es/isEmpty';
// import { SortDirection } from '../enums/sort-direction';
// import { Sort } from '../models/sort';

import { PlaybackService } from './playback.service';

describe('playbackService', () => {
  let service: PlaybackService;
  let mockScriptService: any;
  let mockPushService: any;

  beforeEach(() => {
    // mockHttp = jasmine.createSpyObj('http', ['get', 'post']);
    mockScriptService = jasmine.createSpyObj('scriptService', ['getScript']);
    mockPushService = jasmine.createSpyObj('pushService', ['subscribe', 'unsubscribe']);

    mockScriptService.getScript.and.returnValue({ });
    mockPushService.subscribe.and.returnValue('test-sub-id');
    mockPushService.unsubscribe.and.returnValue(Promise.resolve());

    service = new PlaybackService(mockScriptService, mockPushService);
  });

  describe('registerForPlayback', () => {
    it('should add new entry to playbackRegistry - base configuration', async () => {

      const mockOwner = service;
      const mockScriptName = 'test-script-name';
      const mockQuery: Query = { context: 'vehicle', aggregate: 'vehicle', aggregateId: 'vehicle-1' };
      const mockStateFunctions: StateFunctions = { getState: () => {}, setState: () => {} };
      const mockPlaybackList = jasmine.createSpyObj('playbackList', ['get', 'update', 'delete']);
      const mockStreamRevisionFunction = () => 0;

      await service.registerForPlayback(mockOwner, mockScriptName, mockQuery,
        mockStateFunctions, mockPlaybackList, mockStreamRevisionFunction);

      const key = Object.keys(service._playbackRegistry)[0];
      const playbackRegistration = service._playbackRegistry[key];

      expect(playbackRegistration.rowId).toEqual(undefined);
      expect(playbackRegistration.scriptName).toEqual(mockScriptName);
      expect(playbackRegistration.playbackList).toEqual(mockPlaybackList);
      expect(playbackRegistration.owner).toEqual(service);
      expect(playbackRegistration.registrationId).toEqual('test-sub-id');
    });
  });

  describe('unregisterForPlayback', () => {
    it('should call pushService.unsubscribe', async () => {
      const mockTokens = ['test-1', 'test-2'];
      await service.unregisterForPlayback(mockTokens);
      expect(mockPushService.unsubscribe).toHaveBeenCalledWith(mockTokens);
    });

    it('should call delete all tokens for unsubscription in registry', async () => {
      const mockTokens = ['test-1', 'test-2'];
      service._playbackRegistry = {
        'test-1': {
          rowId: '',
          registrationId: '',
          playbackScript: '',
          playbackList: null,
          owner: null
        },
        'test-2': {
          rowId: '',
          registrationId: '',
          playbackScript: '',
          playbackList: null,
          owner: null
        }
      };
      await service.unregisterForPlayback(mockTokens);
      expect(_isEmpty(service._playbackRegistry)).toBeTruthy();
    });
  });
});
