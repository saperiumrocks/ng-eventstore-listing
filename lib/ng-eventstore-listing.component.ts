import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';

import { switchMap, debounceTime } from 'rxjs/operators';

import {
  SubscriptionConfiguration,
  ListHeaderGroups,
  Script,
  PlaybackListResponse,
  PlaybackList,
  RowItem,
  Filter,
  Query,
  Sort,
  PlaybackListRequest,
} from './models';

import { ScriptService } from './services/script.service';
import { PlaybackService } from './services/playback.service';
import { PlaybackListService } from './services/playback-list.service';

import * as Immutable from 'immutable';
import _defaultsDeep from 'lodash-es/defaultsDeep';
import _isEmpty from 'lodash-es/isEmpty';
import _isEqual from 'lodash-es/isEqual';
import _cloneDeep from 'lodash-es/cloneDeep';
import _clone from 'lodash-es/clone';
import _uniq from 'lodash-es/uniq';
import _merge from 'lodash-es/defaults';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'lib-ng-eventstore-listing',
  templateUrl: './ng-eventstore-listing.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgEventstoreListingComponent
  implements OnInit, OnChanges, OnDestroy {
  @Output() updateEmitter: EventEmitter<any> = new EventEmitter();
  @Output() updateLookupsEmitter: EventEmitter<any> = new EventEmitter();
  @Output() showModalEmitter: EventEmitter<any> = new EventEmitter();
  @Output() deleteEmitter: EventEmitter<any> = new EventEmitter();
  @Output() playbackListLoadedEmitter: EventEmitter<any> = new EventEmitter();

  @Input() itemComponentClass: any;
  @Input() lookups = {};
  @Input() socketUrl: string;
  @Input() playbackListBaseUrl: string;
  @Input() scriptStore: Script[];
  @Input() itemSubscriptionConfiguration: SubscriptionConfiguration;
  @Input() listSubscriptionConfiguration: SubscriptionConfiguration;
  @Input() playbackListName: string;
  @Input() filters: Filter[] = null;
  @Input() sort: Sort = null;
  @Input() pageIndex = 1;
  @Input() itemsPerPage: number;
  @Input() responseBasePath = 'data';
  @Input() emptyListDisplayText = 'No Results';

  @Input() debugging = false;

  dataList: Immutable.List<RowItem>;
  dataCount: number;
  dataTotalCount: number;
  initialized = false;
  getPlaybackListSubscription: Subscription;
  getPlaybackListSubject: Subject<PlaybackListRequest> = new Subject();
  subscriptionTokens: string[] = [];
  playbackList: PlaybackList = {
    get: (rowId: string, callback: (err, item) => void) => {
      const rowIndex = this.dataList.findIndex((value: any) => {
        return value.get('rowId') === rowId;
      });

      if (rowIndex > -1) {
        const data = this.dataList.get(rowIndex);
        if (data) {
          callback(null, (data as any).toJS());
        } else {
          callback(null, {});
        }
      } else {
        callback(new Error(`Row with rowId: ${rowIndex} does not exist`), null);
      }
    },
    add: (
      rowId: string,
      revision: number,
      data: any,
      meta: any,
      callback: (err?: any) => void
    ) => {
      const newEntry = {
        rowId: rowId,
        revision: revision,
        data: data,
        meta: meta,
      };
      this.dataList = this.dataList.push(Immutable.fromJS(newEntry));
      this.changeDetectorRef.detectChanges();
      callback();
    },
    update: (
      rowId: string,
      revision: number,
      oldData: any,
      newData: any,
      meta: any,
      callback: (err?) => void
    ) => {
      const rowIndex = this.dataList.findIndex((value: any) => {
        return value.get('rowId') === rowId;
      });

      // oldData is Immutable
      const newEntry = Immutable.fromJS({
        rowId: rowId,
        revision: revision,
        data: {
          ...oldData,
          ...newData,
        },
        meta: meta,
      });

      if (this.debugging) {
        console.log(newEntry);
      }

      if (rowIndex > -1) {
        if (this.debugging) {
          console.log(rowIndex);
          console.log(newEntry);

          console.log(this.dataList.toJS());
        }
        this.dataList = this.dataList.set(rowIndex, newEntry);

        if (this.debugging) {
          console.log(this.dataList.toJS());
        }
        this.changeDetectorRef.detectChanges();
        callback();
      } else {
        callback(new Error(`Row with rowId: ${rowIndex} does not exist`));
      }
    },
    delete: (rowId: string, callback: (error?: any) => void) => {
      const rowIndex = this.dataList.findIndex((value: any) => {
        return value.get('rowId') === rowId;
      });

      if (rowIndex > -1) {
        this.dataList = this.dataList.remove(rowIndex);
        callback(null);
      } else {
        callback(new Error(`Row with rowId: ${rowIndex} does not exist`));
      }
    },
  };

  stateFunctions = {
    getState: (id: string) => {
      const index = this.dataList.findIndex((row: any) => {
        return row.get('rowId') === id;
      });
      return (this.dataList.get(index) as any).toJS();
    },
    setState: (id: string, data: any) => {
      const index = this.dataList.findIndex((row: any) => {
        return row.get('rowId') === id;
      });
      this.dataList = this.dataList.set(index, Immutable.fromJS(data));
      this.changeDetectorRef.markForCheck();
    },
  };

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private scriptService: ScriptService,
    private playbackService: PlaybackService,
    private playbackListService: PlaybackListService
  ) {}

  ngOnInit() {
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    const self = this;
    if (!this.initialized) {
      await this._loadScripts();
      this.playbackService.init(this.socketUrl);
      this._initializeRequests();
      this.initialized = true;
    }

    const changesKeys = Object.keys(changes);
    changesKeys.forEach((key) => {
      self[key] = changes[key].currentValue;
      switch (key) {
        case 'pageIndex':
        case 'filters':
        case 'sort': {
          this.requestPlaybackList();
          break;
        }
      }
    });
  }

  ngOnDestroy() {
    this._resetSubscriptions();
  }

  trackByFn(index: number, item: any) {
    return item.get('rowId');
  }

  private _initializeRequests(): void {
    this.getPlaybackListSubscription = this.getPlaybackListSubject
      .pipe(
        debounceTime(100),
        switchMap((params) => {
          return this.playbackListService.getPlaybackList(
            this.playbackListBaseUrl,
            params.playbackListName,
            params.startIndex,
            params.limit,
            params.filters,
            params.sort
          );
        })
      )
      .subscribe((res: any) => {
        this.dataList = Immutable.fromJS(res.rows);
        this.dataCount = res.rows.length;
        this.dataTotalCount = res.count;

        this._resetSubscriptions();
        this._initSubscriptions();

        this.changeDetectorRef.detectChanges();

        this.playbackListLoadedEmitter.emit({
          totalItems: this.dataTotalCount,
          dataCount: this.dataCount,
        });
      });
  }

  getPlaybackList(
    playbackListName: string,
    startIndex: number,
    limit: number,
    filters?: Filter[],
    sort?: Sort
  ) {
    const playbackListRequestParams: PlaybackListRequest = {
      playbackListName: playbackListName,
      startIndex: startIndex,
      limit: limit,
      filters: filters,
      sort: sort,
    };
    this.getPlaybackListSubject.next(playbackListRequestParams);
  }

  requestPlaybackList() {
    const startIndex = this.itemsPerPage * (this.pageIndex - 1);
    this.getPlaybackList(
      this.playbackListName,
      startIndex,
      this.itemsPerPage,
      this.filters,
      this.sort
    );
  }

  private async _loadScripts() {
    if (this.scriptStore) {
      await this.scriptService.init(this.scriptStore);
    }
  }

  private async _initSubscriptions() {
    const self = this;
    // Per row subscriptions
    self.dataList.forEach(async (row: any) => {
      const query: Query = _clone(self.itemSubscriptionConfiguration.query);
      query.aggregateId = query.aggregateId.replace(
        /{{rowId}}/g,
        row.get('rowId')
      );
      this.subscriptionTokens.push(
        await self.playbackService.registerForPlayback(
          self.itemSubscriptionConfiguration.playbackScriptName,
          self,
          query,
          self.stateFunctions,
          row.get('revision') + 1,
          self.playbackList
        )
      );
    });

    // List subscription
    this.subscriptionTokens.push(
      await self.playbackService.registerForPlayback(
        self.listSubscriptionConfiguration.playbackScriptName,
        self,
        self.listSubscriptionConfiguration.query,
        self.stateFunctions,
        // TODO: Revision response from getPlaybackList
        0,
        self.playbackList
      )
    );
  }

  private _resetSubscriptions() {
    this.subscriptionTokens.forEach((subscriptionToken) => {
      this.playbackService.unRegisterForPlayback(subscriptionToken);
    });
    this.subscriptionTokens = [];
  }

  onUpdate(payload: any) {
    this.updateEmitter.emit(payload);
  }

  onUpdateLookups(payload: any) {
    this.updateLookupsEmitter.emit(payload);
  }

  onShowModal(payload: any) {
    this.showModalEmitter.emit(payload);
  }

  onDelete(payload: any) {
    this.deleteEmitter.emit(payload);
  }
}
