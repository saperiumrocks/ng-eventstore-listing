import { __awaiter, __decorate, __param } from "tslib";
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
                    data: Object.assign(Object.assign({}, oldData), newData),
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
        return __awaiter(this, void 0, void 0, function* () {
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
        return __awaiter(this, void 0, void 0, function* () {
            if (this.scriptStore) {
                yield this.scriptService.init(this.scriptStore);
            }
        });
    }
    _initSubscriptions() {
        return __awaiter(this, void 0, void 0, function* () {
            const self = this;
            // Per row subscriptions
            (self.itemSubscriptionConfigurations || []).forEach((itemSubscriptionConfiguration) => {
                if (itemSubscriptionConfiguration) {
                    self._dataList.forEach((row) => __awaiter(this, void 0, void 0, function* () {
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
__decorate([
    Output()
], NgEventstoreListingComponent.prototype, "updateEmitter", void 0);
__decorate([
    Output()
], NgEventstoreListingComponent.prototype, "getLookupsEmitter", void 0);
__decorate([
    Output()
], NgEventstoreListingComponent.prototype, "showModalEmitter", void 0);
__decorate([
    Output()
], NgEventstoreListingComponent.prototype, "deleteEmitter", void 0);
__decorate([
    Output()
], NgEventstoreListingComponent.prototype, "playbackListLoadedEmitter", void 0);
__decorate([
    Output()
], NgEventstoreListingComponent.prototype, "newItemNotifyEmitter", void 0);
__decorate([
    Output()
], NgEventstoreListingComponent.prototype, "removedItemNotifyEmitter", void 0);
__decorate([
    Output()
], NgEventstoreListingComponent.prototype, "getPlaybackLIstErrorEmitter", void 0);
__decorate([
    Input()
], NgEventstoreListingComponent.prototype, "itemComponentClass", void 0);
__decorate([
    Input()
], NgEventstoreListingComponent.prototype, "lookups", void 0);
__decorate([
    Input()
], NgEventstoreListingComponent.prototype, "socketUrl", void 0);
__decorate([
    Input()
], NgEventstoreListingComponent.prototype, "playbackListBaseUrl", void 0);
__decorate([
    Input()
], NgEventstoreListingComponent.prototype, "scriptStore", void 0);
__decorate([
    Input()
], NgEventstoreListingComponent.prototype, "itemSubscriptionConfigurations", void 0);
__decorate([
    Input()
], NgEventstoreListingComponent.prototype, "listSubscriptionConfiguration", void 0);
__decorate([
    Input()
], NgEventstoreListingComponent.prototype, "playbackListName", void 0);
__decorate([
    Input()
], NgEventstoreListingComponent.prototype, "filters", void 0);
__decorate([
    Input()
], NgEventstoreListingComponent.prototype, "sort", void 0);
__decorate([
    Input()
], NgEventstoreListingComponent.prototype, "pageIndex", void 0);
__decorate([
    Input()
], NgEventstoreListingComponent.prototype, "itemsPerPage", void 0);
__decorate([
    Input()
], NgEventstoreListingComponent.prototype, "responseBasePath", void 0);
__decorate([
    Input()
], NgEventstoreListingComponent.prototype, "emptyListDisplayText", void 0);
__decorate([
    Input()
], NgEventstoreListingComponent.prototype, "csvFileName", void 0);
__decorate([
    Input()
], NgEventstoreListingComponent.prototype, "customPlaybackConfigurations", void 0);
__decorate([
    Input()
], NgEventstoreListingComponent.prototype, "enableLoadingOverlay", void 0);
__decorate([
    Input()
], NgEventstoreListingComponent.prototype, "loadingTopBoundSelector", void 0);
__decorate([
    Input()
], NgEventstoreListingComponent.prototype, "minHeightCss", void 0);
__decorate([
    Input()
], NgEventstoreListingComponent.prototype, "loadingOffset", void 0);
__decorate([
    Input()
], NgEventstoreListingComponent.prototype, "debugging", void 0);
NgEventstoreListingComponent = __decorate([
    Component({
        selector: 'lib-ng-eventstore-listing',
        template: "<!-- <div *ngIf=\"listHeaderGroups && listHeaderGroups.groups && listHeaderGroups.groups.length > 0\"  [class]=\"'row ' + (listHeaderGroups && listHeaderGroups.generalRowClassName ? listHeaderGroups.generalRowClassName : '')\">\n  <div class=\"col-12\">\n    <div class=\"header bg-white p-2\">\n      <div [class]=\"'row ' + listHeaderGroups.generalRowClassName\">\n        <div *ngFor=\"let listHeaderGroup of listHeaderGroups.groups\" [class]=\"listHeaderGroup.className\">\n          <div [class]=\"'row ' + listHeaderGroups.generalRowClassName\">\n            <div *ngFor=\"let listHeader of listHeaderGroup.listHeaders\" [class]=\"listHeader.className\">\n              <span (click)=\"onSort(listHeader.sortProperty)\" [ngClass]=\"{ 'sort-header': listHeader.sortProperty }\">{{ listHeader.displayName }} <i *ngIf=\"sortFields[listHeader.sortProperty] && sortFields[listHeader.sortProperty].icon\" [class]=\"'sort-icon ' + sortFields[listHeader.sortProperty].icon\"></i></span>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div> -->\n<!-- <div [class]=\"'row ' + (listHeaderGroups && listHeaderGroups.generalRowClassName) ? listHeaderGroups.generalRowClassName : ''\" *ngFor=\"let item of dataList; trackBy: trackByFn\"> -->\n<div class=\"row\" *ngFor=\"let item of _dataList; trackBy: trackByFn\">\n  <div class=\"col-12\">\n    <lib-item-template-holder\n      [data]=\"item\"\n      [itemComponentClass]=\"itemComponentClass\"\n      [lookups]=\"lookups\"\n      (updateEmitter)=\"_onUpdate($event)\"\n      (getLookupsEmitter)=\"_onGetLookups($event)\"\n      (showModalEmitter)=\"_onShowModal($event)\"\n      (deleteEmitter)=\"_onDelete($event)\">\n    </lib-item-template-holder>\n  </div>\n</div>\n<div class=\"row\" *ngIf=\"(!_dataCount || _dataCount === 0) && !_isLoading\">\n  <div class=\"col-12\">\n    <div class=\"row\">\n      <div class=\"col-12 no-results-container\">\n        <div class=\"text-center text-secondary\">\n          <span class=\"italic\">{{ emptyListDisplayText }}</span>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n\n<div [id]=\"'ng-eventstore-listing-overlay-' + _id\" class=\"ng-eventstore-listing-overlay\">\n  <div [id]=\"'ng-eventstore-listing-overlay-subject-' + _id\" class=\"ng-eventstore-listing-overlay-subject\" [ngStyle]=\"{ top:  loadingOffset }\">\n      <div class=\"ng-eventstore-listing-cssload-container\">\n        <div class=\"ng-eventstore-listing-cssload-speeding-wheel\"></div>\n      </div>\n  </div>\n</div>\n",
        changeDetection: ChangeDetectionStrategy.OnPush,
        styles: [".ng-eventstore-listing-overlay{position:absolute;width:100%;height:100%;top:0;left:0;right:0;bottom:0;background-color:#efefef;opacity:.7;z-index:10;display:none}.ng-eventstore-listing-overlay-subject{position:absolute;left:50%;font-size:50px;color:transparent;transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);text-align:center}.ng-eventstore-listing-cssload-container{width:100%;height:49px;text-align:center}.ng-eventstore-listing-cssload-speeding-wheel{width:49px;height:49px;margin:0 auto;border:3px solid #3b356e;border-radius:50%;border-left-color:transparent;border-right-color:transparent;animation:475ms linear infinite cssload-spin;-o-animation:475ms linear infinite cssload-spin;-ms-animation:cssload-spin 475ms infinite linear;-webkit-animation:475ms linear infinite cssload-spin;-moz-animation:475ms linear infinite cssload-spin}@keyframes cssload-spin{100%{transform:rotate(360deg)}}@-webkit-keyframes cssload-spin{100%{transform:rotate(360deg)}}"]
    }),
    __param(0, Inject(JQ_TOKEN))
], NgEventstoreListingComponent);
export { NgEventstoreListingComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctZXZlbnRzdG9yZS1saXN0aW5nLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25nLWV2ZW50c3RvcmUtbGlzdGluZy8iLCJzb3VyY2VzIjpbIm5nLWV2ZW50c3RvcmUtbGlzdGluZy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMxQyxPQUFPLEVBQ0wsU0FBUyxFQUNULE1BQU0sRUFDTixLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFDWixTQUFTLEVBQ1QsYUFBYSxFQUNiLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULE1BQU0sRUFDUCxNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBSSxHQUFHLElBQUksS0FBSyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDekUsT0FBTyxFQUFrQixPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDL0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBZ0JyRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDMUQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzlELE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBRXZFLE9BQU8sS0FBSyxTQUFTLE1BQU0sV0FBVyxDQUFDO0FBRXZDLE9BQU8sUUFBUSxNQUFNLG1CQUFtQixDQUFDO0FBR3pDLE9BQU8sTUFBTSxNQUFNLGlCQUFpQixDQUFDO0FBR3JDLE9BQU8sS0FBSyxPQUFPLE1BQU0sZ0JBQWdCLENBQUM7QUFFMUMsT0FBTyxNQUFNLE1BQU0sWUFBWSxDQUFDO0FBVWhDLElBQWEsNEJBQTRCLEdBQXpDLE1BQWEsNEJBQTRCO0lBMkt2QyxZQUMyQixDQUFNLEVBQ3ZCLGlCQUFvQyxFQUNwQyxhQUE0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MEQ7QUFDekQ7SUFBUixLQUFLLEVBQUU7c0VBQTBCO0FBQ3pCO0lBQVIsS0FBSyxFQUFFOzZEQUEwQjtBQUN6QjtJQUFSLEtBQUssRUFBRTswREFBcUI7QUFDcEI7SUFBUixLQUFLLEVBQUU7K0RBQWU7QUFDZDtJQUFSLEtBQUssRUFBRTtrRUFBc0I7QUFDckI7SUFBUixLQUFLLEVBQUU7c0VBQTJCO0FBQzFCO0lBQVIsS0FBSyxFQUFFOzBFQUFxQztBQUNwQztJQUFSLEtBQUssRUFBRTtpRUFBa0I7QUFDakI7SUFBUixLQUFLLEVBQUU7a0ZBQTZEO0FBQzVEO0lBQVIsS0FBSyxFQUFFOzBFQUE2QjtBQUM1QjtJQUFSLEtBQUssRUFBRTs2RUFBaUM7QUFDaEM7SUFBUixLQUFLLEVBQUU7a0VBQXdCO0FBQ3ZCO0lBQVIsS0FBSyxFQUFFO21FQUF5QjtBQUV4QjtJQUFSLEtBQUssRUFBRTsrREFBbUI7QUFoQ2hCLDRCQUE0QjtJQVJ4QyxTQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsMkJBQTJCO1FBQ3JDLHkvRUFBcUQ7UUFJckQsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07O0tBQ2hELENBQUM7SUE2S0csV0FBQSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUE7R0E1S1IsNEJBQTRCLENBNmhCeEM7U0E3aEJZLDRCQUE0QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEhlbHBlcnMgfSBmcm9tICcuL3V0aWxzL2hlbHBlcnMnO1xuaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBPbkluaXQsXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbiAgT25DaGFuZ2VzLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIE9uRGVzdHJveSxcbiAgSW5qZWN0XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBzd2l0Y2hNYXAsIGRlYm91bmNlVGltZSAsICBtYXAgYXMgcnhNYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gLCAgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgSlFfVE9LRU4gfSBmcm9tICcuL3NlcnZpY2VzL2pxdWVyeS5zZXJ2aWNlJztcblxuaW1wb3J0IHtcbiAgU3Vic2NyaXB0aW9uQ29uZmlndXJhdGlvbixcbiAgU2NyaXB0LFxuICBQbGF5YmFja0xpc3QsXG4gIFJvd0l0ZW0sXG4gIEZpbHRlcixcbiAgUXVlcnksXG4gIFNvcnQsXG4gIFBsYXliYWNrTGlzdFJlcXVlc3QsXG4gIEN1c3RvbVBsYXliYWNrQ29uZmlndXJhdGlvbixcbiAgUGxheWJhY2tMaXN0UmVzcG9uc2Vcbn0gZnJvbSAnLi9tb2RlbHMnO1xuXG5cbmltcG9ydCB7IFNjcmlwdFNlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2VzL3NjcmlwdC5zZXJ2aWNlJztcbmltcG9ydCB7IFBsYXliYWNrU2VydmljZSB9IGZyb20gJy4vc2VydmljZXMvcGxheWJhY2suc2VydmljZSc7XG5pbXBvcnQgeyBQbGF5YmFja0xpc3RTZXJ2aWNlIH0gZnJvbSAnLi9zZXJ2aWNlcy9wbGF5YmFjay1saXN0LnNlcnZpY2UnO1xuXG5pbXBvcnQgKiBhcyBJbW11dGFibGUgZnJvbSAnaW1tdXRhYmxlJztcbmltcG9ydCBfZGVmYXVsdHNEZWVwIGZyb20gJ2xvZGFzaC1lcy9kZWZhdWx0c0RlZXAnO1xuaW1wb3J0IF9pc0VtcHR5IGZyb20gJ2xvZGFzaC1lcy9pc0VtcHR5JztcbmltcG9ydCBfaXNFcXVhbCBmcm9tICdsb2Rhc2gtZXMvaXNFcXVhbCc7XG5pbXBvcnQgX2Nsb25lRGVlcCBmcm9tICdsb2Rhc2gtZXMvY2xvbmVEZWVwJztcbmltcG9ydCBfY2xvbmUgZnJvbSAnbG9kYXNoLWVzL2Nsb25lJztcbmltcG9ydCBfdW5pcSBmcm9tICdsb2Rhc2gtZXMvdW5pcSc7XG5pbXBvcnQgX21lcmdlIGZyb20gJ2xvZGFzaC1lcy9kZWZhdWx0cyc7XG5pbXBvcnQgKiBhcyBtb21lbnRfIGZyb20gJ21vbWVudC1taW5pLXRzJztcblxuaW1wb3J0IHNhdmVBcyBmcm9tICdmaWxlLXNhdmVyJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbGliLW5nLWV2ZW50c3RvcmUtbGlzdGluZycsXG4gIHRlbXBsYXRlVXJsOiAnLi9uZy1ldmVudHN0b3JlLWxpc3RpbmcuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFtcbiAgICAnLi9uZy1ldmVudHN0b3JlLWxpc3RpbmcuY29tcG9uZW50LmNzcydcbiAgXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgTmdFdmVudHN0b3JlTGlzdGluZ0NvbXBvbmVudFxuICBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICBAT3V0cHV0KCkgdXBkYXRlRW1pdHRlcjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBnZXRMb29rdXBzRW1pdHRlcjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBzaG93TW9kYWxFbWl0dGVyOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIGRlbGV0ZUVtaXR0ZXI6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgcGxheWJhY2tMaXN0TG9hZGVkRW1pdHRlcjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBuZXdJdGVtTm90aWZ5RW1pdHRlcjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSByZW1vdmVkSXRlbU5vdGlmeUVtaXR0ZXI6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgZ2V0UGxheWJhY2tMSXN0RXJyb3JFbWl0dGVyOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBASW5wdXQoKSBpdGVtQ29tcG9uZW50Q2xhc3M6IGFueTtcbiAgQElucHV0KCkgbG9va3VwcyA9IHt9O1xuICBASW5wdXQoKSBzb2NrZXRVcmw6IHN0cmluZztcbiAgQElucHV0KCkgcGxheWJhY2tMaXN0QmFzZVVybDogc3RyaW5nO1xuICBASW5wdXQoKSBzY3JpcHRTdG9yZTogU2NyaXB0W107XG4gIEBJbnB1dCgpIGl0ZW1TdWJzY3JpcHRpb25Db25maWd1cmF0aW9uczogU3Vic2NyaXB0aW9uQ29uZmlndXJhdGlvbltdID0gW107XG4gIEBJbnB1dCgpIGxpc3RTdWJzY3JpcHRpb25Db25maWd1cmF0aW9uOiBTdWJzY3JpcHRpb25Db25maWd1cmF0aW9uO1xuICBASW5wdXQoKSBwbGF5YmFja0xpc3ROYW1lOiBzdHJpbmc7XG4gIEBJbnB1dCgpIGZpbHRlcnM6IEZpbHRlcltdID0gbnVsbDtcbiAgQElucHV0KCkgc29ydDogU29ydFtdID0gbnVsbDtcbiAgQElucHV0KCkgcGFnZUluZGV4ID0gMTtcbiAgQElucHV0KCkgaXRlbXNQZXJQYWdlOiBudW1iZXI7XG4gIEBJbnB1dCgpIHJlc3BvbnNlQmFzZVBhdGggPSAnZGF0YSc7XG4gIEBJbnB1dCgpIGVtcHR5TGlzdERpc3BsYXlUZXh0ID0gJ05vIFJlc3VsdHMnO1xuICBASW5wdXQoKSBjc3ZGaWxlTmFtZSA9ICcnO1xuICBASW5wdXQoKSBjdXN0b21QbGF5YmFja0NvbmZpZ3VyYXRpb25zOiBDdXN0b21QbGF5YmFja0NvbmZpZ3VyYXRpb25bXTtcbiAgQElucHV0KCkgZW5hYmxlTG9hZGluZ092ZXJsYXkgPSB0cnVlO1xuICBASW5wdXQoKSBsb2FkaW5nVG9wQm91bmRTZWxlY3Rvcjogc3RyaW5nO1xuICBASW5wdXQoKSBtaW5IZWlnaHRDc3MgPSAnNTAwcHgnO1xuICBASW5wdXQoKSBsb2FkaW5nT2Zmc2V0ID0gJzIwMHB4JztcblxuICBASW5wdXQoKSBkZWJ1Z2dpbmcgPSBmYWxzZTtcblxuICBfZGF0YUxpc3Q6IEltbXV0YWJsZS5MaXN0PFJvd0l0ZW0+O1xuICBfZGF0YUNvdW50OiBudW1iZXI7XG4gIF9kYXRhVG90YWxDb3VudDogbnVtYmVyO1xuICBfcHJldmlvdXNLZXk6IHN0cmluZztcbiAgX25leHRLZXk6IHN0cmluZztcbiAgX3ByZXZpb3VzUGFnZUluZGV4OiBudW1iZXI7XG4gIF9pbml0aWFsaXplZCA9IGZhbHNlO1xuICBfaXNMb2FkaW5nID0gZmFsc2U7XG4gIF9nZXRQbGF5YmFja0xpc3RTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgX2dldFBsYXliYWNrTGlzdFN1YmplY3Q6IFN1YmplY3Q8UGxheWJhY2tMaXN0UmVxdWVzdD4gPSBuZXcgU3ViamVjdCgpO1xuICBfZXhwb3J0UGxheWJhY2tMaXN0U3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIF9leHBvcnRQbGF5YmFja0xpc3RTdWJqZWN0OiBTdWJqZWN0PGFueT4gPSBuZXcgU3ViamVjdCgpO1xuICBfcGxheWJhY2tTdWJzY3JpcHRpb25Ub2tlbnM6IHN0cmluZ1tdID0gW107XG4gIF9wbGF5YmFja0xpc3Q6IFBsYXliYWNrTGlzdCA9IHtcbiAgICBnZXQ6IChyb3dJZDogc3RyaW5nLCBjYWxsYmFjazogKGVyciwgaXRlbSkgPT4gdm9pZCkgPT4ge1xuICAgICAgY29uc3Qgcm93SW5kZXggPSB0aGlzLl9kYXRhTGlzdC5maW5kSW5kZXgoKHZhbHVlOiBhbnkpID0+IHtcbiAgICAgICAgcmV0dXJuIHZhbHVlLmdldCgncm93SWQnKSA9PT0gcm93SWQ7XG4gICAgICB9KTtcblxuICAgICAgaWYgKHJvd0luZGV4ID4gLTEpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMuX2RhdGFMaXN0LmdldChyb3dJbmRleCk7XG4gICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgY2FsbGJhY2sobnVsbCwgKGRhdGEgYXMgYW55KS50b0pTKCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHt9KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKGBSb3cgd2l0aCByb3dJZDogJHtyb3dJbmRleH0gZG9lcyBub3QgZXhpc3RgKSwgbnVsbCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBhZGQ6IChcbiAgICAgIHJvd0lkOiBzdHJpbmcsXG4gICAgICByZXZpc2lvbjogbnVtYmVyLFxuICAgICAgZGF0YTogYW55LFxuICAgICAgbWV0YTogYW55LFxuICAgICAgY2FsbGJhY2s6IChlcnI/OiBhbnkpID0+IHZvaWRcbiAgICApID0+IHtcbiAgICAgIC8vIGNvbnN0IG5ld0VudHJ5ID0ge1xuICAgICAgLy8gICByb3dJZDogcm93SWQsXG4gICAgICAvLyAgIHJldmlzaW9uOiByZXZpc2lvbixcbiAgICAgIC8vICAgZGF0YTogZGF0YSxcbiAgICAgIC8vICAgbWV0YTogbWV0YSxcbiAgICAgIC8vIH07XG4gICAgICAvLyB0aGlzLmRhdGFMaXN0ID0gdGhpcy5kYXRhTGlzdC5wdXNoKEltbXV0YWJsZS5mcm9tSlMobmV3RW50cnkpKTtcbiAgICAgIC8vIHRoaXMuY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgLy8gRG8gcmVmcmVzaCB0cmlnZ2VyXG4gICAgICBjb25zdCBuZXdJdGVtID0ge1xuICAgICAgICByb3dJZCxcbiAgICAgICAgcmV2aXNpb24sXG4gICAgICAgIGRhdGEsXG4gICAgICAgIG1ldGFcbiAgICAgIH07XG4gICAgICB0aGlzLm5ld0l0ZW1Ob3RpZnlFbWl0dGVyLmVtaXQobmV3SXRlbSk7XG4gICAgICBjYWxsYmFjaygpO1xuICAgIH0sXG4gICAgdXBkYXRlOiAoXG4gICAgICByb3dJZDogc3RyaW5nLFxuICAgICAgcmV2aXNpb246IG51bWJlcixcbiAgICAgIG9sZERhdGE6IGFueSxcbiAgICAgIG5ld0RhdGE6IGFueSxcbiAgICAgIG1ldGE6IGFueSxcbiAgICAgIGNhbGxiYWNrOiAoZXJyPykgPT4gdm9pZFxuICAgICkgPT4ge1xuICAgICAgY29uc3Qgcm93SW5kZXggPSB0aGlzLl9kYXRhTGlzdC5maW5kSW5kZXgoKHZhbHVlOiBhbnkpID0+IHtcbiAgICAgICAgcmV0dXJuIHZhbHVlLmdldCgncm93SWQnKSA9PT0gcm93SWQ7XG4gICAgICB9KTtcblxuICAgICAgLy8gb2xkRGF0YSBpcyBJbW11dGFibGVcbiAgICAgIGNvbnN0IG5ld0VudHJ5ID0gSW1tdXRhYmxlLmZyb21KUyh7XG4gICAgICAgIHJvd0lkOiByb3dJZCxcbiAgICAgICAgcmV2aXNpb246IHJldmlzaW9uLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgLi4ub2xkRGF0YSxcbiAgICAgICAgICAuLi5uZXdEYXRhLFxuICAgICAgICB9LFxuICAgICAgICBtZXRhOiBtZXRhLFxuICAgICAgfSk7XG5cbiAgICAgIGlmICh0aGlzLmRlYnVnZ2luZykge1xuICAgICAgICBjb25zb2xlLmxvZyhuZXdFbnRyeSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChyb3dJbmRleCA+IC0xKSB7XG4gICAgICAgIGlmICh0aGlzLmRlYnVnZ2luZykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKHJvd0luZGV4KTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhuZXdFbnRyeSk7XG5cbiAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLl9kYXRhTGlzdC50b0pTKCkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2RhdGFMaXN0ID0gdGhpcy5fZGF0YUxpc3Quc2V0KHJvd0luZGV4LCBuZXdFbnRyeSk7XG5cbiAgICAgICAgaWYgKHRoaXMuZGVidWdnaW5nKSB7XG4gICAgICAgICAgY29uc29sZS5sb2codGhpcy5fZGF0YUxpc3QudG9KUygpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihgUm93IHdpdGggcm93SWQ6ICR7cm93SW5kZXh9IGRvZXMgbm90IGV4aXN0YCkpO1xuICAgICAgfVxuICAgIH0sXG4gICAgZGVsZXRlOiAocm93SWQ6IHN0cmluZywgY2FsbGJhY2s6IChlcnJvcj86IGFueSkgPT4gdm9pZCkgPT4ge1xuICAgICAgY29uc3Qgcm93SW5kZXggPSB0aGlzLl9kYXRhTGlzdC5maW5kSW5kZXgoKHZhbHVlOiBhbnkpID0+IHtcbiAgICAgICAgcmV0dXJuIHZhbHVlLmdldCgncm93SWQnKSA9PT0gcm93SWQ7XG4gICAgICB9KTtcblxuICAgICAgaWYgKHJvd0luZGV4ID4gLTEpIHtcbiAgICAgICAgLy8gdGhpcy5fZGF0YUxpc3QgPSB0aGlzLl9kYXRhTGlzdC5yZW1vdmUocm93SW5kZXgpO1xuICAgICAgICB0aGlzLnJlbW92ZWRJdGVtTm90aWZ5RW1pdHRlci5lbWl0KHJvd0lkKTtcbiAgICAgICAgY2FsbGJhY2sobnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoYFJvdyB3aXRoIHJvd0lkOiAke3Jvd0luZGV4fSBkb2VzIG5vdCBleGlzdGApKTtcbiAgICAgIH1cbiAgICB9LFxuICB9O1xuXG4gIF9pZDogc3RyaW5nID0gSGVscGVycy5nZW5lcmF0ZVRva2VuKCk7XG5cbiAgX3N0YXRlRnVuY3Rpb25zID0ge1xuICAgIGdldFN0YXRlOiAoaWQ6IHN0cmluZykgPT4ge1xuICAgICAgY29uc3QgaW5kZXggPSB0aGlzLl9kYXRhTGlzdC5maW5kSW5kZXgoKHJvdzogYW55KSA9PiB7XG4gICAgICAgIHJldHVybiByb3cuZ2V0KCdyb3dJZCcpID09PSBpZDtcbiAgICAgIH0pO1xuICAgICAgaWYgKGluZGV4ID4gMCkge1xuICAgICAgICByZXR1cm4gKHRoaXMuX2RhdGFMaXN0LmdldChpbmRleCkgYXMgYW55KS50b0pTKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7fTtcbiAgICB9LFxuICAgIHNldFN0YXRlOiAoaWQ6IHN0cmluZywgZGF0YTogYW55KSA9PiB7XG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMuX2RhdGFMaXN0LmZpbmRJbmRleCgocm93OiBhbnkpID0+IHtcbiAgICAgICAgcmV0dXJuIHJvdy5nZXQoJ3Jvd0lkJykgPT09IGlkO1xuICAgICAgfSk7XG4gICAgICB0aGlzLl9kYXRhTGlzdCA9IHRoaXMuX2RhdGFMaXN0LnNldChpbmRleCwgSW1tdXRhYmxlLmZyb21KUyhkYXRhKSk7XG4gICAgICB0aGlzLmNoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH0sXG4gIH07XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQEluamVjdChKUV9UT0tFTikgcHVibGljICQ6IGFueSxcbiAgICBwcml2YXRlIGNoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIHNjcmlwdFNlcnZpY2U6IFNjcmlwdFNlcnZpY2UsXG4gICAgcHJpdmF0ZSBwbGF5YmFja1NlcnZpY2U6IFBsYXliYWNrU2VydmljZSxcbiAgICBwcml2YXRlIHBsYXliYWNrTGlzdFNlcnZpY2U6IFBsYXliYWNrTGlzdFNlcnZpY2VcbiAgKSB7fVxuXG4gIGFzeW5jIG5nT25Jbml0KCkge1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgaWYgKCFzZWxmLl9pbml0aWFsaXplZCkge1xuICAgICAgdGhpcy5faW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgICAgdGhpcy5fbG9hZFNjcmlwdHMoKS50aGVuKCgpID0+IHtcbiAgICAgICAgdGhpcy5faW5pdGlhbGl6ZVJlcXVlc3RzKCk7XG4gICAgICAgIHRoaXMucGxheWJhY2tTZXJ2aWNlLmluaXQodGhpcy5zb2NrZXRVcmwpO1xuICAgICAgICBjb25zdCBjaGFuZ2VzS2V5cyA9IE9iamVjdC5rZXlzKGNoYW5nZXMpO1xuICAgICAgICBjaGFuZ2VzS2V5cy5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICBzZWxmW2tleV0gPSBjaGFuZ2VzW2tleV0uY3VycmVudFZhbHVlO1xuICAgICAgICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICAgICAgICBjYXNlICdwYWdlSW5kZXgnOlxuICAgICAgICAgICAgY2FzZSAnZmlsdGVycyc6XG4gICAgICAgICAgICBjYXNlICdzb3J0Jzoge1xuICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RQbGF5YmFja0xpc3QoKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGNoYW5nZXNLZXlzID0gT2JqZWN0LmtleXMoY2hhbmdlcyk7XG4gICAgICBjaGFuZ2VzS2V5cy5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgaWYgKGtleSA9PT0gJ3BhZ2VJbmRleCcpIHtcbiAgICAgICAgICBzZWxmLl9wcmV2aW91c1BhZ2VJbmRleCA9IGNoYW5nZXNba2V5XS5wcmV2aW91c1ZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHNlbGZba2V5XSA9IGNoYW5nZXNba2V5XS5jdXJyZW50VmFsdWU7XG4gICAgICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICAgICAgY2FzZSAncGFnZUluZGV4JzpcbiAgICAgICAgICBjYXNlICdmaWx0ZXJzJzpcbiAgICAgICAgICBjYXNlICdzb3J0JzpcbiAgICAgICAgICBjYXNlICdwbGF5YmFja0xpc3ROYW1lJzoge1xuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0UGxheWJhY2tMaXN0KCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fcmVzZXRTdWJzY3JpcHRpb25zKCk7XG4gICAgdGhpcy5wbGF5YmFja1NlcnZpY2UucmVzZXRDdXN0b21QbGF5YmFja3MoKTtcbiAgICB0aGlzLl9pbml0aWFsaXplZCA9IGZhbHNlO1xuICB9XG5cbiAgdHJhY2tCeUZuKGluZGV4OiBudW1iZXIsIGl0ZW06IGFueSkge1xuICAgIHJldHVybiBpdGVtLmdldCgncm93SWQnKTtcbiAgfVxuXG4gIHByaXZhdGUgX2luaXRpYWxpemVSZXF1ZXN0cygpOiB2b2lkIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBzZWxmLl9nZXRQbGF5YmFja0xpc3RTdWJzY3JpcHRpb24gPSBzZWxmLl9nZXRQbGF5YmFja0xpc3RTdWJqZWN0XG4gICAgICAucGlwZShcbiAgICAgICAgZGVib3VuY2VUaW1lKDEwMCksXG4gICAgICAgIHN3aXRjaE1hcCgocGFyYW1zKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHNlbGYucGxheWJhY2tMaXN0U2VydmljZS5nZXRQbGF5YmFja0xpc3QoXG4gICAgICAgICAgICBzZWxmLnBsYXliYWNrTGlzdEJhc2VVcmwsXG4gICAgICAgICAgICBwYXJhbXMucGxheWJhY2tMaXN0TmFtZSxcbiAgICAgICAgICAgIHBhcmFtcy5zdGFydEluZGV4LFxuICAgICAgICAgICAgcGFyYW1zLmxpbWl0LFxuICAgICAgICAgICAgcGFyYW1zLmZpbHRlcnMsXG4gICAgICAgICAgICBwYXJhbXMuc29ydCxcbiAgICAgICAgICAgIHBhcmFtcy5wcmV2aW91c0tleSxcbiAgICAgICAgICAgIHBhcmFtcy5uZXh0S2V5XG4gICAgICAgICAgKTtcbiAgICAgICAgfSlcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUoKHJlczogYW55KSA9PiB7XG4gICAgICAgIHNlbGYuX2RhdGFMaXN0ID0gSW1tdXRhYmxlLmZyb21KUyhyZXMucm93cyk7XG4gICAgICAgIHNlbGYuX2RhdGFDb3VudCA9IHJlcy5yb3dzLmxlbmd0aDtcbiAgICAgICAgc2VsZi5fZGF0YVRvdGFsQ291bnQgPSByZXMuY291bnQ7XG4gICAgICAgIHNlbGYuX3ByZXZpb3VzS2V5ID0gcmVzLnByZXZpb3VzS2V5O1xuICAgICAgICBzZWxmLl9uZXh0S2V5ID0gcmVzLm5leHRLZXk7XG5cbiAgICAgICAgc2VsZi5fcmVzZXRTdWJzY3JpcHRpb25zKCk7XG4gICAgICAgIHNlbGYuX2luaXRTdWJzY3JpcHRpb25zKCk7XG4gICAgICAgIHNlbGYuX2luaXRDdXN0b21QbGF5YmFja0NvbmZpZ3VyYXRpb25zKCk7XG5cbiAgICAgICAgc2VsZi5jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG5cbiAgICAgICAgc2VsZi5wbGF5YmFja0xpc3RMb2FkZWRFbWl0dGVyLmVtaXQoe1xuICAgICAgICAgIHRvdGFsSXRlbXM6IHNlbGYuX2RhdGFUb3RhbENvdW50LFxuICAgICAgICAgIGRhdGFDb3VudDogc2VsZi5fZGF0YUNvdW50LFxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoc2VsZi5lbmFibGVMb2FkaW5nT3ZlcmxheSkge1xuICAgICAgICAgIHNlbGYuaGlkZUxvYWRpbmdPdmVybGF5KCk7XG4gICAgICAgIH1cbiAgICAgICAgc2VsZi5faXNMb2FkaW5nID0gZmFsc2U7XG4gICAgICB9LCAoZXJyb3I6IGFueSkgPT4ge1xuICAgICAgICBzZWxmLmdldFBsYXliYWNrTElzdEVycm9yRW1pdHRlci5lbWl0KGVycm9yKTtcbiAgICAgICAgaWYgKHNlbGYuZW5hYmxlTG9hZGluZ092ZXJsYXkpIHtcbiAgICAgICAgICBzZWxmLmhpZGVMb2FkaW5nT3ZlcmxheSgpO1xuICAgICAgICB9XG4gICAgICAgIHNlbGYuX2lzTG9hZGluZyA9IGZhbHNlO1xuICAgICAgfSk7XG5cbiAgICBzZWxmLl9leHBvcnRQbGF5YmFja0xpc3RTdWJzY3JpcHRpb24gPSBzZWxmLl9leHBvcnRQbGF5YmFja0xpc3RTdWJqZWN0XG4gICAgLnBpcGUoXG4gICAgICBkZWJvdW5jZVRpbWUoMTAwKSxcbiAgICAgIHN3aXRjaE1hcCgocGFyYW1zKSA9PiB7XG4gICAgICAgIGNvbnN0IHBsYXliYWNrTGlzdFJlcXVlc3QgPSBwYXJhbXMucGxheWJhY2tMaXN0UmVxdWVzdDtcbiAgICAgICAgcmV0dXJuIHNlbGYucGxheWJhY2tMaXN0U2VydmljZS5nZXRQbGF5YmFja0xpc3RDc3YoXG4gICAgICAgICAgc2VsZi5wbGF5YmFja0xpc3RCYXNlVXJsLFxuICAgICAgICAgIHBsYXliYWNrTGlzdFJlcXVlc3QucGxheWJhY2tMaXN0TmFtZSxcbiAgICAgICAgICBwbGF5YmFja0xpc3RSZXF1ZXN0LnN0YXJ0SW5kZXgsXG4gICAgICAgICAgcGxheWJhY2tMaXN0UmVxdWVzdC5saW1pdCxcbiAgICAgICAgICBwbGF5YmFja0xpc3RSZXF1ZXN0LmZpbHRlcnMsXG4gICAgICAgICAgcGxheWJhY2tMaXN0UmVxdWVzdC5zb3J0LFxuICAgICAgICAgIHBsYXliYWNrTGlzdFJlcXVlc3QudHlwZVxuICAgICAgICApLnBpcGUoXG4gICAgICAgICAgcnhNYXAoKHJlc3BvbnNlOiBQbGF5YmFja0xpc3RSZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIFtyZXNwb25zZSwgcGFyYW1zLmZpbGVOYW1lT3ZlcnJpZGVdO1xuICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICB9KVxuICAgIClcbiAgICAuc3Vic2NyaWJlKChbcmVzdWx0LCBmaWxlTmFtZU92ZXJyaWRlXSkgPT4ge1xuICAgICAgY29uc3QgY3N2ID0gbmV3IEJsb2IoW3Jlc3VsdF0sIHsgdHlwZTogJ3RleHQvY3N2JyB9KTtcbiAgICAgIGNvbnN0IG1vbWVudCA9IG1vbWVudF87XG4gICAgICBjb25zdCBub3cgPSBtb21lbnQoKTtcbiAgICAgIGNvbnN0IGZpbGVOYW1lID0gYCR7ZmlsZU5hbWVPdmVycmlkZSB8fCB0aGlzLmNzdkZpbGVOYW1lIHx8IHRoaXMucGxheWJhY2tMaXN0TmFtZX0tJHtub3cuZm9ybWF0KCdZWVlZLU1NLUREX0hIbW1zcycpfS5jc3ZgO1xuICAgICAgc2F2ZUFzKGNzdiwgZmlsZU5hbWUpO1xuICAgIH0pO1xuICB9XG5cbiAgX2dldFBsYXliYWNrTGlzdChcbiAgICBwbGF5YmFja0xpc3ROYW1lOiBzdHJpbmcsXG4gICAgc3RhcnRJbmRleDogbnVtYmVyLFxuICAgIGxpbWl0OiBudW1iZXIsXG4gICAgZmlsdGVycz86IEZpbHRlcltdLFxuICAgIHNvcnQ/OiBTb3J0W10sXG4gICAgcHJldmlvdXNLZXk/OiBzdHJpbmcsXG4gICAgbmV4dEtleT86IHN0cmluZ1xuICApIHtcbiAgICBjb25zdCBwbGF5YmFja0xpc3RSZXF1ZXN0UGFyYW1zOiBQbGF5YmFja0xpc3RSZXF1ZXN0ID0ge1xuICAgICAgcGxheWJhY2tMaXN0TmFtZTogcGxheWJhY2tMaXN0TmFtZSxcbiAgICAgIHN0YXJ0SW5kZXg6IHN0YXJ0SW5kZXgsXG4gICAgICBsaW1pdDogbGltaXQsXG4gICAgICBmaWx0ZXJzOiBmaWx0ZXJzLFxuICAgICAgc29ydDogc29ydCxcbiAgICAgIHByZXZpb3VzS2V5OiBwcmV2aW91c0tleSxcbiAgICAgIG5leHRLZXk6IG5leHRLZXlcbiAgICB9O1xuICAgIHRoaXMuX2lzTG9hZGluZyA9IHRydWU7XG4gICAgaWYgKHRoaXMuZW5hYmxlTG9hZGluZ092ZXJsYXkpIHtcbiAgICAgIHRoaXMuc2hvd0xvYWRpbmdPdmVybGF5KCk7XG4gICAgfVxuICAgIHRoaXMuX2dldFBsYXliYWNrTGlzdFN1YmplY3QubmV4dChwbGF5YmFja0xpc3RSZXF1ZXN0UGFyYW1zKTtcbiAgfVxuXG4gIHJlcXVlc3RQbGF5YmFja0xpc3QoKSB7XG4gICAgbGV0IHN0YXJ0SW5kZXg7XG4gICAgaWYgKHRoaXMucGFnZUluZGV4ID09PSAxKSB7XG4gICAgICB0aGlzLl9wcmV2aW91c1BhZ2VJbmRleCA9IG51bGw7XG4gICAgICB0aGlzLl9wcmV2aW91c0tleSA9IG51bGw7XG4gICAgICB0aGlzLl9uZXh0S2V5ID0gbnVsbDtcbiAgICAgIHN0YXJ0SW5kZXggPSAwO1xuICAgICAgdGhpcy5fZ2V0UGxheWJhY2tMaXN0KFxuICAgICAgICB0aGlzLnBsYXliYWNrTGlzdE5hbWUsXG4gICAgICAgIHN0YXJ0SW5kZXgsXG4gICAgICAgIHRoaXMuaXRlbXNQZXJQYWdlLFxuICAgICAgICB0aGlzLmZpbHRlcnMsXG4gICAgICAgIHRoaXMuc29ydCxcbiAgICAgICAgbnVsbCxcbiAgICAgICAgbnVsbFxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuX3ByZXZpb3VzS2V5ICYmIHRoaXMuX25leHRLZXkpIHtcbiAgICAgIGlmICh0aGlzLl9kYXRhVG90YWxDb3VudCAtICh0aGlzLnBhZ2VJbmRleCAqIHRoaXMuaXRlbXNQZXJQYWdlKSA8PSAwKSB7XG4gICAgICAgIHN0YXJ0SW5kZXggPSAwO1xuICAgICAgICB0aGlzLl9nZXRQbGF5YmFja0xpc3QoXG4gICAgICAgICAgdGhpcy5wbGF5YmFja0xpc3ROYW1lLFxuICAgICAgICAgIHN0YXJ0SW5kZXgsXG4gICAgICAgICAgdGhpcy5pdGVtc1BlclBhZ2UsXG4gICAgICAgICAgdGhpcy5maWx0ZXJzLFxuICAgICAgICAgIHRoaXMuc29ydCxcbiAgICAgICAgICBudWxsLFxuICAgICAgICAgICdfX0xBU1QnXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgcGFnZURlbHRhID0gdGhpcy5wYWdlSW5kZXggLSB0aGlzLl9wcmV2aW91c1BhZ2VJbmRleDtcbiAgICAgICAgaWYgKHBhZ2VEZWx0YSA8IDApIHtcbiAgICAgICAgICBwYWdlRGVsdGEgKj0gLTE7XG4gICAgICAgICAgc3RhcnRJbmRleCA9IHRoaXMuaXRlbXNQZXJQYWdlICogKHBhZ2VEZWx0YSAtIDEpO1xuICAgICAgICAgIHRoaXMuX2dldFBsYXliYWNrTGlzdChcbiAgICAgICAgICAgIHRoaXMucGxheWJhY2tMaXN0TmFtZSxcbiAgICAgICAgICAgIHN0YXJ0SW5kZXgsXG4gICAgICAgICAgICB0aGlzLml0ZW1zUGVyUGFnZSxcbiAgICAgICAgICAgIHRoaXMuZmlsdGVycyxcbiAgICAgICAgICAgIHRoaXMuc29ydCxcbiAgICAgICAgICAgIHRoaXMuX3ByZXZpb3VzS2V5LFxuICAgICAgICAgICAgbnVsbFxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3RhcnRJbmRleCA9IHRoaXMuaXRlbXNQZXJQYWdlICogKHBhZ2VEZWx0YSAtIDEpO1xuICAgICAgICAgIHRoaXMuX2dldFBsYXliYWNrTGlzdChcbiAgICAgICAgICAgIHRoaXMucGxheWJhY2tMaXN0TmFtZSxcbiAgICAgICAgICAgIHN0YXJ0SW5kZXgsXG4gICAgICAgICAgICB0aGlzLml0ZW1zUGVyUGFnZSxcbiAgICAgICAgICAgIHRoaXMuZmlsdGVycyxcbiAgICAgICAgICAgIHRoaXMuc29ydCxcbiAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICB0aGlzLl9uZXh0S2V5XG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdGFydEluZGV4ID0gdGhpcy5pdGVtc1BlclBhZ2UgKiAodGhpcy5wYWdlSW5kZXggLSAxKTtcbiAgICAgIHRoaXMuX2dldFBsYXliYWNrTGlzdChcbiAgICAgICAgdGhpcy5wbGF5YmFja0xpc3ROYW1lLFxuICAgICAgICBzdGFydEluZGV4LFxuICAgICAgICB0aGlzLml0ZW1zUGVyUGFnZSxcbiAgICAgICAgdGhpcy5maWx0ZXJzLFxuICAgICAgICB0aGlzLnNvcnQsXG4gICAgICAgIG51bGwsXG4gICAgICAgIG51bGxcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBfbG9hZFNjcmlwdHMoKSB7XG4gICAgaWYgKHRoaXMuc2NyaXB0U3RvcmUpIHtcbiAgICAgIGF3YWl0IHRoaXMuc2NyaXB0U2VydmljZS5pbml0KHRoaXMuc2NyaXB0U3RvcmUpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgX2luaXRTdWJzY3JpcHRpb25zKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIC8vIFBlciByb3cgc3Vic2NyaXB0aW9uc1xuICAgIChzZWxmLml0ZW1TdWJzY3JpcHRpb25Db25maWd1cmF0aW9ucyB8fCBbXSkuZm9yRWFjaCgoaXRlbVN1YnNjcmlwdGlvbkNvbmZpZ3VyYXRpb246IFN1YnNjcmlwdGlvbkNvbmZpZ3VyYXRpb24pID0+IHtcbiAgICAgIGlmIChpdGVtU3Vic2NyaXB0aW9uQ29uZmlndXJhdGlvbikge1xuICAgICAgICBzZWxmLl9kYXRhTGlzdC5mb3JFYWNoKGFzeW5jIChyb3c6IGFueSkgPT4ge1xuICAgICAgICAgIGNvbnN0IHN0cmVhbVJldmlzaW9uRnVuY3Rpb24gPSBpdGVtU3Vic2NyaXB0aW9uQ29uZmlndXJhdGlvbi5zdHJlYW1SZXZpc2lvbkZ1bmN0aW9uID9cbiAgICAgICAgICAgIGl0ZW1TdWJzY3JpcHRpb25Db25maWd1cmF0aW9uLnN0cmVhbVJldmlzaW9uRnVuY3Rpb24gOiAoKSA9PiArcm93LmdldCgncmV2aXNpb24nKSArIDE7XG5cblxuICAgICAgICAgIGNvbnN0IGFnZ3JlZ2F0ZUlkID0gaXRlbVN1YnNjcmlwdGlvbkNvbmZpZ3VyYXRpb24ucm93SWRGdW5jdGlvbiA/XG4gICAgICAgICAgICAgIGl0ZW1TdWJzY3JpcHRpb25Db25maWd1cmF0aW9uLnJvd0lkRnVuY3Rpb24ocm93LnRvSlMoKSkgOiByb3cuZ2V0KCdyb3dJZCcpO1xuXG4gICAgICAgICAgY29uc3QgcXVlcnk6IFF1ZXJ5ID0gX2Nsb25lKGl0ZW1TdWJzY3JpcHRpb25Db25maWd1cmF0aW9uLnF1ZXJ5KTtcbiAgICAgICAgICBxdWVyeS5hZ2dyZWdhdGVJZCA9IHF1ZXJ5LmFnZ3JlZ2F0ZUlkLnJlcGxhY2UoXG4gICAgICAgICAgICAve3tyb3dJZH19L2csXG4gICAgICAgICAgICBhZ2dyZWdhdGVJZFxuICAgICAgICAgICk7XG5cbiAgICAgICAgICBjb25zdCBwbGF5YmFja1N1YnNjcmlwdGlvblRva2VuID0gYXdhaXQgc2VsZi5wbGF5YmFja1NlcnZpY2UucmVnaXN0ZXJGb3JQbGF5YmFjayhcbiAgICAgICAgICAgIHNlbGYsXG4gICAgICAgICAgICBpdGVtU3Vic2NyaXB0aW9uQ29uZmlndXJhdGlvbi5wbGF5YmFja1NjcmlwdE5hbWUsXG4gICAgICAgICAgICBxdWVyeSxcbiAgICAgICAgICAgIHNlbGYuX3N0YXRlRnVuY3Rpb25zLFxuICAgICAgICAgICAgc2VsZi5fcGxheWJhY2tMaXN0LFxuICAgICAgICAgICAgc3RyZWFtUmV2aXNpb25GdW5jdGlvbixcbiAgICAgICAgICAgIHJvdy5nZXQoJ3Jvd0lkJyksXG4gICAgICAgICAgICBpdGVtU3Vic2NyaXB0aW9uQ29uZmlndXJhdGlvbi5jb25kaXRpb24sXG4gICAgICAgICAgICBpdGVtU3Vic2NyaXB0aW9uQ29uZmlndXJhdGlvbi5yb3dJZEZ1bmN0aW9uXG4gICAgICAgICAgKTtcbiAgICAgICAgICB0aGlzLl9wbGF5YmFja1N1YnNjcmlwdGlvblRva2Vucy5wdXNoKHBsYXliYWNrU3Vic2NyaXB0aW9uVG9rZW4pO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChzZWxmLmxpc3RTdWJzY3JpcHRpb25Db25maWd1cmF0aW9uKSB7XG4gICAgICAvLyBMaXN0IHN1YnNjcmlwdGlvblxuICAgICAgdGhpcy5fcGxheWJhY2tTdWJzY3JpcHRpb25Ub2tlbnMucHVzaChcbiAgICAgICAgYXdhaXQgc2VsZi5wbGF5YmFja1NlcnZpY2UucmVnaXN0ZXJGb3JQbGF5YmFjayhcbiAgICAgICAgICBzZWxmLFxuICAgICAgICAgIHNlbGYubGlzdFN1YnNjcmlwdGlvbkNvbmZpZ3VyYXRpb24ucGxheWJhY2tTY3JpcHROYW1lLFxuICAgICAgICAgIHNlbGYubGlzdFN1YnNjcmlwdGlvbkNvbmZpZ3VyYXRpb24ucXVlcnksXG4gICAgICAgICAgc2VsZi5fc3RhdGVGdW5jdGlvbnMsXG4gICAgICAgICAgc2VsZi5fcGxheWJhY2tMaXN0LFxuICAgICAgICAgICgpID0+IDBcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9pbml0Q3VzdG9tUGxheWJhY2tDb25maWd1cmF0aW9ucygpIHtcbiAgICBpZiAoIV9pc0VtcHR5KHRoaXMuY3VzdG9tUGxheWJhY2tDb25maWd1cmF0aW9ucykpIHtcbiAgICAgIHRoaXMucGxheWJhY2tTZXJ2aWNlLnJlZ2lzdGVyQ3VzdG9tUGxheWJhY2tzKHRoaXMuY3VzdG9tUGxheWJhY2tDb25maWd1cmF0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgX3Jlc2V0U3Vic2NyaXB0aW9ucygpIHtcbiAgICB0aGlzLnBsYXliYWNrU2VydmljZS51bnJlZ2lzdGVyRm9yUGxheWJhY2sodGhpcy5fcGxheWJhY2tTdWJzY3JpcHRpb25Ub2tlbnMpO1xuICAgIHRoaXMuX3BsYXliYWNrU3Vic2NyaXB0aW9uVG9rZW5zID0gW107XG4gIH1cblxuICBfb25VcGRhdGUocGF5bG9hZDogYW55KSB7XG4gICAgdGhpcy51cGRhdGVFbWl0dGVyLmVtaXQocGF5bG9hZCk7XG4gIH1cblxuICBfb25HZXRMb29rdXBzKHBheWxvYWQ6IGFueSkge1xuICAgIHRoaXMuZ2V0TG9va3Vwc0VtaXR0ZXIuZW1pdChwYXlsb2FkKTtcbiAgfVxuXG4gIF9vblNob3dNb2RhbChwYXlsb2FkOiBhbnkpIHtcbiAgICB0aGlzLnNob3dNb2RhbEVtaXR0ZXIuZW1pdChwYXlsb2FkKTtcbiAgfVxuXG4gIF9vbkRlbGV0ZShwYXlsb2FkOiBhbnkpIHtcbiAgICB0aGlzLmRlbGV0ZUVtaXR0ZXIuZW1pdChwYXlsb2FkKTtcbiAgfVxuXG4gIGV4cG9ydENTVihvdmVycmlkZVBhcmFtcz86IFBsYXliYWNrTGlzdFJlcXVlc3QsIGZpbGVOYW1lT3ZlcnJpZGU/OiBzdHJpbmcpIHtcbiAgICBpZiAob3ZlcnJpZGVQYXJhbXMpIHtcbiAgICAgIHRoaXMuX2V4cG9ydFBsYXliYWNrTGlzdFN1YmplY3QubmV4dCh7IHBsYXliYWNrTGlzdFJlcXVlc3Q6IG92ZXJyaWRlUGFyYW1zLCBmaWxlTmFtZU92ZXJyaWRlOiBmaWxlTmFtZU92ZXJyaWRlIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBzdGFydEluZGV4ID0gdGhpcy5pdGVtc1BlclBhZ2UgKiAodGhpcy5wYWdlSW5kZXggLSAxKTtcbiAgICAgIGNvbnN0IGV4cG9ydFBsYXliYWNrTGlzdFJlcXVlc3RQYXJhbXM6IFBsYXliYWNrTGlzdFJlcXVlc3QgPSB7XG4gICAgICAgIHBsYXliYWNrTGlzdE5hbWU6IHRoaXMucGxheWJhY2tMaXN0TmFtZSxcbiAgICAgICAgc3RhcnRJbmRleDogc3RhcnRJbmRleCxcbiAgICAgICAgbGltaXQ6IDEwMDAwMDAsXG4gICAgICAgIGZpbHRlcnM6IHRoaXMuZmlsdGVycyxcbiAgICAgICAgc29ydDogdGhpcy5zb3J0XG4gICAgICB9O1xuXG4gICAgICB0aGlzLl9leHBvcnRQbGF5YmFja0xpc3RTdWJqZWN0Lm5leHQoeyBwbGF5YmFja0xpc3RSZXF1ZXN0OiBleHBvcnRQbGF5YmFja0xpc3RSZXF1ZXN0UGFyYW1zLCBmaWxlTmFtZU92ZXJyaWRlOiBmaWxlTmFtZU92ZXJyaWRlIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIExvYWRpbmcgT3ZlcmxheSBGdW5jdGlvbnNcbiAgaGlkZUxvYWRpbmdPdmVybGF5KCkge1xuICAgIGNvbnN0ICQgPSB0aGlzLiQ7XG4gICAgJCgnYm9keScpLmNzcygnb3ZlcmZsb3cnLCAnJyk7XG4gICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdsb2FkaW5nLWJvZHknKTtcbiAgICAkKGAjbmctZXZlbnRzdG9yZS1saXN0aW5nLW92ZXJsYXktJHt0aGlzLl9pZH1gKS5oaWRlKCk7XG4gIH1cblxuICBzaG93TG9hZGluZ092ZXJsYXkoKSB7XG4gICAgY29uc3QgJCA9IHRoaXMuJDtcbiAgICAkKGAjbmctZXZlbnRzdG9yZS1saXN0aW5nLW92ZXJsYXktJHt0aGlzLl9pZH1gKS5zaG93KCk7XG4gICAgaWYgKHRoaXMubG9hZGluZ1RvcEJvdW5kU2VsZWN0b3IgPyB0cnVlIDogZmFsc2UpIHtcbiAgICAgIHRoaXMuX2ZpeExvYWRpbmdPdmVybGF5UG9zaXRpb24oKTtcbiAgICB9XG4gIH1cblxuICBfZml4TG9hZGluZ092ZXJsYXlQb3NpdGlvbigpIHtcbiAgICBjb25zdCAkID0gdGhpcy4kO1xuICAgIGNvbnN0IHdpbmRvd1kgPSB3aW5kb3cucGFnZVlPZmZzZXQ7XG4gICAgY29uc3QgcGFnZUhlYWRlclNlY3Rpb25IZWlnaHQgPSA1MztcbiAgICBjb25zdCBwYWdlSGVhZGVyU2VjdGlvbkJvdHRvbVkgPSAkKHRoaXMubG9hZGluZ1RvcEJvdW5kU2VsZWN0b3IpLm9mZnNldCgpLnRvcCArIHBhZ2VIZWFkZXJTZWN0aW9uSGVpZ2h0O1xuICAgICQoJ2JvZHknKS5jc3MoJ292ZXJmbG93JywgJ2hpZGRlbicpO1xuICAgICQoJ2JvZHknKS5hZGRDbGFzcygnbG9hZGluZy1ib2R5Jyk7XG4gICAgaWYgKHdpbmRvd1kgPCBwYWdlSGVhZGVyU2VjdGlvbkJvdHRvbVkpIHtcbiAgICAgICQoYCNuZy1ldmVudHN0b3JlLWxpc3Rpbmctb3ZlcmxheS0ke3RoaXMuX2lkfWApLmNzcygncG9zaXRpb24nLCAnYWJzb2x1dGUnKTtcbiAgICAgICQoYCNuZy1ldmVudHN0b3JlLWxpc3Rpbmctb3ZlcmxheS0ke3RoaXMuX2lkfWApLmNzcygnaGVpZ2h0JywgYCR7d2luZG93LmlubmVySGVpZ2h0fXB4YCk7XG4gICAgICAkKGAjbmctZXZlbnRzdG9yZS1saXN0aW5nLW92ZXJsYXktJHt0aGlzLl9pZH1gKS5jc3MoJ3dpZHRoJywgJzEwMCUnKTtcbiAgICAgIGNvbnN0IHBhZ2VIZWFkZXJIZWlnaHQgPSBwYWdlSGVhZGVyU2VjdGlvbkhlaWdodDtcbiAgICAgICQoYCNuZy1ldmVudHN0b3JlLWxpc3Rpbmctb3ZlcmxheS0ke3RoaXMuX2lkfWApLmNzcygnbWFyZ2luLXRvcCcsIGAke3BhZ2VIZWFkZXJIZWlnaHR9cHhgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJChgI25nLWV2ZW50c3RvcmUtbGlzdGluZy1vdmVybGF5LSR7dGhpcy5faWR9YCkuY3NzKCdwb3NpdGlvbicsICdmaXhlZCcpO1xuICAgICAgJChgI25nLWV2ZW50c3RvcmUtbGlzdGluZy1vdmVybGF5LSR7dGhpcy5faWR9YCkuY3NzKCdoZWlnaHQnLCAnMTAwJScpO1xuICAgICAgJChgI25nLWV2ZW50c3RvcmUtbGlzdGluZy1vdmVybGF5LSR7dGhpcy5faWR9YCkuY3NzKCdtYXJnaW4tdG9wJywgJzBweCcpO1xuICAgIH1cbiAgfVxufVxuIl19