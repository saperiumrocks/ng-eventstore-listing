import * as tslib_1 from "tslib";
import { Helpers } from './utils/helpers';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, Inject } from '@angular/core';
import { switchMap, debounceTime, map as rxMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { JQ_TOKEN } from './services/jquery.service';
import { ScriptService } from './services/script.service';
import { PlaybackService } from './services/playback.service';
import { PlaybackListService } from './services/playback-list.service';
import * as Immutable from 'immutable';
import _isEmpty from 'lodash-es/isEmpty';
import _clone from 'lodash-es/clone';
import * as moment_ from 'moment-mini-ts';
import saveAs from 'file-saver';
let NgEventstoreListingComponent = class NgEventstoreListingComponent {
    constructor($, changeDetectorRef, scriptService, playbackService, playbackListService) {
        this.$ = $;
        this.changeDetectorRef = changeDetectorRef;
        this.scriptService = scriptService;
        this.playbackService = playbackService;
        this.playbackListService = playbackListService;
        this.updateEmitter = new EventEmitter();
        this.getLookupsEmitter = new EventEmitter();
        this.showModalEmitter = new EventEmitter();
        this.deleteEmitter = new EventEmitter();
        this.playbackListLoadedEmitter = new EventEmitter();
        this.newItemNotifyEmitter = new EventEmitter();
        this.removedItemNotifyEmitter = new EventEmitter();
        this.getPlaybackLIstErrorEmitter = new EventEmitter();
        this.lookups = {};
        this.itemSubscriptionConfigurations = [];
        this.filters = null;
        this.sort = null;
        this.pageIndex = 1;
        this.responseBasePath = 'data';
        this.emptyListDisplayText = 'No Results';
        this.csvFileName = '';
        this.enableLoadingOverlay = true;
        this.minHeightCss = '500px';
        this.loadingOffset = '200px';
        this.debugging = false;
        this._initialized = false;
        this._isLoading = false;
        this._getPlaybackListSubject = new Subject();
        this._exportPlaybackListSubject = new Subject();
        this._playbackSubscriptionTokens = [];
        this._playbackList = {
            get: (rowId, callback) => {
                const rowIndex = this._dataList.findIndex((value) => {
                    return value.get('rowId') === rowId;
                });
                if (rowIndex > -1) {
                    const data = this._dataList.get(rowIndex);
                    if (data) {
                        callback(null, data.toJS());
                    }
                    else {
                        callback(null, {});
                    }
                }
                else {
                    callback(new Error(`Row with rowId: ${rowIndex} does not exist`), null);
                }
            },
            add: (rowId, revision, data, meta, callback) => {
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
            update: (rowId, revision, oldData, newData, meta, callback) => {
                const rowIndex = this._dataList.findIndex((value) => {
                    return value.get('rowId') === rowId;
                });
                // oldData is Immutable
                const newEntry = Immutable.fromJS({
                    rowId: rowId,
                    revision: revision,
                    data: Object.assign({}, oldData, newData),
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
                }
                else {
                    callback(new Error(`Row with rowId: ${rowIndex} does not exist`));
                }
            },
            delete: (rowId, callback) => {
                const rowIndex = this._dataList.findIndex((value) => {
                    return value.get('rowId') === rowId;
                });
                if (rowIndex > -1) {
                    // this._dataList = this._dataList.remove(rowIndex);
                    this.removedItemNotifyEmitter.emit(rowId);
                    callback(null);
                }
                else {
                    callback(new Error(`Row with rowId: ${rowIndex} does not exist`));
                }
            },
        };
        this._id = Helpers.generateToken();
        this._stateFunctions = {
            getState: (id) => {
                const index = this._dataList.findIndex((row) => {
                    return row.get('rowId') === id;
                });
                if (index > 0) {
                    return this._dataList.get(index).toJS();
                }
                return {};
            },
            setState: (id, data) => {
                const index = this._dataList.findIndex((row) => {
                    return row.get('rowId') === id;
                });
                this._dataList = this._dataList.set(index, Immutable.fromJS(data));
                this.changeDetectorRef.markForCheck();
            },
        };
    }
    ngOnInit() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
        });
    }
    ngOnChanges(changes) {
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
        }
        else {
            const changesKeys = Object.keys(changes);
            changesKeys.forEach((key) => {
                if (key === 'pageIndex') {
                    self._previousPageIndex = changes[key].previousValue;
                }
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
        this.playbackService.resetCustomPlaybacks();
        this._initialized = false;
    }
    trackByFn(index, item) {
        return item.get('rowId');
    }
    _initializeRequests() {
        const self = this;
        self._getPlaybackListSubscription = self._getPlaybackListSubject
            .pipe(debounceTime(100), switchMap((params) => {
            return self.playbackListService.getPlaybackList(self.playbackListBaseUrl, params.playbackListName, params.startIndex, params.limit, params.filters, params.sort, params.previousKey, params.nextKey);
        }))
            .subscribe((res) => {
            self._dataList = Immutable.fromJS(res.rows);
            self._dataCount = res.rows.length;
            self._dataTotalCount = res.count;
            self._previousKey = res.previousKey;
            self._nextKey = res.nextKey;
            self._resetSubscriptions();
            self._initSubscriptions();
            self._initCustomPlaybackConfigurations();
            self.changeDetectorRef.detectChanges();
            self.playbackListLoadedEmitter.emit({
                totalItems: self._dataTotalCount,
                dataCount: self._dataCount,
            });
            if (self.enableLoadingOverlay) {
                self.hideLoadingOverlay();
            }
            self._isLoading = false;
        }, (error) => {
            self.getPlaybackLIstErrorEmitter.emit(error);
            if (self.enableLoadingOverlay) {
                self.hideLoadingOverlay();
            }
            self._isLoading = false;
        });
        self._exportPlaybackListSubscription = self._exportPlaybackListSubject
            .pipe(debounceTime(100), switchMap((params) => {
            const playbackListRequest = params.playbackListRequest;
            return self.playbackListService.getPlaybackListCsv(self.playbackListBaseUrl, playbackListRequest.playbackListName, playbackListRequest.startIndex, playbackListRequest.limit, playbackListRequest.filters, playbackListRequest.sort, playbackListRequest.type).pipe(rxMap((response) => {
                return [response, params.fileNameOverride];
            }));
        }))
            .subscribe(([result, fileNameOverride]) => {
            const csv = new Blob([result], { type: 'text/csv' });
            const moment = moment_;
            const now = moment();
            const fileName = `${fileNameOverride || this.csvFileName || this.playbackListName}-${now.format('YYYY-MM-DD_HHmmss')}.csv`;
            saveAs(csv, fileName);
        });
    }
    _getPlaybackList(playbackListName, startIndex, limit, filters, sort, previousKey, nextKey) {
        const playbackListRequestParams = {
            playbackListName: playbackListName,
            startIndex: startIndex,
            limit: limit,
            filters: filters,
            sort: sort,
            previousKey: previousKey,
            nextKey: nextKey
        };
        this._isLoading = true;
        if (this.enableLoadingOverlay) {
            this.showLoadingOverlay();
        }
        this._getPlaybackListSubject.next(playbackListRequestParams);
    }
    requestPlaybackList() {
        let startIndex;
        if (this.pageIndex === 1) {
            this._previousPageIndex = null;
            this._previousKey = null;
            this._nextKey = null;
            startIndex = 0;
            this._getPlaybackList(this.playbackListName, startIndex, this.itemsPerPage, this.filters, this.sort, null, null);
        }
        else if (this._previousKey && this._nextKey) {
            if (this._dataTotalCount - (this.pageIndex * this.itemsPerPage) <= 0) {
                startIndex = 0;
                this._getPlaybackList(this.playbackListName, startIndex, this.itemsPerPage, this.filters, this.sort, null, '__LAST');
            }
            else {
                let pageDelta = this.pageIndex - this._previousPageIndex;
                if (pageDelta < 0) {
                    pageDelta *= -1;
                    startIndex = this.itemsPerPage * (pageDelta - 1);
                    this._getPlaybackList(this.playbackListName, startIndex, this.itemsPerPage, this.filters, this.sort, this._previousKey, null);
                }
                else {
                    startIndex = this.itemsPerPage * (pageDelta - 1);
                    this._getPlaybackList(this.playbackListName, startIndex, this.itemsPerPage, this.filters, this.sort, null, this._nextKey);
                }
            }
        }
        else {
            startIndex = this.itemsPerPage * (this.pageIndex - 1);
            this._getPlaybackList(this.playbackListName, startIndex, this.itemsPerPage, this.filters, this.sort, null, null);
        }
    }
    _loadScripts() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.scriptStore) {
                yield this.scriptService.init(this.scriptStore);
            }
        });
    }
    _initSubscriptions() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const self = this;
            // Per row subscriptions
            (self.itemSubscriptionConfigurations || []).forEach((itemSubscriptionConfiguration) => {
                if (itemSubscriptionConfiguration) {
                    self._dataList.forEach((row) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        const streamRevisionFunction = itemSubscriptionConfiguration.streamRevisionFunction ?
                            itemSubscriptionConfiguration.streamRevisionFunction : () => +row.get('revision') + 1;
                        const aggregateId = itemSubscriptionConfiguration.rowIdFunction ?
                            itemSubscriptionConfiguration.rowIdFunction(row.toJS()) : row.get('rowId');
                        const query = _clone(itemSubscriptionConfiguration.query);
                        query.aggregateId = query.aggregateId.replace(/{{rowId}}/g, aggregateId);
                        const playbackSubscriptionToken = yield self.playbackService.registerForPlayback(self, itemSubscriptionConfiguration.playbackScriptName, query, self._stateFunctions, self._playbackList, streamRevisionFunction, row.get('rowId'), itemSubscriptionConfiguration.condition, itemSubscriptionConfiguration.rowIdFunction);
                        this._playbackSubscriptionTokens.push(playbackSubscriptionToken);
                    }));
                }
            });
            if (self.listSubscriptionConfiguration) {
                // List subscription
                this._playbackSubscriptionTokens.push(yield self.playbackService.registerForPlayback(self, self.listSubscriptionConfiguration.playbackScriptName, self.listSubscriptionConfiguration.query, self._stateFunctions, self._playbackList, () => 0));
            }
        });
    }
    _initCustomPlaybackConfigurations() {
        if (!_isEmpty(this.customPlaybackConfigurations)) {
            this.playbackService.registerCustomPlaybacks(this.customPlaybackConfigurations);
        }
    }
    _resetSubscriptions() {
        this.playbackService.unregisterForPlayback(this._playbackSubscriptionTokens);
        this._playbackSubscriptionTokens = [];
    }
    _onUpdate(payload) {
        this.updateEmitter.emit(payload);
    }
    _onGetLookups(payload) {
        this.getLookupsEmitter.emit(payload);
    }
    _onShowModal(payload) {
        this.showModalEmitter.emit(payload);
    }
    _onDelete(payload) {
        this.deleteEmitter.emit(payload);
    }
    exportCSV(overrideParams, fileNameOverride) {
        if (overrideParams) {
            this._exportPlaybackListSubject.next({ playbackListRequest: overrideParams, fileNameOverride: fileNameOverride });
        }
        else {
            const startIndex = this.itemsPerPage * (this.pageIndex - 1);
            const exportPlaybackListRequestParams = {
                playbackListName: this.playbackListName,
                startIndex: startIndex,
                limit: 1000000,
                filters: this.filters,
                sort: this.sort
            };
            this._exportPlaybackListSubject.next({ playbackListRequest: exportPlaybackListRequestParams, fileNameOverride: fileNameOverride });
        }
    }
    // Loading Overlay Functions
    hideLoadingOverlay() {
        const $ = this.$;
        $('body').css('overflow', '');
        $('body').removeClass('loading-body');
        $(`#ng-eventstore-listing-overlay-${this._id}`).hide();
    }
    showLoadingOverlay() {
        const $ = this.$;
        $(`#ng-eventstore-listing-overlay-${this._id}`).show();
        if (this.loadingTopBoundSelector ? true : false) {
            this._fixLoadingOverlayPosition();
        }
    }
    _fixLoadingOverlayPosition() {
        const $ = this.$;
        const windowY = window.pageYOffset;
        const pageHeaderSectionHeight = 53;
        const pageHeaderSectionBottomY = $(this.loadingTopBoundSelector).offset().top + pageHeaderSectionHeight;
        $('body').css('overflow', 'hidden');
        $('body').addClass('loading-body');
        if (windowY < pageHeaderSectionBottomY) {
            $(`#ng-eventstore-listing-overlay-${this._id}`).css('position', 'absolute');
            $(`#ng-eventstore-listing-overlay-${this._id}`).css('height', `${window.innerHeight}px`);
            $(`#ng-eventstore-listing-overlay-${this._id}`).css('width', '100%');
            const pageHeaderHeight = pageHeaderSectionHeight;
            $(`#ng-eventstore-listing-overlay-${this._id}`).css('margin-top', `${pageHeaderHeight}px`);
        }
        else {
            $(`#ng-eventstore-listing-overlay-${this._id}`).css('position', 'fixed');
            $(`#ng-eventstore-listing-overlay-${this._id}`).css('height', '100%');
            $(`#ng-eventstore-listing-overlay-${this._id}`).css('margin-top', '0px');
        }
    }
};
NgEventstoreListingComponent.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [JQ_TOKEN,] }] },
    { type: ChangeDetectorRef },
    { type: ScriptService },
    { type: PlaybackService },
    { type: PlaybackListService }
];
tslib_1.__decorate([
    Output()
], NgEventstoreListingComponent.prototype, "updateEmitter", void 0);
tslib_1.__decorate([
    Output()
], NgEventstoreListingComponent.prototype, "getLookupsEmitter", void 0);
tslib_1.__decorate([
    Output()
], NgEventstoreListingComponent.prototype, "showModalEmitter", void 0);
tslib_1.__decorate([
    Output()
], NgEventstoreListingComponent.prototype, "deleteEmitter", void 0);
tslib_1.__decorate([
    Output()
], NgEventstoreListingComponent.prototype, "playbackListLoadedEmitter", void 0);
tslib_1.__decorate([
    Output()
], NgEventstoreListingComponent.prototype, "newItemNotifyEmitter", void 0);
tslib_1.__decorate([
    Output()
], NgEventstoreListingComponent.prototype, "removedItemNotifyEmitter", void 0);
tslib_1.__decorate([
    Output()
], NgEventstoreListingComponent.prototype, "getPlaybackLIstErrorEmitter", void 0);
tslib_1.__decorate([
    Input()
], NgEventstoreListingComponent.prototype, "itemComponentClass", void 0);
tslib_1.__decorate([
    Input()
], NgEventstoreListingComponent.prototype, "lookups", void 0);
tslib_1.__decorate([
    Input()
], NgEventstoreListingComponent.prototype, "socketUrl", void 0);
tslib_1.__decorate([
    Input()
], NgEventstoreListingComponent.prototype, "playbackListBaseUrl", void 0);
tslib_1.__decorate([
    Input()
], NgEventstoreListingComponent.prototype, "scriptStore", void 0);
tslib_1.__decorate([
    Input()
], NgEventstoreListingComponent.prototype, "itemSubscriptionConfigurations", void 0);
tslib_1.__decorate([
    Input()
], NgEventstoreListingComponent.prototype, "listSubscriptionConfiguration", void 0);
tslib_1.__decorate([
    Input()
], NgEventstoreListingComponent.prototype, "playbackListName", void 0);
tslib_1.__decorate([
    Input()
], NgEventstoreListingComponent.prototype, "filters", void 0);
tslib_1.__decorate([
    Input()
], NgEventstoreListingComponent.prototype, "sort", void 0);
tslib_1.__decorate([
    Input()
], NgEventstoreListingComponent.prototype, "pageIndex", void 0);
tslib_1.__decorate([
    Input()
], NgEventstoreListingComponent.prototype, "itemsPerPage", void 0);
tslib_1.__decorate([
    Input()
], NgEventstoreListingComponent.prototype, "responseBasePath", void 0);
tslib_1.__decorate([
    Input()
], NgEventstoreListingComponent.prototype, "emptyListDisplayText", void 0);
tslib_1.__decorate([
    Input()
], NgEventstoreListingComponent.prototype, "csvFileName", void 0);
tslib_1.__decorate([
    Input()
], NgEventstoreListingComponent.prototype, "customPlaybackConfigurations", void 0);
tslib_1.__decorate([
    Input()
], NgEventstoreListingComponent.prototype, "enableLoadingOverlay", void 0);
tslib_1.__decorate([
    Input()
], NgEventstoreListingComponent.prototype, "loadingTopBoundSelector", void 0);
tslib_1.__decorate([
    Input()
], NgEventstoreListingComponent.prototype, "minHeightCss", void 0);
tslib_1.__decorate([
    Input()
], NgEventstoreListingComponent.prototype, "loadingOffset", void 0);
tslib_1.__decorate([
    Input()
], NgEventstoreListingComponent.prototype, "debugging", void 0);
NgEventstoreListingComponent = tslib_1.__decorate([
    Component({
        selector: 'lib-ng-eventstore-listing',
        template: "<!-- <div *ngIf=\"listHeaderGroups && listHeaderGroups.groups && listHeaderGroups.groups.length > 0\"  [class]=\"'row ' + (listHeaderGroups && listHeaderGroups.generalRowClassName ? listHeaderGroups.generalRowClassName : '')\">\n  <div class=\"col-12\">\n    <div class=\"header bg-white p-2\">\n      <div [class]=\"'row ' + listHeaderGroups.generalRowClassName\">\n        <div *ngFor=\"let listHeaderGroup of listHeaderGroups.groups\" [class]=\"listHeaderGroup.className\">\n          <div [class]=\"'row ' + listHeaderGroups.generalRowClassName\">\n            <div *ngFor=\"let listHeader of listHeaderGroup.listHeaders\" [class]=\"listHeader.className\">\n              <span (click)=\"onSort(listHeader.sortProperty)\" [ngClass]=\"{ 'sort-header': listHeader.sortProperty }\">{{ listHeader.displayName }} <i *ngIf=\"sortFields[listHeader.sortProperty] && sortFields[listHeader.sortProperty].icon\" [class]=\"'sort-icon ' + sortFields[listHeader.sortProperty].icon\"></i></span>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div> -->\n<!-- <div [class]=\"'row ' + (listHeaderGroups && listHeaderGroups.generalRowClassName) ? listHeaderGroups.generalRowClassName : ''\" *ngFor=\"let item of dataList; trackBy: trackByFn\"> -->\n<div class=\"row\" *ngFor=\"let item of _dataList; trackBy: trackByFn\">\n  <div class=\"col-12\">\n    <lib-item-template-holder\n      [data]=\"item\"\n      [itemComponentClass]=\"itemComponentClass\"\n      [lookups]=\"lookups\"\n      (updateEmitter)=\"_onUpdate($event)\"\n      (getLookupsEmitter)=\"_onGetLookups($event)\"\n      (showModalEmitter)=\"_onShowModal($event)\"\n      (deleteEmitter)=\"_onDelete($event)\">\n    </lib-item-template-holder>\n  </div>\n</div>\n<div class=\"row\" *ngIf=\"(!_dataCount || _dataCount === 0) && !_isLoading\">\n  <div class=\"col-12\">\n    <div class=\"row\">\n      <div class=\"col-12 no-results-container\">\n        <div class=\"text-center text-secondary\">\n          <span class=\"italic\">{{ emptyListDisplayText }}</span>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n\n<div [id]=\"'ng-eventstore-listing-overlay-' + _id\" class=\"ng-eventstore-listing-overlay\">\n  <div [id]=\"'ng-eventstore-listing-overlay-subject-' + _id\" class=\"ng-eventstore-listing-overlay-subject\" [ngStyle]=\"{ top:  loadingOffset }\">\n      <div class=\"ng-eventstore-listing-cssload-container\">\n        <div class=\"ng-eventstore-listing-cssload-speeding-wheel\"></div>\n      </div>\n  </div>\n</div>\n",
        changeDetection: ChangeDetectionStrategy.OnPush,
        styles: [".ng-eventstore-listing-overlay{position:absolute;width:100%;height:100%;top:0;left:0;right:0;bottom:0;background-color:#efefef;opacity:.7;z-index:10;display:none}.ng-eventstore-listing-overlay-subject{position:absolute;left:50%;font-size:50px;color:transparent;transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);text-align:center}.ng-eventstore-listing-cssload-container{width:100%;height:49px;text-align:center}.ng-eventstore-listing-cssload-speeding-wheel{width:49px;height:49px;margin:0 auto;border:3px solid #3b356e;border-radius:50%;border-left-color:transparent;border-right-color:transparent;animation:475ms linear infinite cssload-spin;-o-animation:475ms linear infinite cssload-spin;-ms-animation:cssload-spin 475ms infinite linear;-webkit-animation:475ms linear infinite cssload-spin;-moz-animation:475ms linear infinite cssload-spin}@keyframes cssload-spin{100%{transform:rotate(360deg)}}@-webkit-keyframes cssload-spin{100%{transform:rotate(360deg)}}"]
    }),
    tslib_1.__param(0, Inject(JQ_TOKEN))
], NgEventstoreListingComponent);
export { NgEventstoreListingComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctZXZlbnRzdG9yZS1saXN0aW5nLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25nLWV2ZW50c3RvcmUtbGlzdGluZy8iLCJzb3VyY2VzIjpbIm5nLWV2ZW50c3RvcmUtbGlzdGluZy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMxQyxPQUFPLEVBQ0wsU0FBUyxFQUNULE1BQU0sRUFDTixLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFDWixTQUFTLEVBQ1QsYUFBYSxFQUNiLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULE1BQU0sRUFDUCxNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBSSxHQUFHLElBQUksS0FBSyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDekUsT0FBTyxFQUFrQixPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDL0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBZ0JyRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDMUQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzlELE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBRXZFLE9BQU8sS0FBSyxTQUFTLE1BQU0sV0FBVyxDQUFDO0FBRXZDLE9BQU8sUUFBUSxNQUFNLG1CQUFtQixDQUFDO0FBR3pDLE9BQU8sTUFBTSxNQUFNLGlCQUFpQixDQUFDO0FBR3JDLE9BQU8sS0FBSyxPQUFPLE1BQU0sZ0JBQWdCLENBQUM7QUFFMUMsT0FBTyxNQUFNLE1BQU0sWUFBWSxDQUFDO0FBVWhDLElBQWEsNEJBQTRCLEdBQXpDLE1BQWEsNEJBQTRCO0lBMkt2QyxZQUMyQixDQUFNLEVBQ3ZCLGlCQUFvQyxFQUNwQyxhQUE0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MEQ7QUFDekQ7SUFBUixLQUFLLEVBQUU7c0VBQTBCO0FBQ3pCO0lBQVIsS0FBSyxFQUFFOzZEQUEwQjtBQUN6QjtJQUFSLEtBQUssRUFBRTswREFBcUI7QUFDcEI7SUFBUixLQUFLLEVBQUU7K0RBQWU7QUFDZDtJQUFSLEtBQUssRUFBRTtrRUFBc0I7QUFDckI7SUFBUixLQUFLLEVBQUU7c0VBQTJCO0FBQzFCO0lBQVIsS0FBSyxFQUFFOzBFQUFxQztBQUNwQztJQUFSLEtBQUssRUFBRTtpRUFBa0I7QUFDakI7SUFBUixLQUFLLEVBQUU7a0ZBQTZEO0FBQzVEO0lBQVIsS0FBSyxFQUFFOzBFQUE2QjtBQUM1QjtJQUFSLEtBQUssRUFBRTs2RUFBaUM7QUFDaEM7SUFBUixLQUFLLEVBQUU7a0VBQXdCO0FBQ3ZCO0lBQVIsS0FBSyxFQUFFO21FQUF5QjtBQUV4QjtJQUFSLEtBQUssRUFBRTsrREFBbUI7QUFoQ2hCLDRCQUE0QjtJQVJ4QyxTQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsMkJBQTJCO1FBQ3JDLHkvRUFBcUQ7UUFJckQsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07O0tBQ2hELENBQUM7SUE2S0csbUJBQUEsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0dBNUtSLDRCQUE0QixDQTZoQnhDO1NBN2hCWSw0QkFBNEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBIZWxwZXJzIH0gZnJvbSAnLi91dGlscy9oZWxwZXJzJztcbmltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgT25Jbml0LFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBFdmVudEVtaXR0ZXIsXG4gIE9uQ2hhbmdlcyxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBPbkRlc3Ryb3ksXG4gIEluamVjdFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgc3dpdGNoTWFwLCBkZWJvdW5jZVRpbWUgLCAgbWFwIGFzIHJ4TWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uICwgIFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IEpRX1RPS0VOIH0gZnJvbSAnLi9zZXJ2aWNlcy9qcXVlcnkuc2VydmljZSc7XG5cbmltcG9ydCB7XG4gIFN1YnNjcmlwdGlvbkNvbmZpZ3VyYXRpb24sXG4gIFNjcmlwdCxcbiAgUGxheWJhY2tMaXN0LFxuICBSb3dJdGVtLFxuICBGaWx0ZXIsXG4gIFF1ZXJ5LFxuICBTb3J0LFxuICBQbGF5YmFja0xpc3RSZXF1ZXN0LFxuICBDdXN0b21QbGF5YmFja0NvbmZpZ3VyYXRpb24sXG4gIFBsYXliYWNrTGlzdFJlc3BvbnNlXG59IGZyb20gJy4vbW9kZWxzJztcblxuXG5pbXBvcnQgeyBTY3JpcHRTZXJ2aWNlIH0gZnJvbSAnLi9zZXJ2aWNlcy9zY3JpcHQuc2VydmljZSc7XG5pbXBvcnQgeyBQbGF5YmFja1NlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2VzL3BsYXliYWNrLnNlcnZpY2UnO1xuaW1wb3J0IHsgUGxheWJhY2tMaXN0U2VydmljZSB9IGZyb20gJy4vc2VydmljZXMvcGxheWJhY2stbGlzdC5zZXJ2aWNlJztcblxuaW1wb3J0ICogYXMgSW1tdXRhYmxlIGZyb20gJ2ltbXV0YWJsZSc7XG5pbXBvcnQgX2RlZmF1bHRzRGVlcCBmcm9tICdsb2Rhc2gtZXMvZGVmYXVsdHNEZWVwJztcbmltcG9ydCBfaXNFbXB0eSBmcm9tICdsb2Rhc2gtZXMvaXNFbXB0eSc7XG5pbXBvcnQgX2lzRXF1YWwgZnJvbSAnbG9kYXNoLWVzL2lzRXF1YWwnO1xuaW1wb3J0IF9jbG9uZURlZXAgZnJvbSAnbG9kYXNoLWVzL2Nsb25lRGVlcCc7XG5pbXBvcnQgX2Nsb25lIGZyb20gJ2xvZGFzaC1lcy9jbG9uZSc7XG5pbXBvcnQgX3VuaXEgZnJvbSAnbG9kYXNoLWVzL3VuaXEnO1xuaW1wb3J0IF9tZXJnZSBmcm9tICdsb2Rhc2gtZXMvZGVmYXVsdHMnO1xuaW1wb3J0ICogYXMgbW9tZW50XyBmcm9tICdtb21lbnQtbWluaS10cyc7XG5cbmltcG9ydCBzYXZlQXMgZnJvbSAnZmlsZS1zYXZlcic7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2xpYi1uZy1ldmVudHN0b3JlLWxpc3RpbmcnLFxuICB0ZW1wbGF0ZVVybDogJy4vbmctZXZlbnRzdG9yZS1saXN0aW5nLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbXG4gICAgJy4vbmctZXZlbnRzdG9yZS1saXN0aW5nLmNvbXBvbmVudC5jc3MnXG4gIF0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG59KVxuZXhwb3J0IGNsYXNzIE5nRXZlbnRzdG9yZUxpc3RpbmdDb21wb25lbnRcbiAgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95IHtcbiAgQE91dHB1dCgpIHVwZGF0ZUVtaXR0ZXI6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgZ2V0TG9va3Vwc0VtaXR0ZXI6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgc2hvd01vZGFsRW1pdHRlcjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBkZWxldGVFbWl0dGVyOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIHBsYXliYWNrTGlzdExvYWRlZEVtaXR0ZXI6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgbmV3SXRlbU5vdGlmeUVtaXR0ZXI6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgcmVtb3ZlZEl0ZW1Ob3RpZnlFbWl0dGVyOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIGdldFBsYXliYWNrTElzdEVycm9yRW1pdHRlcjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgQElucHV0KCkgaXRlbUNvbXBvbmVudENsYXNzOiBhbnk7XG4gIEBJbnB1dCgpIGxvb2t1cHMgPSB7fTtcbiAgQElucHV0KCkgc29ja2V0VXJsOiBzdHJpbmc7XG4gIEBJbnB1dCgpIHBsYXliYWNrTGlzdEJhc2VVcmw6IHN0cmluZztcbiAgQElucHV0KCkgc2NyaXB0U3RvcmU6IFNjcmlwdFtdO1xuICBASW5wdXQoKSBpdGVtU3Vic2NyaXB0aW9uQ29uZmlndXJhdGlvbnM6IFN1YnNjcmlwdGlvbkNvbmZpZ3VyYXRpb25bXSA9IFtdO1xuICBASW5wdXQoKSBsaXN0U3Vic2NyaXB0aW9uQ29uZmlndXJhdGlvbjogU3Vic2NyaXB0aW9uQ29uZmlndXJhdGlvbjtcbiAgQElucHV0KCkgcGxheWJhY2tMaXN0TmFtZTogc3RyaW5nO1xuICBASW5wdXQoKSBmaWx0ZXJzOiBGaWx0ZXJbXSA9IG51bGw7XG4gIEBJbnB1dCgpIHNvcnQ6IFNvcnRbXSA9IG51bGw7XG4gIEBJbnB1dCgpIHBhZ2VJbmRleCA9IDE7XG4gIEBJbnB1dCgpIGl0ZW1zUGVyUGFnZTogbnVtYmVyO1xuICBASW5wdXQoKSByZXNwb25zZUJhc2VQYXRoID0gJ2RhdGEnO1xuICBASW5wdXQoKSBlbXB0eUxpc3REaXNwbGF5VGV4dCA9ICdObyBSZXN1bHRzJztcbiAgQElucHV0KCkgY3N2RmlsZU5hbWUgPSAnJztcbiAgQElucHV0KCkgY3VzdG9tUGxheWJhY2tDb25maWd1cmF0aW9uczogQ3VzdG9tUGxheWJhY2tDb25maWd1cmF0aW9uW107XG4gIEBJbnB1dCgpIGVuYWJsZUxvYWRpbmdPdmVybGF5ID0gdHJ1ZTtcbiAgQElucHV0KCkgbG9hZGluZ1RvcEJvdW5kU2VsZWN0b3I6IHN0cmluZztcbiAgQElucHV0KCkgbWluSGVpZ2h0Q3NzID0gJzUwMHB4JztcbiAgQElucHV0KCkgbG9hZGluZ09mZnNldCA9ICcyMDBweCc7XG5cbiAgQElucHV0KCkgZGVidWdnaW5nID0gZmFsc2U7XG5cbiAgX2RhdGFMaXN0OiBJbW11dGFibGUuTGlzdDxSb3dJdGVtPjtcbiAgX2RhdGFDb3VudDogbnVtYmVyO1xuICBfZGF0YVRvdGFsQ291bnQ6IG51bWJlcjtcbiAgX3ByZXZpb3VzS2V5OiBzdHJpbmc7XG4gIF9uZXh0S2V5OiBzdHJpbmc7XG4gIF9wcmV2aW91c1BhZ2VJbmRleDogbnVtYmVyO1xuICBfaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgX2lzTG9hZGluZyA9IGZhbHNlO1xuICBfZ2V0UGxheWJhY2tMaXN0U3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIF9nZXRQbGF5YmFja0xpc3RTdWJqZWN0OiBTdWJqZWN0PFBsYXliYWNrTGlzdFJlcXVlc3Q+ID0gbmV3IFN1YmplY3QoKTtcbiAgX2V4cG9ydFBsYXliYWNrTGlzdFN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICBfZXhwb3J0UGxheWJhY2tMaXN0U3ViamVjdDogU3ViamVjdDxhbnk+ID0gbmV3IFN1YmplY3QoKTtcbiAgX3BsYXliYWNrU3Vic2NyaXB0aW9uVG9rZW5zOiBzdHJpbmdbXSA9IFtdO1xuICBfcGxheWJhY2tMaXN0OiBQbGF5YmFja0xpc3QgPSB7XG4gICAgZ2V0OiAocm93SWQ6IHN0cmluZywgY2FsbGJhY2s6IChlcnIsIGl0ZW0pID0+IHZvaWQpID0+IHtcbiAgICAgIGNvbnN0IHJvd0luZGV4ID0gdGhpcy5fZGF0YUxpc3QuZmluZEluZGV4KCh2YWx1ZTogYW55KSA9PiB7XG4gICAgICAgIHJldHVybiB2YWx1ZS5nZXQoJ3Jvd0lkJykgPT09IHJvd0lkO1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChyb3dJbmRleCA+IC0xKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLl9kYXRhTGlzdC5nZXQocm93SW5kZXgpO1xuICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgIGNhbGxiYWNrKG51bGwsIChkYXRhIGFzIGFueSkudG9KUygpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjYWxsYmFjayhudWxsLCB7fSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihgUm93IHdpdGggcm93SWQ6ICR7cm93SW5kZXh9IGRvZXMgbm90IGV4aXN0YCksIG51bGwpO1xuICAgICAgfVxuICAgIH0sXG4gICAgYWRkOiAoXG4gICAgICByb3dJZDogc3RyaW5nLFxuICAgICAgcmV2aXNpb246IG51bWJlcixcbiAgICAgIGRhdGE6IGFueSxcbiAgICAgIG1ldGE6IGFueSxcbiAgICAgIGNhbGxiYWNrOiAoZXJyPzogYW55KSA9PiB2b2lkXG4gICAgKSA9PiB7XG4gICAgICAvLyBjb25zdCBuZXdFbnRyeSA9IHtcbiAgICAgIC8vICAgcm93SWQ6IHJvd0lkLFxuICAgICAgLy8gICByZXZpc2lvbjogcmV2aXNpb24sXG4gICAgICAvLyAgIGRhdGE6IGRhdGEsXG4gICAgICAvLyAgIG1ldGE6IG1ldGEsXG4gICAgICAvLyB9O1xuICAgICAgLy8gdGhpcy5kYXRhTGlzdCA9IHRoaXMuZGF0YUxpc3QucHVzaChJbW11dGFibGUuZnJvbUpTKG5ld0VudHJ5KSk7XG4gICAgICAvLyB0aGlzLmNoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICAgIC8vIERvIHJlZnJlc2ggdHJpZ2dlclxuICAgICAgY29uc3QgbmV3SXRlbSA9IHtcbiAgICAgICAgcm93SWQsXG4gICAgICAgIHJldmlzaW9uLFxuICAgICAgICBkYXRhLFxuICAgICAgICBtZXRhXG4gICAgICB9O1xuICAgICAgdGhpcy5uZXdJdGVtTm90aWZ5RW1pdHRlci5lbWl0KG5ld0l0ZW0pO1xuICAgICAgY2FsbGJhY2soKTtcbiAgICB9LFxuICAgIHVwZGF0ZTogKFxuICAgICAgcm93SWQ6IHN0cmluZyxcbiAgICAgIHJldmlzaW9uOiBudW1iZXIsXG4gICAgICBvbGREYXRhOiBhbnksXG4gICAgICBuZXdEYXRhOiBhbnksXG4gICAgICBtZXRhOiBhbnksXG4gICAgICBjYWxsYmFjazogKGVycj8pID0+IHZvaWRcbiAgICApID0+IHtcbiAgICAgIGNvbnN0IHJvd0luZGV4ID0gdGhpcy5fZGF0YUxpc3QuZmluZEluZGV4KCh2YWx1ZTogYW55KSA9PiB7XG4gICAgICAgIHJldHVybiB2YWx1ZS5nZXQoJ3Jvd0lkJykgPT09IHJvd0lkO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIG9sZERhdGEgaXMgSW1tdXRhYmxlXG4gICAgICBjb25zdCBuZXdFbnRyeSA9IEltbXV0YWJsZS5mcm9tSlMoe1xuICAgICAgICByb3dJZDogcm93SWQsXG4gICAgICAgIHJldmlzaW9uOiByZXZpc2lvbixcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIC4uLm9sZERhdGEsXG4gICAgICAgICAgLi4ubmV3RGF0YSxcbiAgICAgICAgfSxcbiAgICAgICAgbWV0YTogbWV0YSxcbiAgICAgIH0pO1xuXG4gICAgICBpZiAodGhpcy5kZWJ1Z2dpbmcpIHtcbiAgICAgICAgY29uc29sZS5sb2cobmV3RW50cnkpO1xuICAgICAgfVxuXG4gICAgICBpZiAocm93SW5kZXggPiAtMSkge1xuICAgICAgICBpZiAodGhpcy5kZWJ1Z2dpbmcpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhyb3dJbmRleCk7XG4gICAgICAgICAgY29uc29sZS5sb2cobmV3RW50cnkpO1xuXG4gICAgICAgICAgY29uc29sZS5sb2codGhpcy5fZGF0YUxpc3QudG9KUygpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9kYXRhTGlzdCA9IHRoaXMuX2RhdGFMaXN0LnNldChyb3dJbmRleCwgbmV3RW50cnkpO1xuXG4gICAgICAgIGlmICh0aGlzLmRlYnVnZ2luZykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuX2RhdGFMaXN0LnRvSlMoKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoYFJvdyB3aXRoIHJvd0lkOiAke3Jvd0luZGV4fSBkb2VzIG5vdCBleGlzdGApKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGRlbGV0ZTogKHJvd0lkOiBzdHJpbmcsIGNhbGxiYWNrOiAoZXJyb3I/OiBhbnkpID0+IHZvaWQpID0+IHtcbiAgICAgIGNvbnN0IHJvd0luZGV4ID0gdGhpcy5fZGF0YUxpc3QuZmluZEluZGV4KCh2YWx1ZTogYW55KSA9PiB7XG4gICAgICAgIHJldHVybiB2YWx1ZS5nZXQoJ3Jvd0lkJykgPT09IHJvd0lkO1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChyb3dJbmRleCA+IC0xKSB7XG4gICAgICAgIC8vIHRoaXMuX2RhdGFMaXN0ID0gdGhpcy5fZGF0YUxpc3QucmVtb3ZlKHJvd0luZGV4KTtcbiAgICAgICAgdGhpcy5yZW1vdmVkSXRlbU5vdGlmeUVtaXR0ZXIuZW1pdChyb3dJZCk7XG4gICAgICAgIGNhbGxiYWNrKG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKGBSb3cgd2l0aCByb3dJZDogJHtyb3dJbmRleH0gZG9lcyBub3QgZXhpc3RgKSk7XG4gICAgICB9XG4gICAgfSxcbiAgfTtcblxuICBfaWQ6IHN0cmluZyA9IEhlbHBlcnMuZ2VuZXJhdGVUb2tlbigpO1xuXG4gIF9zdGF0ZUZ1bmN0aW9ucyA9IHtcbiAgICBnZXRTdGF0ZTogKGlkOiBzdHJpbmcpID0+IHtcbiAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fZGF0YUxpc3QuZmluZEluZGV4KChyb3c6IGFueSkgPT4ge1xuICAgICAgICByZXR1cm4gcm93LmdldCgncm93SWQnKSA9PT0gaWQ7XG4gICAgICB9KTtcbiAgICAgIGlmIChpbmRleCA+IDApIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLl9kYXRhTGlzdC5nZXQoaW5kZXgpIGFzIGFueSkudG9KUygpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge307XG4gICAgfSxcbiAgICBzZXRTdGF0ZTogKGlkOiBzdHJpbmcsIGRhdGE6IGFueSkgPT4ge1xuICAgICAgY29uc3QgaW5kZXggPSB0aGlzLl9kYXRhTGlzdC5maW5kSW5kZXgoKHJvdzogYW55KSA9PiB7XG4gICAgICAgIHJldHVybiByb3cuZ2V0KCdyb3dJZCcpID09PSBpZDtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fZGF0YUxpc3QgPSB0aGlzLl9kYXRhTGlzdC5zZXQoaW5kZXgsIEltbXV0YWJsZS5mcm9tSlMoZGF0YSkpO1xuICAgICAgdGhpcy5jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9LFxuICB9O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBJbmplY3QoSlFfVE9LRU4pIHB1YmxpYyAkOiBhbnksXG4gICAgcHJpdmF0ZSBjaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJpdmF0ZSBzY3JpcHRTZXJ2aWNlOiBTY3JpcHRTZXJ2aWNlLFxuICAgIHByaXZhdGUgcGxheWJhY2tTZXJ2aWNlOiBQbGF5YmFja1NlcnZpY2UsXG4gICAgcHJpdmF0ZSBwbGF5YmFja0xpc3RTZXJ2aWNlOiBQbGF5YmFja0xpc3RTZXJ2aWNlXG4gICkge31cblxuICBhc3luYyBuZ09uSW5pdCgpIHtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGlmICghc2VsZi5faW5pdGlhbGl6ZWQpIHtcbiAgICAgIHRoaXMuX2luaXRpYWxpemVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuX2xvYWRTY3JpcHRzKCkudGhlbigoKSA9PiB7XG4gICAgICAgIHRoaXMuX2luaXRpYWxpemVSZXF1ZXN0cygpO1xuICAgICAgICB0aGlzLnBsYXliYWNrU2VydmljZS5pbml0KHRoaXMuc29ja2V0VXJsKTtcbiAgICAgICAgY29uc3QgY2hhbmdlc0tleXMgPSBPYmplY3Qua2V5cyhjaGFuZ2VzKTtcbiAgICAgICAgY2hhbmdlc0tleXMuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgc2VsZltrZXldID0gY2hhbmdlc1trZXldLmN1cnJlbnRWYWx1ZTtcbiAgICAgICAgICBzd2l0Y2ggKGtleSkge1xuICAgICAgICAgICAgY2FzZSAncGFnZUluZGV4JzpcbiAgICAgICAgICAgIGNhc2UgJ2ZpbHRlcnMnOlxuICAgICAgICAgICAgY2FzZSAnc29ydCc6IHtcbiAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0UGxheWJhY2tMaXN0KCk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBjaGFuZ2VzS2V5cyA9IE9iamVjdC5rZXlzKGNoYW5nZXMpO1xuICAgICAgY2hhbmdlc0tleXMuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgIGlmIChrZXkgPT09ICdwYWdlSW5kZXgnKSB7XG4gICAgICAgICAgc2VsZi5fcHJldmlvdXNQYWdlSW5kZXggPSBjaGFuZ2VzW2tleV0ucHJldmlvdXNWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBzZWxmW2tleV0gPSBjaGFuZ2VzW2tleV0uY3VycmVudFZhbHVlO1xuICAgICAgICBzd2l0Y2ggKGtleSkge1xuICAgICAgICAgIGNhc2UgJ3BhZ2VJbmRleCc6XG4gICAgICAgICAgY2FzZSAnZmlsdGVycyc6XG4gICAgICAgICAgY2FzZSAnc29ydCc6XG4gICAgICAgICAgY2FzZSAncGxheWJhY2tMaXN0TmFtZSc6IHtcbiAgICAgICAgICAgIHRoaXMucmVxdWVzdFBsYXliYWNrTGlzdCgpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX3Jlc2V0U3Vic2NyaXB0aW9ucygpO1xuICAgIHRoaXMucGxheWJhY2tTZXJ2aWNlLnJlc2V0Q3VzdG9tUGxheWJhY2tzKCk7XG4gICAgdGhpcy5faW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgfVxuXG4gIHRyYWNrQnlGbihpbmRleDogbnVtYmVyLCBpdGVtOiBhbnkpIHtcbiAgICByZXR1cm4gaXRlbS5nZXQoJ3Jvd0lkJyk7XG4gIH1cblxuICBwcml2YXRlIF9pbml0aWFsaXplUmVxdWVzdHMoKTogdm9pZCB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgc2VsZi5fZ2V0UGxheWJhY2tMaXN0U3Vic2NyaXB0aW9uID0gc2VsZi5fZ2V0UGxheWJhY2tMaXN0U3ViamVjdFxuICAgICAgLnBpcGUoXG4gICAgICAgIGRlYm91bmNlVGltZSgxMDApLFxuICAgICAgICBzd2l0Y2hNYXAoKHBhcmFtcykgPT4ge1xuICAgICAgICAgIHJldHVybiBzZWxmLnBsYXliYWNrTGlzdFNlcnZpY2UuZ2V0UGxheWJhY2tMaXN0KFxuICAgICAgICAgICAgc2VsZi5wbGF5YmFja0xpc3RCYXNlVXJsLFxuICAgICAgICAgICAgcGFyYW1zLnBsYXliYWNrTGlzdE5hbWUsXG4gICAgICAgICAgICBwYXJhbXMuc3RhcnRJbmRleCxcbiAgICAgICAgICAgIHBhcmFtcy5saW1pdCxcbiAgICAgICAgICAgIHBhcmFtcy5maWx0ZXJzLFxuICAgICAgICAgICAgcGFyYW1zLnNvcnQsXG4gICAgICAgICAgICBwYXJhbXMucHJldmlvdXNLZXksXG4gICAgICAgICAgICBwYXJhbXMubmV4dEtleVxuICAgICAgICAgICk7XG4gICAgICAgIH0pXG4gICAgICApXG4gICAgICAuc3Vic2NyaWJlKChyZXM6IGFueSkgPT4ge1xuICAgICAgICBzZWxmLl9kYXRhTGlzdCA9IEltbXV0YWJsZS5mcm9tSlMocmVzLnJvd3MpO1xuICAgICAgICBzZWxmLl9kYXRhQ291bnQgPSByZXMucm93cy5sZW5ndGg7XG4gICAgICAgIHNlbGYuX2RhdGFUb3RhbENvdW50ID0gcmVzLmNvdW50O1xuICAgICAgICBzZWxmLl9wcmV2aW91c0tleSA9IHJlcy5wcmV2aW91c0tleTtcbiAgICAgICAgc2VsZi5fbmV4dEtleSA9IHJlcy5uZXh0S2V5O1xuXG4gICAgICAgIHNlbGYuX3Jlc2V0U3Vic2NyaXB0aW9ucygpO1xuICAgICAgICBzZWxmLl9pbml0U3Vic2NyaXB0aW9ucygpO1xuICAgICAgICBzZWxmLl9pbml0Q3VzdG9tUGxheWJhY2tDb25maWd1cmF0aW9ucygpO1xuXG4gICAgICAgIHNlbGYuY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuXG4gICAgICAgIHNlbGYucGxheWJhY2tMaXN0TG9hZGVkRW1pdHRlci5lbWl0KHtcbiAgICAgICAgICB0b3RhbEl0ZW1zOiBzZWxmLl9kYXRhVG90YWxDb3VudCxcbiAgICAgICAgICBkYXRhQ291bnQ6IHNlbGYuX2RhdGFDb3VudCxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHNlbGYuZW5hYmxlTG9hZGluZ092ZXJsYXkpIHtcbiAgICAgICAgICBzZWxmLmhpZGVMb2FkaW5nT3ZlcmxheSgpO1xuICAgICAgICB9XG4gICAgICAgIHNlbGYuX2lzTG9hZGluZyA9IGZhbHNlO1xuICAgICAgfSwgKGVycm9yOiBhbnkpID0+IHtcbiAgICAgICAgc2VsZi5nZXRQbGF5YmFja0xJc3RFcnJvckVtaXR0ZXIuZW1pdChlcnJvcik7XG4gICAgICAgIGlmIChzZWxmLmVuYWJsZUxvYWRpbmdPdmVybGF5KSB7XG4gICAgICAgICAgc2VsZi5oaWRlTG9hZGluZ092ZXJsYXkoKTtcbiAgICAgICAgfVxuICAgICAgICBzZWxmLl9pc0xvYWRpbmcgPSBmYWxzZTtcbiAgICAgIH0pO1xuXG4gICAgc2VsZi5fZXhwb3J0UGxheWJhY2tMaXN0U3Vic2NyaXB0aW9uID0gc2VsZi5fZXhwb3J0UGxheWJhY2tMaXN0U3ViamVjdFxuICAgIC5waXBlKFxuICAgICAgZGVib3VuY2VUaW1lKDEwMCksXG4gICAgICBzd2l0Y2hNYXAoKHBhcmFtcykgPT4ge1xuICAgICAgICBjb25zdCBwbGF5YmFja0xpc3RSZXF1ZXN0ID0gcGFyYW1zLnBsYXliYWNrTGlzdFJlcXVlc3Q7XG4gICAgICAgIHJldHVybiBzZWxmLnBsYXliYWNrTGlzdFNlcnZpY2UuZ2V0UGxheWJhY2tMaXN0Q3N2KFxuICAgICAgICAgIHNlbGYucGxheWJhY2tMaXN0QmFzZVVybCxcbiAgICAgICAgICBwbGF5YmFja0xpc3RSZXF1ZXN0LnBsYXliYWNrTGlzdE5hbWUsXG4gICAgICAgICAgcGxheWJhY2tMaXN0UmVxdWVzdC5zdGFydEluZGV4LFxuICAgICAgICAgIHBsYXliYWNrTGlzdFJlcXVlc3QubGltaXQsXG4gICAgICAgICAgcGxheWJhY2tMaXN0UmVxdWVzdC5maWx0ZXJzLFxuICAgICAgICAgIHBsYXliYWNrTGlzdFJlcXVlc3Quc29ydCxcbiAgICAgICAgICBwbGF5YmFja0xpc3RSZXF1ZXN0LnR5cGVcbiAgICAgICAgKS5waXBlKFxuICAgICAgICAgIHJ4TWFwKChyZXNwb25zZTogUGxheWJhY2tMaXN0UmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBbcmVzcG9uc2UsIHBhcmFtcy5maWxlTmFtZU92ZXJyaWRlXTtcbiAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgICAgfSlcbiAgICApXG4gICAgLnN1YnNjcmliZSgoW3Jlc3VsdCwgZmlsZU5hbWVPdmVycmlkZV0pID0+IHtcbiAgICAgIGNvbnN0IGNzdiA9IG5ldyBCbG9iKFtyZXN1bHRdLCB7IHR5cGU6ICd0ZXh0L2NzdicgfSk7XG4gICAgICBjb25zdCBtb21lbnQgPSBtb21lbnRfO1xuICAgICAgY29uc3Qgbm93ID0gbW9tZW50KCk7XG4gICAgICBjb25zdCBmaWxlTmFtZSA9IGAke2ZpbGVOYW1lT3ZlcnJpZGUgfHwgdGhpcy5jc3ZGaWxlTmFtZSB8fCB0aGlzLnBsYXliYWNrTGlzdE5hbWV9LSR7bm93LmZvcm1hdCgnWVlZWS1NTS1ERF9ISG1tc3MnKX0uY3N2YDtcbiAgICAgIHNhdmVBcyhjc3YsIGZpbGVOYW1lKTtcbiAgICB9KTtcbiAgfVxuXG4gIF9nZXRQbGF5YmFja0xpc3QoXG4gICAgcGxheWJhY2tMaXN0TmFtZTogc3RyaW5nLFxuICAgIHN0YXJ0SW5kZXg6IG51bWJlcixcbiAgICBsaW1pdDogbnVtYmVyLFxuICAgIGZpbHRlcnM/OiBGaWx0ZXJbXSxcbiAgICBzb3J0PzogU29ydFtdLFxuICAgIHByZXZpb3VzS2V5Pzogc3RyaW5nLFxuICAgIG5leHRLZXk/OiBzdHJpbmdcbiAgKSB7XG4gICAgY29uc3QgcGxheWJhY2tMaXN0UmVxdWVzdFBhcmFtczogUGxheWJhY2tMaXN0UmVxdWVzdCA9IHtcbiAgICAgIHBsYXliYWNrTGlzdE5hbWU6IHBsYXliYWNrTGlzdE5hbWUsXG4gICAgICBzdGFydEluZGV4OiBzdGFydEluZGV4LFxuICAgICAgbGltaXQ6IGxpbWl0LFxuICAgICAgZmlsdGVyczogZmlsdGVycyxcbiAgICAgIHNvcnQ6IHNvcnQsXG4gICAgICBwcmV2aW91c0tleTogcHJldmlvdXNLZXksXG4gICAgICBuZXh0S2V5OiBuZXh0S2V5XG4gICAgfTtcbiAgICB0aGlzLl9pc0xvYWRpbmcgPSB0cnVlO1xuICAgIGlmICh0aGlzLmVuYWJsZUxvYWRpbmdPdmVybGF5KSB7XG4gICAgICB0aGlzLnNob3dMb2FkaW5nT3ZlcmxheSgpO1xuICAgIH1cbiAgICB0aGlzLl9nZXRQbGF5YmFja0xpc3RTdWJqZWN0Lm5leHQocGxheWJhY2tMaXN0UmVxdWVzdFBhcmFtcyk7XG4gIH1cblxuICByZXF1ZXN0UGxheWJhY2tMaXN0KCkge1xuICAgIGxldCBzdGFydEluZGV4O1xuICAgIGlmICh0aGlzLnBhZ2VJbmRleCA9PT0gMSkge1xuICAgICAgdGhpcy5fcHJldmlvdXNQYWdlSW5kZXggPSBudWxsO1xuICAgICAgdGhpcy5fcHJldmlvdXNLZXkgPSBudWxsO1xuICAgICAgdGhpcy5fbmV4dEtleSA9IG51bGw7XG4gICAgICBzdGFydEluZGV4ID0gMDtcbiAgICAgIHRoaXMuX2dldFBsYXliYWNrTGlzdChcbiAgICAgICAgdGhpcy5wbGF5YmFja0xpc3ROYW1lLFxuICAgICAgICBzdGFydEluZGV4LFxuICAgICAgICB0aGlzLml0ZW1zUGVyUGFnZSxcbiAgICAgICAgdGhpcy5maWx0ZXJzLFxuICAgICAgICB0aGlzLnNvcnQsXG4gICAgICAgIG51bGwsXG4gICAgICAgIG51bGxcbiAgICAgICk7XG4gICAgfSBlbHNlIGlmICh0aGlzLl9wcmV2aW91c0tleSAmJiB0aGlzLl9uZXh0S2V5KSB7XG4gICAgICBpZiAodGhpcy5fZGF0YVRvdGFsQ291bnQgLSAodGhpcy5wYWdlSW5kZXggKiB0aGlzLml0ZW1zUGVyUGFnZSkgPD0gMCkge1xuICAgICAgICBzdGFydEluZGV4ID0gMDtcbiAgICAgICAgdGhpcy5fZ2V0UGxheWJhY2tMaXN0KFxuICAgICAgICAgIHRoaXMucGxheWJhY2tMaXN0TmFtZSxcbiAgICAgICAgICBzdGFydEluZGV4LFxuICAgICAgICAgIHRoaXMuaXRlbXNQZXJQYWdlLFxuICAgICAgICAgIHRoaXMuZmlsdGVycyxcbiAgICAgICAgICB0aGlzLnNvcnQsXG4gICAgICAgICAgbnVsbCxcbiAgICAgICAgICAnX19MQVNUJ1xuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IHBhZ2VEZWx0YSA9IHRoaXMucGFnZUluZGV4IC0gdGhpcy5fcHJldmlvdXNQYWdlSW5kZXg7XG4gICAgICAgIGlmIChwYWdlRGVsdGEgPCAwKSB7XG4gICAgICAgICAgcGFnZURlbHRhICo9IC0xO1xuICAgICAgICAgIHN0YXJ0SW5kZXggPSB0aGlzLml0ZW1zUGVyUGFnZSAqIChwYWdlRGVsdGEgLSAxKTtcbiAgICAgICAgICB0aGlzLl9nZXRQbGF5YmFja0xpc3QoXG4gICAgICAgICAgICB0aGlzLnBsYXliYWNrTGlzdE5hbWUsXG4gICAgICAgICAgICBzdGFydEluZGV4LFxuICAgICAgICAgICAgdGhpcy5pdGVtc1BlclBhZ2UsXG4gICAgICAgICAgICB0aGlzLmZpbHRlcnMsXG4gICAgICAgICAgICB0aGlzLnNvcnQsXG4gICAgICAgICAgICB0aGlzLl9wcmV2aW91c0tleSxcbiAgICAgICAgICAgIG51bGxcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN0YXJ0SW5kZXggPSB0aGlzLml0ZW1zUGVyUGFnZSAqIChwYWdlRGVsdGEgLSAxKTtcbiAgICAgICAgICB0aGlzLl9nZXRQbGF5YmFja0xpc3QoXG4gICAgICAgICAgICB0aGlzLnBsYXliYWNrTGlzdE5hbWUsXG4gICAgICAgICAgICBzdGFydEluZGV4LFxuICAgICAgICAgICAgdGhpcy5pdGVtc1BlclBhZ2UsXG4gICAgICAgICAgICB0aGlzLmZpbHRlcnMsXG4gICAgICAgICAgICB0aGlzLnNvcnQsXG4gICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgdGhpcy5fbmV4dEtleVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3RhcnRJbmRleCA9IHRoaXMuaXRlbXNQZXJQYWdlICogKHRoaXMucGFnZUluZGV4IC0gMSk7XG4gICAgICB0aGlzLl9nZXRQbGF5YmFja0xpc3QoXG4gICAgICAgIHRoaXMucGxheWJhY2tMaXN0TmFtZSxcbiAgICAgICAgc3RhcnRJbmRleCxcbiAgICAgICAgdGhpcy5pdGVtc1BlclBhZ2UsXG4gICAgICAgIHRoaXMuZmlsdGVycyxcbiAgICAgICAgdGhpcy5zb3J0LFxuICAgICAgICBudWxsLFxuICAgICAgICBudWxsXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgX2xvYWRTY3JpcHRzKCkge1xuICAgIGlmICh0aGlzLnNjcmlwdFN0b3JlKSB7XG4gICAgICBhd2FpdCB0aGlzLnNjcmlwdFNlcnZpY2UuaW5pdCh0aGlzLnNjcmlwdFN0b3JlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIF9pbml0U3Vic2NyaXB0aW9ucygpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAvLyBQZXIgcm93IHN1YnNjcmlwdGlvbnNcbiAgICAoc2VsZi5pdGVtU3Vic2NyaXB0aW9uQ29uZmlndXJhdGlvbnMgfHwgW10pLmZvckVhY2goKGl0ZW1TdWJzY3JpcHRpb25Db25maWd1cmF0aW9uOiBTdWJzY3JpcHRpb25Db25maWd1cmF0aW9uKSA9PiB7XG4gICAgICBpZiAoaXRlbVN1YnNjcmlwdGlvbkNvbmZpZ3VyYXRpb24pIHtcbiAgICAgICAgc2VsZi5fZGF0YUxpc3QuZm9yRWFjaChhc3luYyAocm93OiBhbnkpID0+IHtcbiAgICAgICAgICBjb25zdCBzdHJlYW1SZXZpc2lvbkZ1bmN0aW9uID0gaXRlbVN1YnNjcmlwdGlvbkNvbmZpZ3VyYXRpb24uc3RyZWFtUmV2aXNpb25GdW5jdGlvbiA/XG4gICAgICAgICAgICBpdGVtU3Vic2NyaXB0aW9uQ29uZmlndXJhdGlvbi5zdHJlYW1SZXZpc2lvbkZ1bmN0aW9uIDogKCkgPT4gK3Jvdy5nZXQoJ3JldmlzaW9uJykgKyAxO1xuXG5cbiAgICAgICAgICBjb25zdCBhZ2dyZWdhdGVJZCA9IGl0ZW1TdWJzY3JpcHRpb25Db25maWd1cmF0aW9uLnJvd0lkRnVuY3Rpb24gP1xuICAgICAgICAgICAgICBpdGVtU3Vic2NyaXB0aW9uQ29uZmlndXJhdGlvbi5yb3dJZEZ1bmN0aW9uKHJvdy50b0pTKCkpIDogcm93LmdldCgncm93SWQnKTtcblxuICAgICAgICAgIGNvbnN0IHF1ZXJ5OiBRdWVyeSA9IF9jbG9uZShpdGVtU3Vic2NyaXB0aW9uQ29uZmlndXJhdGlvbi5xdWVyeSk7XG4gICAgICAgICAgcXVlcnkuYWdncmVnYXRlSWQgPSBxdWVyeS5hZ2dyZWdhdGVJZC5yZXBsYWNlKFxuICAgICAgICAgICAgL3t7cm93SWR9fS9nLFxuICAgICAgICAgICAgYWdncmVnYXRlSWRcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgY29uc3QgcGxheWJhY2tTdWJzY3JpcHRpb25Ub2tlbiA9IGF3YWl0IHNlbGYucGxheWJhY2tTZXJ2aWNlLnJlZ2lzdGVyRm9yUGxheWJhY2soXG4gICAgICAgICAgICBzZWxmLFxuICAgICAgICAgICAgaXRlbVN1YnNjcmlwdGlvbkNvbmZpZ3VyYXRpb24ucGxheWJhY2tTY3JpcHROYW1lLFxuICAgICAgICAgICAgcXVlcnksXG4gICAgICAgICAgICBzZWxmLl9zdGF0ZUZ1bmN0aW9ucyxcbiAgICAgICAgICAgIHNlbGYuX3BsYXliYWNrTGlzdCxcbiAgICAgICAgICAgIHN0cmVhbVJldmlzaW9uRnVuY3Rpb24sXG4gICAgICAgICAgICByb3cuZ2V0KCdyb3dJZCcpLFxuICAgICAgICAgICAgaXRlbVN1YnNjcmlwdGlvbkNvbmZpZ3VyYXRpb24uY29uZGl0aW9uLFxuICAgICAgICAgICAgaXRlbVN1YnNjcmlwdGlvbkNvbmZpZ3VyYXRpb24ucm93SWRGdW5jdGlvblxuICAgICAgICAgICk7XG4gICAgICAgICAgdGhpcy5fcGxheWJhY2tTdWJzY3JpcHRpb25Ub2tlbnMucHVzaChwbGF5YmFja1N1YnNjcmlwdGlvblRva2VuKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoc2VsZi5saXN0U3Vic2NyaXB0aW9uQ29uZmlndXJhdGlvbikge1xuICAgICAgLy8gTGlzdCBzdWJzY3JpcHRpb25cbiAgICAgIHRoaXMuX3BsYXliYWNrU3Vic2NyaXB0aW9uVG9rZW5zLnB1c2goXG4gICAgICAgIGF3YWl0IHNlbGYucGxheWJhY2tTZXJ2aWNlLnJlZ2lzdGVyRm9yUGxheWJhY2soXG4gICAgICAgICAgc2VsZixcbiAgICAgICAgICBzZWxmLmxpc3RTdWJzY3JpcHRpb25Db25maWd1cmF0aW9uLnBsYXliYWNrU2NyaXB0TmFtZSxcbiAgICAgICAgICBzZWxmLmxpc3RTdWJzY3JpcHRpb25Db25maWd1cmF0aW9uLnF1ZXJ5LFxuICAgICAgICAgIHNlbGYuX3N0YXRlRnVuY3Rpb25zLFxuICAgICAgICAgIHNlbGYuX3BsYXliYWNrTGlzdCxcbiAgICAgICAgICAoKSA9PiAwXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfaW5pdEN1c3RvbVBsYXliYWNrQ29uZmlndXJhdGlvbnMoKSB7XG4gICAgaWYgKCFfaXNFbXB0eSh0aGlzLmN1c3RvbVBsYXliYWNrQ29uZmlndXJhdGlvbnMpKSB7XG4gICAgICB0aGlzLnBsYXliYWNrU2VydmljZS5yZWdpc3RlckN1c3RvbVBsYXliYWNrcyh0aGlzLmN1c3RvbVBsYXliYWNrQ29uZmlndXJhdGlvbnMpO1xuICAgIH1cbiAgfVxuXG4gIF9yZXNldFN1YnNjcmlwdGlvbnMoKSB7XG4gICAgdGhpcy5wbGF5YmFja1NlcnZpY2UudW5yZWdpc3RlckZvclBsYXliYWNrKHRoaXMuX3BsYXliYWNrU3Vic2NyaXB0aW9uVG9rZW5zKTtcbiAgICB0aGlzLl9wbGF5YmFja1N1YnNjcmlwdGlvblRva2VucyA9IFtdO1xuICB9XG5cbiAgX29uVXBkYXRlKHBheWxvYWQ6IGFueSkge1xuICAgIHRoaXMudXBkYXRlRW1pdHRlci5lbWl0KHBheWxvYWQpO1xuICB9XG5cbiAgX29uR2V0TG9va3VwcyhwYXlsb2FkOiBhbnkpIHtcbiAgICB0aGlzLmdldExvb2t1cHNFbWl0dGVyLmVtaXQocGF5bG9hZCk7XG4gIH1cblxuICBfb25TaG93TW9kYWwocGF5bG9hZDogYW55KSB7XG4gICAgdGhpcy5zaG93TW9kYWxFbWl0dGVyLmVtaXQocGF5bG9hZCk7XG4gIH1cblxuICBfb25EZWxldGUocGF5bG9hZDogYW55KSB7XG4gICAgdGhpcy5kZWxldGVFbWl0dGVyLmVtaXQocGF5bG9hZCk7XG4gIH1cblxuICBleHBvcnRDU1Yob3ZlcnJpZGVQYXJhbXM/OiBQbGF5YmFja0xpc3RSZXF1ZXN0LCBmaWxlTmFtZU92ZXJyaWRlPzogc3RyaW5nKSB7XG4gICAgaWYgKG92ZXJyaWRlUGFyYW1zKSB7XG4gICAgICB0aGlzLl9leHBvcnRQbGF5YmFja0xpc3RTdWJqZWN0Lm5leHQoeyBwbGF5YmFja0xpc3RSZXF1ZXN0OiBvdmVycmlkZVBhcmFtcywgZmlsZU5hbWVPdmVycmlkZTogZmlsZU5hbWVPdmVycmlkZSB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgc3RhcnRJbmRleCA9IHRoaXMuaXRlbXNQZXJQYWdlICogKHRoaXMucGFnZUluZGV4IC0gMSk7XG4gICAgICBjb25zdCBleHBvcnRQbGF5YmFja0xpc3RSZXF1ZXN0UGFyYW1zOiBQbGF5YmFja0xpc3RSZXF1ZXN0ID0ge1xuICAgICAgICBwbGF5YmFja0xpc3ROYW1lOiB0aGlzLnBsYXliYWNrTGlzdE5hbWUsXG4gICAgICAgIHN0YXJ0SW5kZXg6IHN0YXJ0SW5kZXgsXG4gICAgICAgIGxpbWl0OiAxMDAwMDAwLFxuICAgICAgICBmaWx0ZXJzOiB0aGlzLmZpbHRlcnMsXG4gICAgICAgIHNvcnQ6IHRoaXMuc29ydFxuICAgICAgfTtcblxuICAgICAgdGhpcy5fZXhwb3J0UGxheWJhY2tMaXN0U3ViamVjdC5uZXh0KHsgcGxheWJhY2tMaXN0UmVxdWVzdDogZXhwb3J0UGxheWJhY2tMaXN0UmVxdWVzdFBhcmFtcywgZmlsZU5hbWVPdmVycmlkZTogZmlsZU5hbWVPdmVycmlkZSB9KTtcbiAgICB9XG4gIH1cblxuICAvLyBMb2FkaW5nIE92ZXJsYXkgRnVuY3Rpb25zXG4gIGhpZGVMb2FkaW5nT3ZlcmxheSgpIHtcbiAgICBjb25zdCAkID0gdGhpcy4kO1xuICAgICQoJ2JvZHknKS5jc3MoJ292ZXJmbG93JywgJycpO1xuICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnbG9hZGluZy1ib2R5Jyk7XG4gICAgJChgI25nLWV2ZW50c3RvcmUtbGlzdGluZy1vdmVybGF5LSR7dGhpcy5faWR9YCkuaGlkZSgpO1xuICB9XG5cbiAgc2hvd0xvYWRpbmdPdmVybGF5KCkge1xuICAgIGNvbnN0ICQgPSB0aGlzLiQ7XG4gICAgJChgI25nLWV2ZW50c3RvcmUtbGlzdGluZy1vdmVybGF5LSR7dGhpcy5faWR9YCkuc2hvdygpO1xuICAgIGlmICh0aGlzLmxvYWRpbmdUb3BCb3VuZFNlbGVjdG9yID8gdHJ1ZSA6IGZhbHNlKSB7XG4gICAgICB0aGlzLl9maXhMb2FkaW5nT3ZlcmxheVBvc2l0aW9uKCk7XG4gICAgfVxuICB9XG5cbiAgX2ZpeExvYWRpbmdPdmVybGF5UG9zaXRpb24oKSB7XG4gICAgY29uc3QgJCA9IHRoaXMuJDtcbiAgICBjb25zdCB3aW5kb3dZID0gd2luZG93LnBhZ2VZT2Zmc2V0O1xuICAgIGNvbnN0IHBhZ2VIZWFkZXJTZWN0aW9uSGVpZ2h0ID0gNTM7XG4gICAgY29uc3QgcGFnZUhlYWRlclNlY3Rpb25Cb3R0b21ZID0gJCh0aGlzLmxvYWRpbmdUb3BCb3VuZFNlbGVjdG9yKS5vZmZzZXQoKS50b3AgKyBwYWdlSGVhZGVyU2VjdGlvbkhlaWdodDtcbiAgICAkKCdib2R5JykuY3NzKCdvdmVyZmxvdycsICdoaWRkZW4nKTtcbiAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ2xvYWRpbmctYm9keScpO1xuICAgIGlmICh3aW5kb3dZIDwgcGFnZUhlYWRlclNlY3Rpb25Cb3R0b21ZKSB7XG4gICAgICAkKGAjbmctZXZlbnRzdG9yZS1saXN0aW5nLW92ZXJsYXktJHt0aGlzLl9pZH1gKS5jc3MoJ3Bvc2l0aW9uJywgJ2Fic29sdXRlJyk7XG4gICAgICAkKGAjbmctZXZlbnRzdG9yZS1saXN0aW5nLW92ZXJsYXktJHt0aGlzLl9pZH1gKS5jc3MoJ2hlaWdodCcsIGAke3dpbmRvdy5pbm5lckhlaWdodH1weGApO1xuICAgICAgJChgI25nLWV2ZW50c3RvcmUtbGlzdGluZy1vdmVybGF5LSR7dGhpcy5faWR9YCkuY3NzKCd3aWR0aCcsICcxMDAlJyk7XG4gICAgICBjb25zdCBwYWdlSGVhZGVySGVpZ2h0ID0gcGFnZUhlYWRlclNlY3Rpb25IZWlnaHQ7XG4gICAgICAkKGAjbmctZXZlbnRzdG9yZS1saXN0aW5nLW92ZXJsYXktJHt0aGlzLl9pZH1gKS5jc3MoJ21hcmdpbi10b3AnLCBgJHtwYWdlSGVhZGVySGVpZ2h0fXB4YCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICQoYCNuZy1ldmVudHN0b3JlLWxpc3Rpbmctb3ZlcmxheS0ke3RoaXMuX2lkfWApLmNzcygncG9zaXRpb24nLCAnZml4ZWQnKTtcbiAgICAgICQoYCNuZy1ldmVudHN0b3JlLWxpc3Rpbmctb3ZlcmxheS0ke3RoaXMuX2lkfWApLmNzcygnaGVpZ2h0JywgJzEwMCUnKTtcbiAgICAgICQoYCNuZy1ldmVudHN0b3JlLWxpc3Rpbmctb3ZlcmxheS0ke3RoaXMuX2lkfWApLmNzcygnbWFyZ2luLXRvcCcsICcwcHgnKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==