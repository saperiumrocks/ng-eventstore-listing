import { NgEventstoreListingComponent } from './ng-eventstore-listing.component';
import * as Immutable from 'immutable';
import { RowItem, PlaybackListResponse } from './models';
import { Observable, of } from 'rxjs';
import { SimpleChanges, SimpleChange } from '@angular/core';

describe('NgEventstoreListingComponent', () => {
  let component: NgEventstoreListingComponent;
  let mockChangeDetectorRef;
  let mockScriptService;
  let mockPlaybackService;
  let mockPlaybackListService;

  beforeEach(() => {
    mockChangeDetectorRef = jasmine.createSpyObj('mockChangeDetectorRef', [
      'markForCheck',
      'detectChanges',
    ]);
    mockScriptService = jasmine.createSpyObj('mockScriptService', ['init']);
    mockPlaybackService = jasmine.createSpyObj('mockPlaybackService', [
      'registerForPlayback',
      'unregisterForPlayback',
    ]);
    mockPlaybackListService = jasmine.createSpyObj('mockPlaybackListService', [
      'getPlaybackList',
    ]);
    component = new NgEventstoreListingComponent(
      mockChangeDetectorRef,
      mockScriptService,
      mockPlaybackService,
      mockPlaybackListService
    );
  });

  describe('playbackList functions initialization', () => {
    beforeEach(() => {
      component.dataList = Immutable.fromJS(MOCK_DATA_LIST);
    });

    it('should define get properly', (done) => {
      const rowId = 'test-2';
      component.playbackList.get(rowId, (err, item) => {
        expect(item).toEqual(component.dataList.get(1));
        done();
      });
    });

    it('should define add properly', (done) => {
      const rowId = 'test-5';
      const revision = 0;
      const data = { testProp: 9 };
      const meta = { testMeta: 123 };
      component.playbackList.add(rowId, revision, data, meta, (err) => {
        const newEntry = {
          rowId: rowId,
          revision: revision,
          data: data,
          meta: meta,
        };
        expect(Immutable.fromJS(newEntry)).toEqual(component.dataList.last());
        done();
      });
    });

    it('should define update properly', (done) => {
      const rowId = 'test-3';
      const revision = 0;
      const oldData = { testProp1: 8, testProp2: 123 };
      const newData = { testProp1: 9 };
      const meta = { testMeta: 123 };
      component.playbackList.update(
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
          expect(Immutable.fromJS(newEntry)).toEqual(component.dataList.get(2));
          done();
        }
      );
    });

    it('should define delete properly', (done) => {
      const rowId = 'test-3';
      component.playbackList.delete(rowId, (err) => {
        expect(
          component.dataList.findIndex((item: any) => {
            return item.get('rowId') === rowId;
          })
        ).toEqual(-1);
        done();
      });
    });
  });

  describe('stateFunctions initialization', () => {
    beforeEach(() => {
      component.dataList = Immutable.fromJS(MOCK_DATA_LIST);
    });

    it('should define getState properly', () => {
      const rowId = 'test-2';

      const state = component.stateFunctions.getState(rowId);
      expect(state).toEqual((component.dataList.get(1) as any).toJS());
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

      component.stateFunctions.setState(rowId, row);
      expect(row).toEqual((component.dataList.get(1) as any).toJS());
      expect(mockChangeDetectorRef.markForCheck).toHaveBeenCalled();
    });
  });

  describe('ngOnChanges', () => {
    beforeEach(() => {
      mockPlaybackListService.getPlaybackList.and.callFake(
        (playbackListName, startIndex, limit, filters, sort) => {
          return of(<PlaybackListResponse>{
            count: 2,
            rows: [MOCK_DATA_LIST[2], MOCK_DATA_LIST[3]],
          });
        }
      );

      component.itemSubscriptionConfiguration = {
        query: {
          context: 'auction',
          aggregate: 'auction-titles-dashboard-vehicle',
          aggregateId: `{{rowId}}`,
        },
        playbackScriptName: 'auction-titles-dashboard-vehicle',
      };

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
        expect((component.dataList.get(0) as any).toJS()).toEqual(
          MOCK_DATA_LIST[2]
        );
        expect((component.dataList.get(1) as any).toJS()).toEqual(
          MOCK_DATA_LIST[3]
        );
      });
    });
  });
});

const MOCK_DATA_LIST: RowItem[] = [
  { rowId: 'test-1', revision: 0, data: { testProp1: 1 }, meta: {} },
  { rowId: 'test-2', revision: 0, data: { testProp1: 3 }, meta: {} },
  { rowId: 'test-3', revision: 0, data: { testProp1: 5 }, meta: {} },
  { rowId: 'test-4', revision: 0, data: { testProp1: 7 }, meta: {} },
];
