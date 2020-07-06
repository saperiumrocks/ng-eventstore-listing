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
import { Subscription } from 'rxjs';
import { switchMap, map as rxMap } from 'rxjs/operators';

import {
  SubscriptionConfiguration,
  OffsetsResponse,
  ListHeaderGroups,
  DeltaEvent,
  Script,
} from './models';
import { ScriptService } from './services/script.service';
import { PlaybackService, Query } from './services/playback.service';

import * as Immutable from 'immutable';
import _defaultsDeep from 'lodash-es/defaultsDeep';
import _isEmpty from 'lodash-es/isEmpty';
import _isEqual from 'lodash-es/isEqual';
import _cloneDeep from 'lodash-es/cloneDeep';
import _clone from 'lodash-es/clone';
import _uniq from 'lodash-es/uniq';
import { RowItem } from './models/row-item';

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
  @Output() sortEmitter: EventEmitter<any> = new EventEmitter();
  @Output() updateDataList: EventEmitter<any> = new EventEmitter();

  @Input() itemComponentClass: any;
  @Input() inputDataList: Immutable.List<any>;
  @Input() DataInterface: any;
  @Input() idPropertyName = 'id';
  @Input() playbackEventsToWatch: string[] = [];
  @Input() customPlaybackFunctions = {};
  @Input() lookups = {};
  @Input() listHeaderGroups: ListHeaderGroups = { groups: [] };
  @Input() socketUrl: string;
  @Input() scriptStore: Script[];

  @Input() itemSubscriptionConfiguration: SubscriptionConfiguration;
  @Input() listSubscriptionConfiguration: SubscriptionConfiguration;

  sortField: string;
  sortOrder: string;
  sortFields = {};

  dataList: Immutable.List<RowItem>;
  customPlaybackEvents = [];

  getOffsetsSubjects: any = {};
  getOffsetsSubscriptions: Subscription[] = [];
  getOffsetsSubscription: Subscription;

  topicsSubscriptions: Subscription[] = [];
  topicsSubscription: Subscription;

  streamsSubscriptions: Subscription[] = [];
  streamsSubscription: Subscription;

  scriptsLoaded = false;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private scriptService: ScriptService,
    private playbackService: PlaybackService
  ) {}

  ngOnInit() {
    this.customPlaybackEvents = !_isEmpty(this.customPlaybackFunctions)
      ? Object.keys(this.customPlaybackFunctions)
      : [];
    this.changeDetectorRef.markForCheck();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const self = this;
    console.log('TEST CHANGES');
    console.log(changes);

    if (!this.scriptsLoaded) {
      this._loadScripts();
    }

    const changesKeys = Object.keys(changes);
    changesKeys.forEach((key) => {
      self[key] = changes[key].currentValue;
      switch (key) {
        case 'inputDataList': {
          this._setImmutableList(
            changes[key].currentValue,
            changes[key].previousValue
          );
          // this.changeDetectorRef.detectChanges();
          break;
        }
        case 'listHeaderGroups': {
          this._initSortFields(changes.listHeaderGroups.currentValue);
          // this.changeDetectorRef.detectChanges();
          break;
        }
      }
    });
  }

  ngOnDestroy() {
    this._resetSubscriptions();
  }

  trackByFn(idPropertyName: string, index: number, item: any) {
    return item.get(idPropertyName);
  }

  _loadScripts() {
    if (this.scriptStore) {
      this.scriptService.init(this.scriptStore);
    }
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

  onSort(sortField: string) {
    if (this.sortFields[sortField]) {
      if (this.sortField !== sortField) {
        if (this.sortField) {
          this.sortFields[this.sortField] = {};
        }
        this.sortOrder = 'asc';
      } else {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      }
      this.sortField = sortField;
      this.sortFields[this.sortField].icon =
        this.sortOrder === 'asc' ? 'fa fa-angle-up' : 'fa fa-angle-down';
      const sortData = {
        sortField: this.sortField,
        sortOrder: this.sortOrder,
      };
      this.sortEmitter.emit(sortData);
    }
  }

  private _setImmutableList(newList: RowItem[] = [], previousList: any[] = []) {
    this.dataList = Immutable.fromJS(newList);
    const oldIds = previousList.map((item) => item[this.idPropertyName]);
    const newIds = newList.map((item) => item[this.idPropertyName]);

    if (!_isEqual(oldIds, newIds)) {
      this._resetSubscriptions();
      this._initSubscriptions();
    }
  }

  private _initSortFields(listHeaderGroups: ListHeaderGroups): void {
    if (listHeaderGroups) {
      listHeaderGroups.groups.forEach((listHeaderGroup) => {
        listHeaderGroup.listHeaders.forEach((listHeader) => {
          if (listHeader.sortProperty) {
            this.sortFields[listHeader.sortProperty] = {};
          }
        });
      });
    }
  }

  private async _initSubscriptions() {
    const self = this;
    // Per row subscriptions
    this.dataList.forEach(async (row: any) => {
      const query: Query = _clone(this.itemSubscriptionConfiguration.query);
      query.aggregateId = query.aggregateId.replace(
        /{{rowId}}/g,
        row.get('rowId')
      );
      await this.playbackService.registerForPlayback(
        this.itemSubscriptionConfiguration.playbackScriptName,
        self,
        query,
        this.itemSubscriptionConfiguration.stateFunctions,
        0
      );
    });

    // List subscription
    await this.playbackService.registerForPlayback(
      this.listSubscriptionConfiguration.playbackScriptName,
      self,
      this.listSubscriptionConfiguration.query,
      this.listSubscriptionConfiguration.stateFunctions,
      0
    );
  }

  // private _onOffsetResponse(offsets: number[] = [], offsetKeys: string[] = [], subscriptionConfiguration: SubscriptionConfiguration): void {
  //   const queries = offsetKeys.map((offsetKey: string, index?: number) => {
  //     const offsetKeySplit = offsetKey.split('.');

  //     console.log(offsetKey);
  //     // context.vehicle.key.vehicle-projection-vehicle-vehicle-gi-4nV3Sth-result

  //     const query: Query = {
  //       context: subscriptionConfiguration.query.context,
  //       aggregate: subscriptionConfiguration.query.aggregate,
  //       aggregateId: subscriptionConfiguration.query.aggregateId
  //     };

  //     return { query: query, offset: offsets[index] + 1 };
  //   });

  //   this._subscribeToEvents(queries, subscriptionConfiguration);
  // }

  // private async _subscribeToEvents(queries: any[], subscriptionConfiguration: SubscriptionConfiguration) {
  //   const self = this;
  //   queries.forEach(async (query) => {
  //     const subscription = await this.playbackService.registerForPlayback(subscriptionConfiguration.playbackScriptName, self, query.query, query.offset);
  //   });
  // }

  // private _playbackEvents(events: DeltaEvent[], idPropertyName: string) {
  //   const self = this;
  //   events.forEach((deltaEvent: DeltaEvent) => {
  //     if (self.playbackEventsToWatch.includes(deltaEvent.event) && idPropertyName) {
  //       const eventPayload = deltaEvent.payload;
  //       // const itemIndex = self._getItemIndex(self.dataList, eventPayload);
  //       const itemIndices = self._getItemIndices(self.dataList, eventPayload, idPropertyName);
  //       itemIndices.forEach((itemIndex) => {
  //         if (itemIndex > -1) {
  //           self.dataList = self.dataList.update(itemIndex, (item: any) => {
  //             const oldItem = item.toObject();
  //             const newItem = self._mergeData(oldItem, eventPayload);
  //             return Immutable.fromJS(newItem);
  //           });
  //           this.changeDetectorRef.markForCheck();
  //         }
  //       });
  //     } else if (self.customPlaybackEvents.includes(deltaEvent.event) && idPropertyName) {
  //       const eventPayload = deltaEvent.payload;
  //       // const itemIndex = self._getItemIndex(self.dataList, eventPayload);
  //       const itemIndices = self._getItemIndices(self.dataList, eventPayload, idPropertyName);

  //       itemIndices.forEach((itemIndex) => {
  //         if (itemIndex > -1) {
  //           self.dataList = self.dataList.update(itemIndex, (item: any) => {
  //             const customFunction = self.customPlaybackFunctions[deltaEvent.event];
  //             if (customFunction) {
  //               const customFunctionResponse = customFunction(item.toObject(), eventPayload);
  //               if (customFunctionResponse) {
  //                 return Immutable.fromJS(_cloneDeep(customFunctionResponse));
  //               } else {
  //                 return item;
  //               }
  //             }
  //             return item;
  //           });
  //           this.changeDetectorRef.markForCheck();
  //         }
  //       });
  //     } else if (self.customPlaybackEvents.includes(deltaEvent.event) && !idPropertyName) {
  //       const eventPayload = deltaEvent.payload;
  //       const customFunction = self.customPlaybackFunctions[deltaEvent.event];
  //       const customFunctionResponse = customFunction(null, eventPayload);

  //       if (customFunctionResponse) {
  //         return Immutable.fromJS(_cloneDeep(customFunctionResponse));
  //       }
  //       return null;
  //     }
  //   });
  //   self.inputDataList = self.dataList;
  //   self.updateDataList.emit(self.inputDataList);
  // }

  private _resetSubscriptions() {
    this.getOffsetsSubscriptions.forEach(
      (getOffsetsSubscription: Subscription) => {
        getOffsetsSubscription.unsubscribe();
      }
    );

    // this.topicsSubscriptions.forEach((topicsSubscription: Subscription) => {
    //   topicsSubscription.unsubscribe();
    // });

    this.getOffsetsSubscriptions = [];
    this.getOffsetsSubjects = [];
    // this.topicsSubscriptions = [];

    // NEW IMPLEMENTATION
    this.streamsSubscriptions.forEach((streamsSubscription: Subscription) => {
      streamsSubscription.unsubscribe();
    });

    this.streamsSubscriptions = [];
  }

  // private _getItemIndex(dataList: Immutable.List<any>, eventPayload: any): number {
  //   return dataList.findIndex((item: any) => {
  //     return item.get(this.idPropertyName) === eventPayload[this.idPropertyName];
  //   });
  // }

  // private _getItemIndices(dataList: Immutable.List<any> = Immutable.fromJS([]), eventPayload: any, idPropertyName: string): number[] {
  //   return dataList.filter((item: any) => {
  //     return item.get(idPropertyName) === eventPayload[idPropertyName];
  //   }).map((item: any) => {
  //     return dataList.indexOf(item);
  //   }).toJS();
  // }

  // private _getSubscriptionKeys(context: string, idPropertyName: string, streamKey?: string): string[] {
  //   if (!streamKey && this.dataList) {
  //     return _uniq(this.dataList.toArray().map((item) => {
  //       if (item && item.get(idPropertyName)) {
  //         return `context.${context}.key.${item.get(idPropertyName)}`;
  //       }
  //     }));
  //   } else if (streamKey) {
  //     return [`context.${context}.key.${streamKey}`];
  //   }
  //   return [];
  // }

  // private _mergeData(originalItem: any, dataToAppend: any): any {
  //   // TODO: Note defaults when handling arrays
  //   return _cloneDeep(_defaultsDeep(dataToAppend, originalItem));
  // }
}
