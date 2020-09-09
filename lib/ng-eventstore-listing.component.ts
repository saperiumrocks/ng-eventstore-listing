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
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';

import {
  SubscriptionConfiguration,
  Script,
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
import * as moment_ from 'moment-mini-ts';

import saveAs from 'file-saver';

@Component({
  selector: 'lib-ng-eventstore-listing',
  templateUrl: './ng-eventstore-listing.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgEventstoreListingComponent
  implements OnInit, OnChanges, OnDestroy {
  @Output() updateEmitter: EventEmitter<any> = new EventEmitter();
  @Output() getLookupsEmitter: EventEmitter<any> = new EventEmitter();
  @Output() showModalEmitter: EventEmitter<any> = new EventEmitter();
  @Output() deleteEmitter: EventEmitter<any> = new EventEmitter();
  @Output() playbackListLoadedEmitter: EventEmitter<any> = new EventEmitter();
  @Output() newItemNotifyEmitter: EventEmitter<any> = new EventEmitter();
  @Output() removedItemNotifyEmitter: EventEmitter<any> = new EventEmitter();

  @Input() itemComponentClass: any;
  @Input() lookups = {};
  @Input() socketUrl: string;
  @Input() playbackListBaseUrl: string;
  @Input() scriptStore: Script[];
  @Input() itemSubscriptionConfigurations: SubscriptionConfiguration[] = [];
  @Input() listSubscriptionConfiguration: SubscriptionConfiguration;
  @Input() playbackListName: string;
  @Input() filters: Filter[] = null;
  @Input() sort: Sort[] = null;
  @Input() pageIndex = 1;
  @Input() itemsPerPage: number;
  @Input() responseBasePath = 'data';
  @Input() emptyListDisplayText = 'No Results';
  @Input() csvFileName = '';

  @Input() debugging = false;

  _dataList: Immutable.List<RowItem>;
  _dataCount: number;
  _dataTotalCount: number;
  _initialized = false;
  _getPlaybackListSubscription: Subscription;
  _getPlaybackListSubject: Subject<PlaybackListRequest> = new Subject();
  _exportPlaybackListSubscription: Subscription;
  _exportPlaybackListSubject: Subject<PlaybackListRequest> = new Subject();
  _playbackSubscriptionTokens: string[] = [];
  _playbackList: PlaybackList = {
    get: (rowId: string, callback: (err, item) => void) => {
      const rowIndex = this._dataList.findIndex((value: any) => {
        return value.get('rowId') === rowId;
      });

      if (rowIndex > -1) {
        const data = this._dataList.get(rowIndex);
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
      // const newEntry = {
      //   rowId: rowId,
      //   revision: revision,
      //   data: data,
      //   meta: meta,
      // };
      // this.dataList = this.dataList.push(Immutable.fromJS(newEntry));
      // this.changeDetectorRef.detectChanges();
      // Do refresh trigger
      const newItem = {
        rowId,
        revision,
        data,
        meta
      };
      this.newItemNotifyEmitter.emit(newItem);
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
      const rowIndex = this._dataList.findIndex((value: any) => {
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

          console.log(this._dataList.toJS());
        }
        this._dataList = this._dataList.set(rowIndex, newEntry);

        if (this.debugging) {
          console.log(this._dataList.toJS());
        }
        this.changeDetectorRef.detectChanges();
        callback();
      } else {
        callback(new Error(`Row with rowId: ${rowIndex} does not exist`));
      }
    },
    delete: (rowId: string, callback: (error?: any) => void) => {
      const rowIndex = this._dataList.findIndex((value: any) => {
        return value.get('rowId') === rowId;
      });

      if (rowIndex > -1) {
        // this._dataList = this._dataList.remove(rowIndex);
        this.removedItemNotifyEmitter.emit(rowId);
        callback(null);
      } else {
        callback(new Error(`Row with rowId: ${rowIndex} does not exist`));
      }
    },
  };

  _stateFunctions = {
    getState: (id: string) => {
      const index = this._dataList.findIndex((row: any) => {
        return row.get('rowId') === id;
      });
      if (index > 0) {
        return (this._dataList.get(index) as any).toJS();
      }

      return {};
    },
    setState: (id: string, data: any) => {
      const index = this._dataList.findIndex((row: any) => {
        return row.get('rowId') === id;
      });
      this._dataList = this._dataList.set(index, Immutable.fromJS(data));
      this.changeDetectorRef.markForCheck();
    },
  };

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private scriptService: ScriptService,
    private playbackService: PlaybackService,
    private playbackListService: PlaybackListService
  ) {}

  async ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const self = this;

    if (!self._initialized) {
      this._initialized = true;
      this._loadScripts().then(() => {
        this._initializeRequests();
        this.playbackService.init(this.socketUrl);
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

      });
    } else {
      const changesKeys = Object.keys(changes);
      changesKeys.forEach((key) => {
        self[key] = changes[key].currentValue;
        switch (key) {
          case 'pageIndex':
          case 'filters':
          case 'sort':
          case 'playbackListName': {
            this.requestPlaybackList();
            break;
          }
        }
      });
    }
  }


  ngOnDestroy() {
    this._resetSubscriptions();
    this._initialized = false;
  }

  trackByFn(index: number, item: any) {
    return item.get('rowId');
  }

  private _initializeRequests(): void {
    this._getPlaybackListSubscription = this._getPlaybackListSubject
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
        this._dataList = Immutable.fromJS(res.rows);
        this._dataCount = res.rows.length;
        this._dataTotalCount = res.count;

        this._resetSubscriptions();
        this._initSubscriptions();

        this.changeDetectorRef.detectChanges();

        this.playbackListLoadedEmitter.emit({
          totalItems: this._dataTotalCount,
          dataCount: this._dataCount,
        });
      });

    this._exportPlaybackListSubscription = this._exportPlaybackListSubject
    .pipe(
      debounceTime(100),
      switchMap((params) => {
        return this.playbackListService.getPlaybackListCsv(
          this.playbackListBaseUrl,
          params.playbackListName,
          params.startIndex,
          params.limit,
          params.filters,
          params.sort,
          params.type
        );
      })
    )
    .subscribe((result: any) => {
      const csv = new Blob([result], { type: 'text/csv' });
      const moment = moment_;
      const now = moment();
      const fileName = `${now.format('YYYY_MM_DD_HH_mm_ss')}_${this.csvFileName || this.playbackListName}.csv`;
      saveAs(csv, fileName);
    });
  }

  _getPlaybackList(
    playbackListName: string,
    startIndex: number,
    limit: number,
    filters?: Filter[],
    sort?: Sort[]
  ) {
    const playbackListRequestParams: PlaybackListRequest = {
      playbackListName: playbackListName,
      startIndex: startIndex,
      limit: limit,
      filters: filters,
      sort: sort,
    };
    this._getPlaybackListSubject.next(playbackListRequestParams);
  }

  requestPlaybackList() {
    const startIndex = this.itemsPerPage * (this.pageIndex - 1);
    this._getPlaybackList(
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
    (self.itemSubscriptionConfigurations || []).forEach((itemSubscriptionConfiguration: SubscriptionConfiguration) => {
      if (itemSubscriptionConfiguration) {
        self._dataList.forEach(async (row: any) => {
          const streamRevisionFunction = itemSubscriptionConfiguration.streamRevisionFunction ?
            itemSubscriptionConfiguration.streamRevisionFunction : () => +row.get('revision') + 1;

          const aggregateId = itemSubscriptionConfiguration.rowIdFieldName ?
              row.get('data').get(itemSubscriptionConfiguration.rowIdFieldName) : row.get('rowId');

          const query: Query = _clone(itemSubscriptionConfiguration.query);
          query.aggregateId = query.aggregateId.replace(
            /{{rowId}}/g,
            aggregateId
          );

          const playbackSubscriptionToken = await self.playbackService.registerForPlayback(
            self,
            itemSubscriptionConfiguration.playbackScriptName,
            query,
            self._stateFunctions,
            self._playbackList,
            streamRevisionFunction,
            row.get('rowId'),
            itemSubscriptionConfiguration.condition
          );
          this._playbackSubscriptionTokens.push(playbackSubscriptionToken);
        });
      }
    });

    if (self.listSubscriptionConfiguration) {
      // List subscription
      this._playbackSubscriptionTokens.push(
        await self.playbackService.registerForPlayback(
          self,
          self.listSubscriptionConfiguration.playbackScriptName,
          self.listSubscriptionConfiguration.query,
          self._stateFunctions,
          self._playbackList,
          () => 0
        )
      );
    }
  }

  _resetSubscriptions() {
    this.playbackService.unregisterForPlayback(this._playbackSubscriptionTokens);
    this._playbackSubscriptionTokens = [];
  }

  _onUpdate(payload: any) {
    this.updateEmitter.emit(payload);
  }

  _onGetLookups(payload: any) {
    this.getLookupsEmitter.emit(payload);
  }

  _onShowModal(payload: any) {
    this.showModalEmitter.emit(payload);
  }

  _onDelete(payload: any) {
    this.deleteEmitter.emit(payload);
  }

  exportCSV(overrideParams?: PlaybackListRequest) {
    if (overrideParams) {
      this._exportPlaybackListSubject.next(overrideParams);
    } else {
      const startIndex = this.itemsPerPage * (this.pageIndex - 1);
      const exportPlaybackListRequestParams: PlaybackListRequest = {
        playbackListName: this.playbackListName,
        startIndex: startIndex,
        limit: 1000000,
        filters: this.filters,
        sort: this.sort
      };

      this._exportPlaybackListSubject.next(exportPlaybackListRequestParams);
    }
  }
}
