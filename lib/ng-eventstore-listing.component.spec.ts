import { NgEventstoreListingComponent } from './ng-eventstore-listing.component';
import * as Immutable from 'immutable';
import { RowItem } from './models';
import { SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { FilterOperator, SortDirection } from './enums';
import { c } from '@angular/core/src/render3';

const MOCK_DATA_LIST: RowItem[] = [
  { rowId: 'test-1', revision: 0, data: { testProp1: 1 }, meta: {} },
  { rowId: 'test-2', revision: 0, data: { testProp1: 3 }, meta: {} },
  { rowId: 'test-3', revision: 0, data: { testProp1: 5 }, meta: {} },
  { rowId: 'test-4', revision: 0, data: { testProp1: 7 }, meta: {} },
];

describe('NgEventstoreListingComponent', () => {
  let component: NgEventstoreListingComponent;
  let mockChangeDetectorRef;
  let mockScriptService;
  let mockPlaybackService;
  let mockPlaybackListService;
  let mockJquery;
  let $;

  beforeEach(() => {
    mockChangeDetectorRef = jasmine.createSpyObj('mockChangeDetectorRef', [
      'markForCheck',
      'detectChanges',
    ]);
    mockScriptService = jasmine.createSpyObj('mockScriptService', ['init']);
    mockPlaybackService = jasmine.createSpyObj('mockPlaybackService', [
      'registerForPlayback',
      'unregisterForPlayback',
      'resetCustomPlaybacks'
    ]);
    mockPlaybackListService = jasmine.createSpyObj('mockPlaybackListService', [
      '_getPlaybackList',
    ]);
    mockJquery = jasmine.createSpyObj('mockJquery', ['modal', 'on', 'is', 'css', 'contents']);
    $ = (name) => {
      return mockJquery;
    };
    component = new NgEventstoreListingComponent(
      $,
      mockChangeDetectorRef,
      mockScriptService,
      mockPlaybackService,
      mockPlaybackListService
    );
  });

  describe('playbackList functions initialization', () => {
    beforeEach(() => {
      component._dataList = Immutable.fromJS(MOCK_DATA_LIST);
    });

    it('should define get properly', (done) => {
      const rowId = 'test-2';
      component._playbackList.get(rowId, (err, item) => {
        expect(item).toEqual((component._dataList.get(1) as any).toJS());
        done();
      });
    });

    it('should define add properly', (done) => {
      const rowId = 'test-5';
      const revision = 0;
      const data = { testProp: 9 };
      const meta = { testMeta: 123 };
      spyOn(component.newItemNotifyEmitter, 'emit');
      component._playbackList.add(rowId, revision, data, meta, (err) => {
        const newEntry = {
          rowId: rowId,
          revision: revision,
          data: data,
          meta: meta,
        };
        // expect(Immutable.fromJS(newEntry)).toEqual(component.dataList.last());
        expect(component.newItemNotifyEmitter.emit).toHaveBeenCalledWith(newEntry);
        done();
      });
    });

    it('should define update properly', (done) => {
      const rowId = 'test-3';
      const revision = 0;
      const oldData = { testProp1: 8, testProp2: 123 };
      const newData = { testProp1: 9 };
      const meta = { testMeta: 123 };
      component._playbackList.update(
        rowId,
        revision,
        oldData,
        newData,
        meta,
        (err) => {
          const newEntry = {
            rowId: rowId,
            revision: revision,
            data: { testProp1: 9, testProp2: 123 },
            meta: meta,
          };
          expect(Immutable.fromJS(newEntry)).toEqual(component._dataList.get(2));
          done();
        }
      );
    });

    it('should define delete properly', (done) => {
      const rowId = 'test-3';
      spyOn(component.removedItemNotifyEmitter, 'emit');
      component._playbackList.delete(rowId, (err) => {
        // expect(
        //   component._dataList.findIndex((item: any) => {
        //     return item.get('rowId') === rowId;
        //   })
        // ).toEqual(-1);
        expect(component.removedItemNotifyEmitter.emit).toHaveBeenCalledWith(rowId);
        done();
      });
    });
  });

  describe('stateFunctions initialization', () => {
    beforeEach(() => {
      component._dataList = Immutable.fromJS(MOCK_DATA_LIST);
    });

    it('should define getState properly', () => {
      const rowId = 'test-2';

      const state = component._stateFunctions.getState(rowId);
      expect(state).toEqual((component._dataList.get(1) as any).toJS());
    });

    it('should define setState properly', () => {
      const rowId = 'test-2';
      const row = {
        rowId: rowId,
        revision: 1,
        data: {
          testProp1: 1,
          testProp2: 2,
        },
        meta: {},
      };

      component._stateFunctions.setState(rowId, row);
      expect(row).toEqual((component._dataList.get(1) as any).toJS());
      expect(mockChangeDetectorRef.markForCheck).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should call resetSubscriptions', () => {
      spyOn(component, '_resetSubscriptions');
      component._initialized = true;

      component.ngOnDestroy();

      expect(component._resetSubscriptions).toHaveBeenCalled();
      expect(component._initialized).toEqual(false);
    });
  });

  describe('ngOnChanges', () => {
    beforeEach(() => {
      mockPlaybackListService._getPlaybackList.and.callFake(
        (playbackListName, startIndex, limit, filters, sort) => {
          return Observable.of({
            count: 2,
            rows: [MOCK_DATA_LIST[2], MOCK_DATA_LIST[3]],
          });
        }
      );

      component.itemSubscriptionConfigurations = [{
        query: {
          context: 'auction',
          aggregate: 'auction-titles-dashboard-vehicle',
          aggregateId: `{{rowId}}`
        },
        playbackScriptName: 'auction-titles-dashboard-vehicle'
      }];

      component.listSubscriptionConfiguration = {
        query: {
          context: 'states',
          aggregate: 'titles-dashboard-list-projection',
          aggregateId: 'titles-dashboard-list-projection-result',
        },
        playbackScriptName: 'auction-titles-dashboard-vehicle-list',
      };
    });

    xdescribe('_initializeRequests', () => {
      it('should initialize requests', () => {
        const mockChanges: SimpleChanges = {
          pageIndex: {
            previousValue: null,
            currentValue: 0,
            isFirstChange: () => true,
            firstChange: true,
          },
        };
        component.ngOnChanges(mockChanges);
        expect((component._dataList.get(0) as any).toJS()).toEqual(
          MOCK_DATA_LIST[2]
        );
        expect((component._dataList.get(1) as any).toJS()).toEqual(
          MOCK_DATA_LIST[3]
        );
      });
    });
  });


  describe('exportCSV', () => {
    it('should call exportPlaybackListSubject.next with the proper params', () => {
      spyOn(component._exportPlaybackListSubject, 'next');
      component.playbackListName = 'test_playback_list_name';
      component.itemsPerPage = 25;
      component.pageIndex = 2;

      component.filters = [
        {
          operator: FilterOperator.is,
          field: 'dealershipId',
          value: 'test-id'
        }
      ];

      component.sort = [{ field: 'dealershipName', sortDirection: SortDirection.ASC }];

      component.exportCSV();

      const expectedParams = {
        playbackListName: 'test_playback_list_name',
        startIndex: component.itemsPerPage * (component.pageIndex - 1),
        limit: 1000000,
        filters: component.filters,
        sort: component.sort
      };
      expect(component._exportPlaybackListSubject.next).toHaveBeenCalledWith(expectedParams);
    });
  });
});
