import * as tslib_1 from "tslib";
import { Helpers } from './utils/helpers';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, Inject } from '@angular/core';
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
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], NgEventstoreListingComponent.prototype, "updateEmitter", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], NgEventstoreListingComponent.prototype, "getLookupsEmitter", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], NgEventstoreListingComponent.prototype, "showModalEmitter", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], NgEventstoreListingComponent.prototype, "deleteEmitter", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], NgEventstoreListingComponent.prototype, "playbackListLoadedEmitter", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], NgEventstoreListingComponent.prototype, "newItemNotifyEmitter", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], NgEventstoreListingComponent.prototype, "removedItemNotifyEmitter", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], NgEventstoreListingComponent.prototype, "getPlaybackLIstErrorEmitter", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], NgEventstoreListingComponent.prototype, "itemComponentClass", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], NgEventstoreListingComponent.prototype, "lookups", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], NgEventstoreListingComponent.prototype, "socketUrl", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], NgEventstoreListingComponent.prototype, "playbackListBaseUrl", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], NgEventstoreListingComponent.prototype, "scriptStore", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], NgEventstoreListingComponent.prototype, "itemSubscriptionConfigurations", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], NgEventstoreListingComponent.prototype, "listSubscriptionConfiguration", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], NgEventstoreListingComponent.prototype, "playbackListName", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], NgEventstoreListingComponent.prototype, "filters", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], NgEventstoreListingComponent.prototype, "sort", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], NgEventstoreListingComponent.prototype, "pageIndex", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Number)
], NgEventstoreListingComponent.prototype, "itemsPerPage", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], NgEventstoreListingComponent.prototype, "responseBasePath", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], NgEventstoreListingComponent.prototype, "emptyListDisplayText", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], NgEventstoreListingComponent.prototype, "csvFileName", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], NgEventstoreListingComponent.prototype, "customPlaybackConfigurations", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], NgEventstoreListingComponent.prototype, "enableLoadingOverlay", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], NgEventstoreListingComponent.prototype, "loadingTopBoundSelector", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], NgEventstoreListingComponent.prototype, "minHeightCss", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], NgEventstoreListingComponent.prototype, "loadingOffset", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], NgEventstoreListingComponent.prototype, "debugging", void 0);
NgEventstoreListingComponent = tslib_1.__decorate([
    Component({
        selector: 'lib-ng-eventstore-listing',
        template: "<!-- <div *ngIf=\"listHeaderGroups && listHeaderGroups.groups && listHeaderGroups.groups.length > 0\"  [class]=\"'row ' + (listHeaderGroups && listHeaderGroups.generalRowClassName ? listHeaderGroups.generalRowClassName : '')\">\n  <div class=\"col-12\">\n    <div class=\"header bg-white p-2\">\n      <div [class]=\"'row ' + listHeaderGroups.generalRowClassName\">\n        <div *ngFor=\"let listHeaderGroup of listHeaderGroups.groups\" [class]=\"listHeaderGroup.className\">\n          <div [class]=\"'row ' + listHeaderGroups.generalRowClassName\">\n            <div *ngFor=\"let listHeader of listHeaderGroup.listHeaders\" [class]=\"listHeader.className\">\n              <span (click)=\"onSort(listHeader.sortProperty)\" [ngClass]=\"{ 'sort-header': listHeader.sortProperty }\">{{ listHeader.displayName }} <i *ngIf=\"sortFields[listHeader.sortProperty] && sortFields[listHeader.sortProperty].icon\" [class]=\"'sort-icon ' + sortFields[listHeader.sortProperty].icon\"></i></span>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div> -->\n<!-- <div [class]=\"'row ' + (listHeaderGroups && listHeaderGroups.generalRowClassName) ? listHeaderGroups.generalRowClassName : ''\" *ngFor=\"let item of dataList; trackBy: trackByFn\"> -->\n<div class=\"row\" *ngFor=\"let item of _dataList; trackBy: trackByFn\">\n  <div class=\"col-12\">\n    <lib-item-template-holder\n      [data]=\"item\"\n      [itemComponentClass]=\"itemComponentClass\"\n      [lookups]=\"lookups\"\n      (updateEmitter)=\"_onUpdate($event)\"\n      (getLookupsEmitter)=\"_onGetLookups($event)\"\n      (showModalEmitter)=\"_onShowModal($event)\"\n      (deleteEmitter)=\"_onDelete($event)\">\n    </lib-item-template-holder>\n  </div>\n</div>\n<div class=\"row\" *ngIf=\"(!_dataCount || _dataCount === 0) && !_isLoading\">\n  <div class=\"col-12\">\n    <div class=\"row\">\n      <div class=\"col-12 no-results-container\">\n        <div class=\"text-center text-secondary\">\n          <span class=\"italic\">{{ emptyListDisplayText }}</span>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n\n<div [id]=\"'ng-eventstore-listing-overlay-' + _id\" class=\"ng-eventstore-listing-overlay\">\n  <div [id]=\"'ng-eventstore-listing-overlay-subject-' + _id\" class=\"ng-eventstore-listing-overlay-subject\" [ngStyle]=\"{ top:  loadingOffset }\">\n      <div class=\"ng-eventstore-listing-cssload-container\">\n        <div class=\"ng-eventstore-listing-cssload-speeding-wheel\"></div>\n      </div>\n  </div>\n</div>\n",
        changeDetection: ChangeDetectionStrategy.OnPush,
        styles: [".ng-eventstore-listing-overlay{position:absolute;width:100%;height:100%;top:0;left:0;right:0;bottom:0;background-color:#efefef;opacity:.7;z-index:10;display:none}.ng-eventstore-listing-overlay-subject{position:absolute;left:50%;font-size:50px;color:transparent;transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);text-align:center}.ng-eventstore-listing-cssload-container{width:100%;height:49px;text-align:center}.ng-eventstore-listing-cssload-speeding-wheel{width:49px;height:49px;margin:0 auto;border:3px solid #3b356e;border-radius:50%;border-left-color:transparent;border-right-color:transparent;animation:475ms linear infinite cssload-spin;-o-animation:475ms linear infinite cssload-spin;-ms-animation:cssload-spin 475ms infinite linear;-webkit-animation:475ms linear infinite cssload-spin;-moz-animation:475ms linear infinite cssload-spin}@keyframes cssload-spin{100%{transform:rotate(360deg)}}@-webkit-keyframes cssload-spin{100%{transform:rotate(360deg)}}"]
    }),
    tslib_1.__param(0, Inject(JQ_TOKEN)),
    tslib_1.__metadata("design:paramtypes", [Object, ChangeDetectorRef,
        ScriptService,
        PlaybackService,
        PlaybackListService])
], NgEventstoreListingComponent);
export { NgEventstoreListingComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctZXZlbnRzdG9yZS1saXN0aW5nLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25nLWV2ZW50c3RvcmUtbGlzdGluZy8iLCJzb3VyY2VzIjpbIm5nLWV2ZW50c3RvcmUtbGlzdGluZy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMxQyxPQUFPLEVBQ0wsU0FBUyxFQUVULEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUdaLHVCQUF1QixFQUN2QixpQkFBaUIsRUFFakIsTUFBTSxFQUNQLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFJLEdBQUcsSUFBSSxLQUFLLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6RSxPQUFPLEVBQWtCLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMvQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFnQnJELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDOUQsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFFdkUsT0FBTyxLQUFLLFNBQVMsTUFBTSxXQUFXLENBQUM7QUFFdkMsT0FBTyxRQUFRLE1BQU0sbUJBQW1CLENBQUM7QUFHekMsT0FBTyxNQUFNLE1BQU0saUJBQWlCLENBQUM7QUFHckMsT0FBTyxLQUFLLE9BQU8sTUFBTSxnQkFBZ0IsQ0FBQztBQUUxQyxPQUFPLE1BQU0sTUFBTSxZQUFZLENBQUM7QUFVaEMsSUFBYSw0QkFBNEIsR0FBekMsTUFBYSw0QkFBNEI7SUEyS3ZDLFlBQzJCLENBQU0sRUFDdkIsaUJBQW9DLEVBQ3BDLGFBQTRCLEVBQzVCLGVBQWdDLEVBQ2hDLG1CQUF3QztRQUp2QixNQUFDLEdB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ekQ7SUFBUixLQUFLLEVBQUU7O3NFQUEwQjtBQUN6QjtJQUFSLEtBQUssRUFBRTs7NkRBQTBCO0FBQ3pCO0lBQVIsS0FBSyxFQUFFOzswREFBcUI7QUFDcEI7SUFBUixLQUFLLEVBQUU7OytEQUFlO0FBQ2Q7SUFBUixLQUFLLEVBQUU7O2tFQUFzQjtBQUNyQjtJQUFSLEtBQUssRUFBRTs7c0VBQTJCO0FBQzFCO0lBQVIsS0FBSyxFQUFFOzswRUFBcUM7QUFDcEM7SUFBUixLQUFLLEVBQUU7O2lFQUFrQjtBQUNqQjtJQUFSLEtBQUssRUFBRTs7a0ZBQTZEO0FBQzVEO0lBQVIsS0FBSyxFQUFFOzswRUFBNkI7QUFDNUI7SUFBUixLQUFLLEVBQUU7OzZFQUFpQztBQUNoQztJQUFSLEtBQUssRUFBRTs7a0VBQXdCO0FBQ3ZCO0lBQVIsS0FBSyxFQUFFOzttRUFBeUI7QUFFeEI7SUFBUixLQUFLLEVBQUU7OytEQUFtQjtBQWhDaEIsNEJBQTRCO0lBUnhDLFNBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSwyQkFBMkI7UUFDckMseS9FQUFxRDtRQUlyRCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTs7S0FDaEQsQ0FBQztJQTZLRyxtQkFBQSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUE7cURBQ1UsaUJBQWlCO1FBQ3JCLGFBQWE7UUFDWCxlQUFlO1FBQ1gsbUJBQW1CO0dBaEx2Qyw0QkFBNEIsQ0E2aEJ4QztTQTdoQlksNEJBQTRCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSGVscGVycyB9IGZyb20gJy4vdXRpbHMvaGVscGVycyc7XG5pbXBvcnQge1xuICBDb21wb25lbnQsXG4gIE9uSW5pdCxcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBPbkNoYW5nZXMsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgT25EZXN0cm95LFxuICBJbmplY3Rcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IHN3aXRjaE1hcCwgZGVib3VuY2VUaW1lICwgIG1hcCBhcyByeE1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiAsICBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBKUV9UT0tFTiB9IGZyb20gJy4vc2VydmljZXMvanF1ZXJ5LnNlcnZpY2UnO1xuXG5pbXBvcnQge1xuICBTdWJzY3JpcHRpb25Db25maWd1cmF0aW9uLFxuICBTY3JpcHQsXG4gIFBsYXliYWNrTGlzdCxcbiAgUm93SXRlbSxcbiAgRmlsdGVyLFxuICBRdWVyeSxcbiAgU29ydCxcbiAgUGxheWJhY2tMaXN0UmVxdWVzdCxcbiAgQ3VzdG9tUGxheWJhY2tDb25maWd1cmF0aW9uLFxuICBQbGF5YmFja0xpc3RSZXNwb25zZVxufSBmcm9tICcuL21vZGVscyc7XG5cblxuaW1wb3J0IHsgU2NyaXB0U2VydmljZSB9IGZyb20gJy4vc2VydmljZXMvc2NyaXB0LnNlcnZpY2UnO1xuaW1wb3J0IHsgUGxheWJhY2tTZXJ2aWNlIH0gZnJvbSAnLi9zZXJ2aWNlcy9wbGF5YmFjay5zZXJ2aWNlJztcbmltcG9ydCB7IFBsYXliYWNrTGlzdFNlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2VzL3BsYXliYWNrLWxpc3Quc2VydmljZSc7XG5cbmltcG9ydCAqIGFzIEltbXV0YWJsZSBmcm9tICdpbW11dGFibGUnO1xuaW1wb3J0IF9kZWZhdWx0c0RlZXAgZnJvbSAnbG9kYXNoLWVzL2RlZmF1bHRzRGVlcCc7XG5pbXBvcnQgX2lzRW1wdHkgZnJvbSAnbG9kYXNoLWVzL2lzRW1wdHknO1xuaW1wb3J0IF9pc0VxdWFsIGZyb20gJ2xvZGFzaC1lcy9pc0VxdWFsJztcbmltcG9ydCBfY2xvbmVEZWVwIGZyb20gJ2xvZGFzaC1lcy9jbG9uZURlZXAnO1xuaW1wb3J0IF9jbG9uZSBmcm9tICdsb2Rhc2gtZXMvY2xvbmUnO1xuaW1wb3J0IF91bmlxIGZyb20gJ2xvZGFzaC1lcy91bmlxJztcbmltcG9ydCBfbWVyZ2UgZnJvbSAnbG9kYXNoLWVzL2RlZmF1bHRzJztcbmltcG9ydCAqIGFzIG1vbWVudF8gZnJvbSAnbW9tZW50LW1pbmktdHMnO1xuXG5pbXBvcnQgc2F2ZUFzIGZyb20gJ2ZpbGUtc2F2ZXInO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdsaWItbmctZXZlbnRzdG9yZS1saXN0aW5nJyxcbiAgdGVtcGxhdGVVcmw6ICcuL25nLWV2ZW50c3RvcmUtbGlzdGluZy5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogW1xuICAgICcuL25nLWV2ZW50c3RvcmUtbGlzdGluZy5jb21wb25lbnQuY3NzJ1xuICBdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBOZ0V2ZW50c3RvcmVMaXN0aW5nQ29tcG9uZW50XG4gIGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gIEBPdXRwdXQoKSB1cGRhdGVFbWl0dGVyOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIGdldExvb2t1cHNFbWl0dGVyOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIHNob3dNb2RhbEVtaXR0ZXI6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgZGVsZXRlRW1pdHRlcjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBwbGF5YmFja0xpc3RMb2FkZWRFbWl0dGVyOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIG5ld0l0ZW1Ob3RpZnlFbWl0dGVyOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIHJlbW92ZWRJdGVtTm90aWZ5RW1pdHRlcjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBnZXRQbGF5YmFja0xJc3RFcnJvckVtaXR0ZXI6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIEBJbnB1dCgpIGl0ZW1Db21wb25lbnRDbGFzczogYW55O1xuICBASW5wdXQoKSBsb29rdXBzID0ge307XG4gIEBJbnB1dCgpIHNvY2tldFVybDogc3RyaW5nO1xuICBASW5wdXQoKSBwbGF5YmFja0xpc3RCYXNlVXJsOiBzdHJpbmc7XG4gIEBJbnB1dCgpIHNjcmlwdFN0b3JlOiBTY3JpcHRbXTtcbiAgQElucHV0KCkgaXRlbVN1YnNjcmlwdGlvbkNvbmZpZ3VyYXRpb25zOiBTdWJzY3JpcHRpb25Db25maWd1cmF0aW9uW10gPSBbXTtcbiAgQElucHV0KCkgbGlzdFN1YnNjcmlwdGlvbkNvbmZpZ3VyYXRpb246IFN1YnNjcmlwdGlvbkNvbmZpZ3VyYXRpb247XG4gIEBJbnB1dCgpIHBsYXliYWNrTGlzdE5hbWU6IHN0cmluZztcbiAgQElucHV0KCkgZmlsdGVyczogRmlsdGVyW10gPSBudWxsO1xuICBASW5wdXQoKSBzb3J0OiBTb3J0W10gPSBudWxsO1xuICBASW5wdXQoKSBwYWdlSW5kZXggPSAxO1xuICBASW5wdXQoKSBpdGVtc1BlclBhZ2U6IG51bWJlcjtcbiAgQElucHV0KCkgcmVzcG9uc2VCYXNlUGF0aCA9ICdkYXRhJztcbiAgQElucHV0KCkgZW1wdHlMaXN0RGlzcGxheVRleHQgPSAnTm8gUmVzdWx0cyc7XG4gIEBJbnB1dCgpIGNzdkZpbGVOYW1lID0gJyc7XG4gIEBJbnB1dCgpIGN1c3RvbVBsYXliYWNrQ29uZmlndXJhdGlvbnM6IEN1c3RvbVBsYXliYWNrQ29uZmlndXJhdGlvbltdO1xuICBASW5wdXQoKSBlbmFibGVMb2FkaW5nT3ZlcmxheSA9IHRydWU7XG4gIEBJbnB1dCgpIGxvYWRpbmdUb3BCb3VuZFNlbGVjdG9yOiBzdHJpbmc7XG4gIEBJbnB1dCgpIG1pbkhlaWdodENzcyA9ICc1MDBweCc7XG4gIEBJbnB1dCgpIGxvYWRpbmdPZmZzZXQgPSAnMjAwcHgnO1xuXG4gIEBJbnB1dCgpIGRlYnVnZ2luZyA9IGZhbHNlO1xuXG4gIF9kYXRhTGlzdDogSW1tdXRhYmxlLkxpc3Q8Um93SXRlbT47XG4gIF9kYXRhQ291bnQ6IG51bWJlcjtcbiAgX2RhdGFUb3RhbENvdW50OiBudW1iZXI7XG4gIF9wcmV2aW91c0tleTogc3RyaW5nO1xuICBfbmV4dEtleTogc3RyaW5nO1xuICBfcHJldmlvdXNQYWdlSW5kZXg6IG51bWJlcjtcbiAgX2luaXRpYWxpemVkID0gZmFsc2U7XG4gIF9pc0xvYWRpbmcgPSBmYWxzZTtcbiAgX2dldFBsYXliYWNrTGlzdFN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICBfZ2V0UGxheWJhY2tMaXN0U3ViamVjdDogU3ViamVjdDxQbGF5YmFja0xpc3RSZXF1ZXN0PiA9IG5ldyBTdWJqZWN0KCk7XG4gIF9leHBvcnRQbGF5YmFja0xpc3RTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgX2V4cG9ydFBsYXliYWNrTGlzdFN1YmplY3Q6IFN1YmplY3Q8YW55PiA9IG5ldyBTdWJqZWN0KCk7XG4gIF9wbGF5YmFja1N1YnNjcmlwdGlvblRva2Vuczogc3RyaW5nW10gPSBbXTtcbiAgX3BsYXliYWNrTGlzdDogUGxheWJhY2tMaXN0ID0ge1xuICAgIGdldDogKHJvd0lkOiBzdHJpbmcsIGNhbGxiYWNrOiAoZXJyLCBpdGVtKSA9PiB2b2lkKSA9PiB7XG4gICAgICBjb25zdCByb3dJbmRleCA9IHRoaXMuX2RhdGFMaXN0LmZpbmRJbmRleCgodmFsdWU6IGFueSkgPT4ge1xuICAgICAgICByZXR1cm4gdmFsdWUuZ2V0KCdyb3dJZCcpID09PSByb3dJZDtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAocm93SW5kZXggPiAtMSkge1xuICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5fZGF0YUxpc3QuZ2V0KHJvd0luZGV4KTtcbiAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICBjYWxsYmFjayhudWxsLCAoZGF0YSBhcyBhbnkpLnRvSlMoKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2FsbGJhY2sobnVsbCwge30pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoYFJvdyB3aXRoIHJvd0lkOiAke3Jvd0luZGV4fSBkb2VzIG5vdCBleGlzdGApLCBudWxsKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGFkZDogKFxuICAgICAgcm93SWQ6IHN0cmluZyxcbiAgICAgIHJldmlzaW9uOiBudW1iZXIsXG4gICAgICBkYXRhOiBhbnksXG4gICAgICBtZXRhOiBhbnksXG4gICAgICBjYWxsYmFjazogKGVycj86IGFueSkgPT4gdm9pZFxuICAgICkgPT4ge1xuICAgICAgLy8gY29uc3QgbmV3RW50cnkgPSB7XG4gICAgICAvLyAgIHJvd0lkOiByb3dJZCxcbiAgICAgIC8vICAgcmV2aXNpb246IHJldmlzaW9uLFxuICAgICAgLy8gICBkYXRhOiBkYXRhLFxuICAgICAgLy8gICBtZXRhOiBtZXRhLFxuICAgICAgLy8gfTtcbiAgICAgIC8vIHRoaXMuZGF0YUxpc3QgPSB0aGlzLmRhdGFMaXN0LnB1c2goSW1tdXRhYmxlLmZyb21KUyhuZXdFbnRyeSkpO1xuICAgICAgLy8gdGhpcy5jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAvLyBEbyByZWZyZXNoIHRyaWdnZXJcbiAgICAgIGNvbnN0IG5ld0l0ZW0gPSB7XG4gICAgICAgIHJvd0lkLFxuICAgICAgICByZXZpc2lvbixcbiAgICAgICAgZGF0YSxcbiAgICAgICAgbWV0YVxuICAgICAgfTtcbiAgICAgIHRoaXMubmV3SXRlbU5vdGlmeUVtaXR0ZXIuZW1pdChuZXdJdGVtKTtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfSxcbiAgICB1cGRhdGU6IChcbiAgICAgIHJvd0lkOiBzdHJpbmcsXG4gICAgICByZXZpc2lvbjogbnVtYmVyLFxuICAgICAgb2xkRGF0YTogYW55LFxuICAgICAgbmV3RGF0YTogYW55LFxuICAgICAgbWV0YTogYW55LFxuICAgICAgY2FsbGJhY2s6IChlcnI/KSA9PiB2b2lkXG4gICAgKSA9PiB7XG4gICAgICBjb25zdCByb3dJbmRleCA9IHRoaXMuX2RhdGFMaXN0LmZpbmRJbmRleCgodmFsdWU6IGFueSkgPT4ge1xuICAgICAgICByZXR1cm4gdmFsdWUuZ2V0KCdyb3dJZCcpID09PSByb3dJZDtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBvbGREYXRhIGlzIEltbXV0YWJsZVxuICAgICAgY29uc3QgbmV3RW50cnkgPSBJbW11dGFibGUuZnJvbUpTKHtcbiAgICAgICAgcm93SWQ6IHJvd0lkLFxuICAgICAgICByZXZpc2lvbjogcmV2aXNpb24sXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAuLi5vbGREYXRhLFxuICAgICAgICAgIC4uLm5ld0RhdGEsXG4gICAgICAgIH0sXG4gICAgICAgIG1ldGE6IG1ldGEsXG4gICAgICB9KTtcblxuICAgICAgaWYgKHRoaXMuZGVidWdnaW5nKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKG5ld0VudHJ5KTtcbiAgICAgIH1cblxuICAgICAgaWYgKHJvd0luZGV4ID4gLTEpIHtcbiAgICAgICAgaWYgKHRoaXMuZGVidWdnaW5nKSB7XG4gICAgICAgICAgY29uc29sZS5sb2cocm93SW5kZXgpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKG5ld0VudHJ5KTtcblxuICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuX2RhdGFMaXN0LnRvSlMoKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fZGF0YUxpc3QgPSB0aGlzLl9kYXRhTGlzdC5zZXQocm93SW5kZXgsIG5ld0VudHJ5KTtcblxuICAgICAgICBpZiAodGhpcy5kZWJ1Z2dpbmcpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLl9kYXRhTGlzdC50b0pTKCkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKGBSb3cgd2l0aCByb3dJZDogJHtyb3dJbmRleH0gZG9lcyBub3QgZXhpc3RgKSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBkZWxldGU6IChyb3dJZDogc3RyaW5nLCBjYWxsYmFjazogKGVycm9yPzogYW55KSA9PiB2b2lkKSA9PiB7XG4gICAgICBjb25zdCByb3dJbmRleCA9IHRoaXMuX2RhdGFMaXN0LmZpbmRJbmRleCgodmFsdWU6IGFueSkgPT4ge1xuICAgICAgICByZXR1cm4gdmFsdWUuZ2V0KCdyb3dJZCcpID09PSByb3dJZDtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAocm93SW5kZXggPiAtMSkge1xuICAgICAgICAvLyB0aGlzLl9kYXRhTGlzdCA9IHRoaXMuX2RhdGFMaXN0LnJlbW92ZShyb3dJbmRleCk7XG4gICAgICAgIHRoaXMucmVtb3ZlZEl0ZW1Ob3RpZnlFbWl0dGVyLmVtaXQocm93SWQpO1xuICAgICAgICBjYWxsYmFjayhudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihgUm93IHdpdGggcm93SWQ6ICR7cm93SW5kZXh9IGRvZXMgbm90IGV4aXN0YCkpO1xuICAgICAgfVxuICAgIH0sXG4gIH07XG5cbiAgX2lkOiBzdHJpbmcgPSBIZWxwZXJzLmdlbmVyYXRlVG9rZW4oKTtcblxuICBfc3RhdGVGdW5jdGlvbnMgPSB7XG4gICAgZ2V0U3RhdGU6IChpZDogc3RyaW5nKSA9PiB7XG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMuX2RhdGFMaXN0LmZpbmRJbmRleCgocm93OiBhbnkpID0+IHtcbiAgICAgICAgcmV0dXJuIHJvdy5nZXQoJ3Jvd0lkJykgPT09IGlkO1xuICAgICAgfSk7XG4gICAgICBpZiAoaW5kZXggPiAwKSB7XG4gICAgICAgIHJldHVybiAodGhpcy5fZGF0YUxpc3QuZ2V0KGluZGV4KSBhcyBhbnkpLnRvSlMoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHt9O1xuICAgIH0sXG4gICAgc2V0U3RhdGU6IChpZDogc3RyaW5nLCBkYXRhOiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fZGF0YUxpc3QuZmluZEluZGV4KChyb3c6IGFueSkgPT4ge1xuICAgICAgICByZXR1cm4gcm93LmdldCgncm93SWQnKSA9PT0gaWQ7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX2RhdGFMaXN0ID0gdGhpcy5fZGF0YUxpc3Quc2V0KGluZGV4LCBJbW11dGFibGUuZnJvbUpTKGRhdGEpKTtcbiAgICAgIHRoaXMuY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfSxcbiAgfTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBASW5qZWN0KEpRX1RPS0VOKSBwdWJsaWMgJDogYW55LFxuICAgIHByaXZhdGUgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByaXZhdGUgc2NyaXB0U2VydmljZTogU2NyaXB0U2VydmljZSxcbiAgICBwcml2YXRlIHBsYXliYWNrU2VydmljZTogUGxheWJhY2tTZXJ2aWNlLFxuICAgIHByaXZhdGUgcGxheWJhY2tMaXN0U2VydmljZTogUGxheWJhY2tMaXN0U2VydmljZVxuICApIHt9XG5cbiAgYXN5bmMgbmdPbkluaXQoKSB7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoIXNlbGYuX2luaXRpYWxpemVkKSB7XG4gICAgICB0aGlzLl9pbml0aWFsaXplZCA9IHRydWU7XG4gICAgICB0aGlzLl9sb2FkU2NyaXB0cygpLnRoZW4oKCkgPT4ge1xuICAgICAgICB0aGlzLl9pbml0aWFsaXplUmVxdWVzdHMoKTtcbiAgICAgICAgdGhpcy5wbGF5YmFja1NlcnZpY2UuaW5pdCh0aGlzLnNvY2tldFVybCk7XG4gICAgICAgIGNvbnN0IGNoYW5nZXNLZXlzID0gT2JqZWN0LmtleXMoY2hhbmdlcyk7XG4gICAgICAgIGNoYW5nZXNLZXlzLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgIHNlbGZba2V5XSA9IGNoYW5nZXNba2V5XS5jdXJyZW50VmFsdWU7XG4gICAgICAgICAgc3dpdGNoIChrZXkpIHtcbiAgICAgICAgICAgIGNhc2UgJ3BhZ2VJbmRleCc6XG4gICAgICAgICAgICBjYXNlICdmaWx0ZXJzJzpcbiAgICAgICAgICAgIGNhc2UgJ3NvcnQnOiB7XG4gICAgICAgICAgICAgIHRoaXMucmVxdWVzdFBsYXliYWNrTGlzdCgpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgY2hhbmdlc0tleXMgPSBPYmplY3Qua2V5cyhjaGFuZ2VzKTtcbiAgICAgIGNoYW5nZXNLZXlzLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICBpZiAoa2V5ID09PSAncGFnZUluZGV4Jykge1xuICAgICAgICAgIHNlbGYuX3ByZXZpb3VzUGFnZUluZGV4ID0gY2hhbmdlc1trZXldLnByZXZpb3VzVmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2VsZltrZXldID0gY2hhbmdlc1trZXldLmN1cnJlbnRWYWx1ZTtcbiAgICAgICAgc3dpdGNoIChrZXkpIHtcbiAgICAgICAgICBjYXNlICdwYWdlSW5kZXgnOlxuICAgICAgICAgIGNhc2UgJ2ZpbHRlcnMnOlxuICAgICAgICAgIGNhc2UgJ3NvcnQnOlxuICAgICAgICAgIGNhc2UgJ3BsYXliYWNrTGlzdE5hbWUnOiB7XG4gICAgICAgICAgICB0aGlzLnJlcXVlc3RQbGF5YmFja0xpc3QoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9yZXNldFN1YnNjcmlwdGlvbnMoKTtcbiAgICB0aGlzLnBsYXliYWNrU2VydmljZS5yZXNldEN1c3RvbVBsYXliYWNrcygpO1xuICAgIHRoaXMuX2luaXRpYWxpemVkID0gZmFsc2U7XG4gIH1cblxuICB0cmFja0J5Rm4oaW5kZXg6IG51bWJlciwgaXRlbTogYW55KSB7XG4gICAgcmV0dXJuIGl0ZW0uZ2V0KCdyb3dJZCcpO1xuICB9XG5cbiAgcHJpdmF0ZSBfaW5pdGlhbGl6ZVJlcXVlc3RzKCk6IHZvaWQge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHNlbGYuX2dldFBsYXliYWNrTGlzdFN1YnNjcmlwdGlvbiA9IHNlbGYuX2dldFBsYXliYWNrTGlzdFN1YmplY3RcbiAgICAgIC5waXBlKFxuICAgICAgICBkZWJvdW5jZVRpbWUoMTAwKSxcbiAgICAgICAgc3dpdGNoTWFwKChwYXJhbXMpID0+IHtcbiAgICAgICAgICByZXR1cm4gc2VsZi5wbGF5YmFja0xpc3RTZXJ2aWNlLmdldFBsYXliYWNrTGlzdChcbiAgICAgICAgICAgIHNlbGYucGxheWJhY2tMaXN0QmFzZVVybCxcbiAgICAgICAgICAgIHBhcmFtcy5wbGF5YmFja0xpc3ROYW1lLFxuICAgICAgICAgICAgcGFyYW1zLnN0YXJ0SW5kZXgsXG4gICAgICAgICAgICBwYXJhbXMubGltaXQsXG4gICAgICAgICAgICBwYXJhbXMuZmlsdGVycyxcbiAgICAgICAgICAgIHBhcmFtcy5zb3J0LFxuICAgICAgICAgICAgcGFyYW1zLnByZXZpb3VzS2V5LFxuICAgICAgICAgICAgcGFyYW1zLm5leHRLZXlcbiAgICAgICAgICApO1xuICAgICAgICB9KVxuICAgICAgKVxuICAgICAgLnN1YnNjcmliZSgocmVzOiBhbnkpID0+IHtcbiAgICAgICAgc2VsZi5fZGF0YUxpc3QgPSBJbW11dGFibGUuZnJvbUpTKHJlcy5yb3dzKTtcbiAgICAgICAgc2VsZi5fZGF0YUNvdW50ID0gcmVzLnJvd3MubGVuZ3RoO1xuICAgICAgICBzZWxmLl9kYXRhVG90YWxDb3VudCA9IHJlcy5jb3VudDtcbiAgICAgICAgc2VsZi5fcHJldmlvdXNLZXkgPSByZXMucHJldmlvdXNLZXk7XG4gICAgICAgIHNlbGYuX25leHRLZXkgPSByZXMubmV4dEtleTtcblxuICAgICAgICBzZWxmLl9yZXNldFN1YnNjcmlwdGlvbnMoKTtcbiAgICAgICAgc2VsZi5faW5pdFN1YnNjcmlwdGlvbnMoKTtcbiAgICAgICAgc2VsZi5faW5pdEN1c3RvbVBsYXliYWNrQ29uZmlndXJhdGlvbnMoKTtcblxuICAgICAgICBzZWxmLmNoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcblxuICAgICAgICBzZWxmLnBsYXliYWNrTGlzdExvYWRlZEVtaXR0ZXIuZW1pdCh7XG4gICAgICAgICAgdG90YWxJdGVtczogc2VsZi5fZGF0YVRvdGFsQ291bnQsXG4gICAgICAgICAgZGF0YUNvdW50OiBzZWxmLl9kYXRhQ291bnQsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChzZWxmLmVuYWJsZUxvYWRpbmdPdmVybGF5KSB7XG4gICAgICAgICAgc2VsZi5oaWRlTG9hZGluZ092ZXJsYXkoKTtcbiAgICAgICAgfVxuICAgICAgICBzZWxmLl9pc0xvYWRpbmcgPSBmYWxzZTtcbiAgICAgIH0sIChlcnJvcjogYW55KSA9PiB7XG4gICAgICAgIHNlbGYuZ2V0UGxheWJhY2tMSXN0RXJyb3JFbWl0dGVyLmVtaXQoZXJyb3IpO1xuICAgICAgICBpZiAoc2VsZi5lbmFibGVMb2FkaW5nT3ZlcmxheSkge1xuICAgICAgICAgIHNlbGYuaGlkZUxvYWRpbmdPdmVybGF5KCk7XG4gICAgICAgIH1cbiAgICAgICAgc2VsZi5faXNMb2FkaW5nID0gZmFsc2U7XG4gICAgICB9KTtcblxuICAgIHNlbGYuX2V4cG9ydFBsYXliYWNrTGlzdFN1YnNjcmlwdGlvbiA9IHNlbGYuX2V4cG9ydFBsYXliYWNrTGlzdFN1YmplY3RcbiAgICAucGlwZShcbiAgICAgIGRlYm91bmNlVGltZSgxMDApLFxuICAgICAgc3dpdGNoTWFwKChwYXJhbXMpID0+IHtcbiAgICAgICAgY29uc3QgcGxheWJhY2tMaXN0UmVxdWVzdCA9IHBhcmFtcy5wbGF5YmFja0xpc3RSZXF1ZXN0O1xuICAgICAgICByZXR1cm4gc2VsZi5wbGF5YmFja0xpc3RTZXJ2aWNlLmdldFBsYXliYWNrTGlzdENzdihcbiAgICAgICAgICBzZWxmLnBsYXliYWNrTGlzdEJhc2VVcmwsXG4gICAgICAgICAgcGxheWJhY2tMaXN0UmVxdWVzdC5wbGF5YmFja0xpc3ROYW1lLFxuICAgICAgICAgIHBsYXliYWNrTGlzdFJlcXVlc3Quc3RhcnRJbmRleCxcbiAgICAgICAgICBwbGF5YmFja0xpc3RSZXF1ZXN0LmxpbWl0LFxuICAgICAgICAgIHBsYXliYWNrTGlzdFJlcXVlc3QuZmlsdGVycyxcbiAgICAgICAgICBwbGF5YmFja0xpc3RSZXF1ZXN0LnNvcnQsXG4gICAgICAgICAgcGxheWJhY2tMaXN0UmVxdWVzdC50eXBlXG4gICAgICAgICkucGlwZShcbiAgICAgICAgICByeE1hcCgocmVzcG9uc2U6IFBsYXliYWNrTGlzdFJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gW3Jlc3BvbnNlLCBwYXJhbXMuZmlsZU5hbWVPdmVycmlkZV07XG4gICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICAgIH0pXG4gICAgKVxuICAgIC5zdWJzY3JpYmUoKFtyZXN1bHQsIGZpbGVOYW1lT3ZlcnJpZGVdKSA9PiB7XG4gICAgICBjb25zdCBjc3YgPSBuZXcgQmxvYihbcmVzdWx0XSwgeyB0eXBlOiAndGV4dC9jc3YnIH0pO1xuICAgICAgY29uc3QgbW9tZW50ID0gbW9tZW50XztcbiAgICAgIGNvbnN0IG5vdyA9IG1vbWVudCgpO1xuICAgICAgY29uc3QgZmlsZU5hbWUgPSBgJHtmaWxlTmFtZU92ZXJyaWRlIHx8IHRoaXMuY3N2RmlsZU5hbWUgfHwgdGhpcy5wbGF5YmFja0xpc3ROYW1lfS0ke25vdy5mb3JtYXQoJ1lZWVktTU0tRERfSEhtbXNzJyl9LmNzdmA7XG4gICAgICBzYXZlQXMoY3N2LCBmaWxlTmFtZSk7XG4gICAgfSk7XG4gIH1cblxuICBfZ2V0UGxheWJhY2tMaXN0KFxuICAgIHBsYXliYWNrTGlzdE5hbWU6IHN0cmluZyxcbiAgICBzdGFydEluZGV4OiBudW1iZXIsXG4gICAgbGltaXQ6IG51bWJlcixcbiAgICBmaWx0ZXJzPzogRmlsdGVyW10sXG4gICAgc29ydD86IFNvcnRbXSxcbiAgICBwcmV2aW91c0tleT86IHN0cmluZyxcbiAgICBuZXh0S2V5Pzogc3RyaW5nXG4gICkge1xuICAgIGNvbnN0IHBsYXliYWNrTGlzdFJlcXVlc3RQYXJhbXM6IFBsYXliYWNrTGlzdFJlcXVlc3QgPSB7XG4gICAgICBwbGF5YmFja0xpc3ROYW1lOiBwbGF5YmFja0xpc3ROYW1lLFxuICAgICAgc3RhcnRJbmRleDogc3RhcnRJbmRleCxcbiAgICAgIGxpbWl0OiBsaW1pdCxcbiAgICAgIGZpbHRlcnM6IGZpbHRlcnMsXG4gICAgICBzb3J0OiBzb3J0LFxuICAgICAgcHJldmlvdXNLZXk6IHByZXZpb3VzS2V5LFxuICAgICAgbmV4dEtleTogbmV4dEtleVxuICAgIH07XG4gICAgdGhpcy5faXNMb2FkaW5nID0gdHJ1ZTtcbiAgICBpZiAodGhpcy5lbmFibGVMb2FkaW5nT3ZlcmxheSkge1xuICAgICAgdGhpcy5zaG93TG9hZGluZ092ZXJsYXkoKTtcbiAgICB9XG4gICAgdGhpcy5fZ2V0UGxheWJhY2tMaXN0U3ViamVjdC5uZXh0KHBsYXliYWNrTGlzdFJlcXVlc3RQYXJhbXMpO1xuICB9XG5cbiAgcmVxdWVzdFBsYXliYWNrTGlzdCgpIHtcbiAgICBsZXQgc3RhcnRJbmRleDtcbiAgICBpZiAodGhpcy5wYWdlSW5kZXggPT09IDEpIHtcbiAgICAgIHRoaXMuX3ByZXZpb3VzUGFnZUluZGV4ID0gbnVsbDtcbiAgICAgIHRoaXMuX3ByZXZpb3VzS2V5ID0gbnVsbDtcbiAgICAgIHRoaXMuX25leHRLZXkgPSBudWxsO1xuICAgICAgc3RhcnRJbmRleCA9IDA7XG4gICAgICB0aGlzLl9nZXRQbGF5YmFja0xpc3QoXG4gICAgICAgIHRoaXMucGxheWJhY2tMaXN0TmFtZSxcbiAgICAgICAgc3RhcnRJbmRleCxcbiAgICAgICAgdGhpcy5pdGVtc1BlclBhZ2UsXG4gICAgICAgIHRoaXMuZmlsdGVycyxcbiAgICAgICAgdGhpcy5zb3J0LFxuICAgICAgICBudWxsLFxuICAgICAgICBudWxsXG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAodGhpcy5fcHJldmlvdXNLZXkgJiYgdGhpcy5fbmV4dEtleSkge1xuICAgICAgaWYgKHRoaXMuX2RhdGFUb3RhbENvdW50IC0gKHRoaXMucGFnZUluZGV4ICogdGhpcy5pdGVtc1BlclBhZ2UpIDw9IDApIHtcbiAgICAgICAgc3RhcnRJbmRleCA9IDA7XG4gICAgICAgIHRoaXMuX2dldFBsYXliYWNrTGlzdChcbiAgICAgICAgICB0aGlzLnBsYXliYWNrTGlzdE5hbWUsXG4gICAgICAgICAgc3RhcnRJbmRleCxcbiAgICAgICAgICB0aGlzLml0ZW1zUGVyUGFnZSxcbiAgICAgICAgICB0aGlzLmZpbHRlcnMsXG4gICAgICAgICAgdGhpcy5zb3J0LFxuICAgICAgICAgIG51bGwsXG4gICAgICAgICAgJ19fTEFTVCdcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBwYWdlRGVsdGEgPSB0aGlzLnBhZ2VJbmRleCAtIHRoaXMuX3ByZXZpb3VzUGFnZUluZGV4O1xuICAgICAgICBpZiAocGFnZURlbHRhIDwgMCkge1xuICAgICAgICAgIHBhZ2VEZWx0YSAqPSAtMTtcbiAgICAgICAgICBzdGFydEluZGV4ID0gdGhpcy5pdGVtc1BlclBhZ2UgKiAocGFnZURlbHRhIC0gMSk7XG4gICAgICAgICAgdGhpcy5fZ2V0UGxheWJhY2tMaXN0KFxuICAgICAgICAgICAgdGhpcy5wbGF5YmFja0xpc3ROYW1lLFxuICAgICAgICAgICAgc3RhcnRJbmRleCxcbiAgICAgICAgICAgIHRoaXMuaXRlbXNQZXJQYWdlLFxuICAgICAgICAgICAgdGhpcy5maWx0ZXJzLFxuICAgICAgICAgICAgdGhpcy5zb3J0LFxuICAgICAgICAgICAgdGhpcy5fcHJldmlvdXNLZXksXG4gICAgICAgICAgICBudWxsXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdGFydEluZGV4ID0gdGhpcy5pdGVtc1BlclBhZ2UgKiAocGFnZURlbHRhIC0gMSk7XG4gICAgICAgICAgdGhpcy5fZ2V0UGxheWJhY2tMaXN0KFxuICAgICAgICAgICAgdGhpcy5wbGF5YmFja0xpc3ROYW1lLFxuICAgICAgICAgICAgc3RhcnRJbmRleCxcbiAgICAgICAgICAgIHRoaXMuaXRlbXNQZXJQYWdlLFxuICAgICAgICAgICAgdGhpcy5maWx0ZXJzLFxuICAgICAgICAgICAgdGhpcy5zb3J0LFxuICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgIHRoaXMuX25leHRLZXlcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXJ0SW5kZXggPSB0aGlzLml0ZW1zUGVyUGFnZSAqICh0aGlzLnBhZ2VJbmRleCAtIDEpO1xuICAgICAgdGhpcy5fZ2V0UGxheWJhY2tMaXN0KFxuICAgICAgICB0aGlzLnBsYXliYWNrTGlzdE5hbWUsXG4gICAgICAgIHN0YXJ0SW5kZXgsXG4gICAgICAgIHRoaXMuaXRlbXNQZXJQYWdlLFxuICAgICAgICB0aGlzLmZpbHRlcnMsXG4gICAgICAgIHRoaXMuc29ydCxcbiAgICAgICAgbnVsbCxcbiAgICAgICAgbnVsbFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIF9sb2FkU2NyaXB0cygpIHtcbiAgICBpZiAodGhpcy5zY3JpcHRTdG9yZSkge1xuICAgICAgYXdhaXQgdGhpcy5zY3JpcHRTZXJ2aWNlLmluaXQodGhpcy5zY3JpcHRTdG9yZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBfaW5pdFN1YnNjcmlwdGlvbnMoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgLy8gUGVyIHJvdyBzdWJzY3JpcHRpb25zXG4gICAgKHNlbGYuaXRlbVN1YnNjcmlwdGlvbkNvbmZpZ3VyYXRpb25zIHx8IFtdKS5mb3JFYWNoKChpdGVtU3Vic2NyaXB0aW9uQ29uZmlndXJhdGlvbjogU3Vic2NyaXB0aW9uQ29uZmlndXJhdGlvbikgPT4ge1xuICAgICAgaWYgKGl0ZW1TdWJzY3JpcHRpb25Db25maWd1cmF0aW9uKSB7XG4gICAgICAgIHNlbGYuX2RhdGFMaXN0LmZvckVhY2goYXN5bmMgKHJvdzogYW55KSA9PiB7XG4gICAgICAgICAgY29uc3Qgc3RyZWFtUmV2aXNpb25GdW5jdGlvbiA9IGl0ZW1TdWJzY3JpcHRpb25Db25maWd1cmF0aW9uLnN0cmVhbVJldmlzaW9uRnVuY3Rpb24gP1xuICAgICAgICAgICAgaXRlbVN1YnNjcmlwdGlvbkNvbmZpZ3VyYXRpb24uc3RyZWFtUmV2aXNpb25GdW5jdGlvbiA6ICgpID0+ICtyb3cuZ2V0KCdyZXZpc2lvbicpICsgMTtcblxuXG4gICAgICAgICAgY29uc3QgYWdncmVnYXRlSWQgPSBpdGVtU3Vic2NyaXB0aW9uQ29uZmlndXJhdGlvbi5yb3dJZEZ1bmN0aW9uID9cbiAgICAgICAgICAgICAgaXRlbVN1YnNjcmlwdGlvbkNvbmZpZ3VyYXRpb24ucm93SWRGdW5jdGlvbihyb3cudG9KUygpKSA6IHJvdy5nZXQoJ3Jvd0lkJyk7XG5cbiAgICAgICAgICBjb25zdCBxdWVyeTogUXVlcnkgPSBfY2xvbmUoaXRlbVN1YnNjcmlwdGlvbkNvbmZpZ3VyYXRpb24ucXVlcnkpO1xuICAgICAgICAgIHF1ZXJ5LmFnZ3JlZ2F0ZUlkID0gcXVlcnkuYWdncmVnYXRlSWQucmVwbGFjZShcbiAgICAgICAgICAgIC97e3Jvd0lkfX0vZyxcbiAgICAgICAgICAgIGFnZ3JlZ2F0ZUlkXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIGNvbnN0IHBsYXliYWNrU3Vic2NyaXB0aW9uVG9rZW4gPSBhd2FpdCBzZWxmLnBsYXliYWNrU2VydmljZS5yZWdpc3RlckZvclBsYXliYWNrKFxuICAgICAgICAgICAgc2VsZixcbiAgICAgICAgICAgIGl0ZW1TdWJzY3JpcHRpb25Db25maWd1cmF0aW9uLnBsYXliYWNrU2NyaXB0TmFtZSxcbiAgICAgICAgICAgIHF1ZXJ5LFxuICAgICAgICAgICAgc2VsZi5fc3RhdGVGdW5jdGlvbnMsXG4gICAgICAgICAgICBzZWxmLl9wbGF5YmFja0xpc3QsXG4gICAgICAgICAgICBzdHJlYW1SZXZpc2lvbkZ1bmN0aW9uLFxuICAgICAgICAgICAgcm93LmdldCgncm93SWQnKSxcbiAgICAgICAgICAgIGl0ZW1TdWJzY3JpcHRpb25Db25maWd1cmF0aW9uLmNvbmRpdGlvbixcbiAgICAgICAgICAgIGl0ZW1TdWJzY3JpcHRpb25Db25maWd1cmF0aW9uLnJvd0lkRnVuY3Rpb25cbiAgICAgICAgICApO1xuICAgICAgICAgIHRoaXMuX3BsYXliYWNrU3Vic2NyaXB0aW9uVG9rZW5zLnB1c2gocGxheWJhY2tTdWJzY3JpcHRpb25Ub2tlbik7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHNlbGYubGlzdFN1YnNjcmlwdGlvbkNvbmZpZ3VyYXRpb24pIHtcbiAgICAgIC8vIExpc3Qgc3Vic2NyaXB0aW9uXG4gICAgICB0aGlzLl9wbGF5YmFja1N1YnNjcmlwdGlvblRva2Vucy5wdXNoKFxuICAgICAgICBhd2FpdCBzZWxmLnBsYXliYWNrU2VydmljZS5yZWdpc3RlckZvclBsYXliYWNrKFxuICAgICAgICAgIHNlbGYsXG4gICAgICAgICAgc2VsZi5saXN0U3Vic2NyaXB0aW9uQ29uZmlndXJhdGlvbi5wbGF5YmFja1NjcmlwdE5hbWUsXG4gICAgICAgICAgc2VsZi5saXN0U3Vic2NyaXB0aW9uQ29uZmlndXJhdGlvbi5xdWVyeSxcbiAgICAgICAgICBzZWxmLl9zdGF0ZUZ1bmN0aW9ucyxcbiAgICAgICAgICBzZWxmLl9wbGF5YmFja0xpc3QsXG4gICAgICAgICAgKCkgPT4gMFxuICAgICAgICApXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2luaXRDdXN0b21QbGF5YmFja0NvbmZpZ3VyYXRpb25zKCkge1xuICAgIGlmICghX2lzRW1wdHkodGhpcy5jdXN0b21QbGF5YmFja0NvbmZpZ3VyYXRpb25zKSkge1xuICAgICAgdGhpcy5wbGF5YmFja1NlcnZpY2UucmVnaXN0ZXJDdXN0b21QbGF5YmFja3ModGhpcy5jdXN0b21QbGF5YmFja0NvbmZpZ3VyYXRpb25zKTtcbiAgICB9XG4gIH1cblxuICBfcmVzZXRTdWJzY3JpcHRpb25zKCkge1xuICAgIHRoaXMucGxheWJhY2tTZXJ2aWNlLnVucmVnaXN0ZXJGb3JQbGF5YmFjayh0aGlzLl9wbGF5YmFja1N1YnNjcmlwdGlvblRva2Vucyk7XG4gICAgdGhpcy5fcGxheWJhY2tTdWJzY3JpcHRpb25Ub2tlbnMgPSBbXTtcbiAgfVxuXG4gIF9vblVwZGF0ZShwYXlsb2FkOiBhbnkpIHtcbiAgICB0aGlzLnVwZGF0ZUVtaXR0ZXIuZW1pdChwYXlsb2FkKTtcbiAgfVxuXG4gIF9vbkdldExvb2t1cHMocGF5bG9hZDogYW55KSB7XG4gICAgdGhpcy5nZXRMb29rdXBzRW1pdHRlci5lbWl0KHBheWxvYWQpO1xuICB9XG5cbiAgX29uU2hvd01vZGFsKHBheWxvYWQ6IGFueSkge1xuICAgIHRoaXMuc2hvd01vZGFsRW1pdHRlci5lbWl0KHBheWxvYWQpO1xuICB9XG5cbiAgX29uRGVsZXRlKHBheWxvYWQ6IGFueSkge1xuICAgIHRoaXMuZGVsZXRlRW1pdHRlci5lbWl0KHBheWxvYWQpO1xuICB9XG5cbiAgZXhwb3J0Q1NWKG92ZXJyaWRlUGFyYW1zPzogUGxheWJhY2tMaXN0UmVxdWVzdCwgZmlsZU5hbWVPdmVycmlkZT86IHN0cmluZykge1xuICAgIGlmIChvdmVycmlkZVBhcmFtcykge1xuICAgICAgdGhpcy5fZXhwb3J0UGxheWJhY2tMaXN0U3ViamVjdC5uZXh0KHsgcGxheWJhY2tMaXN0UmVxdWVzdDogb3ZlcnJpZGVQYXJhbXMsIGZpbGVOYW1lT3ZlcnJpZGU6IGZpbGVOYW1lT3ZlcnJpZGUgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHN0YXJ0SW5kZXggPSB0aGlzLml0ZW1zUGVyUGFnZSAqICh0aGlzLnBhZ2VJbmRleCAtIDEpO1xuICAgICAgY29uc3QgZXhwb3J0UGxheWJhY2tMaXN0UmVxdWVzdFBhcmFtczogUGxheWJhY2tMaXN0UmVxdWVzdCA9IHtcbiAgICAgICAgcGxheWJhY2tMaXN0TmFtZTogdGhpcy5wbGF5YmFja0xpc3ROYW1lLFxuICAgICAgICBzdGFydEluZGV4OiBzdGFydEluZGV4LFxuICAgICAgICBsaW1pdDogMTAwMDAwMCxcbiAgICAgICAgZmlsdGVyczogdGhpcy5maWx0ZXJzLFxuICAgICAgICBzb3J0OiB0aGlzLnNvcnRcbiAgICAgIH07XG5cbiAgICAgIHRoaXMuX2V4cG9ydFBsYXliYWNrTGlzdFN1YmplY3QubmV4dCh7IHBsYXliYWNrTGlzdFJlcXVlc3Q6IGV4cG9ydFBsYXliYWNrTGlzdFJlcXVlc3RQYXJhbXMsIGZpbGVOYW1lT3ZlcnJpZGU6IGZpbGVOYW1lT3ZlcnJpZGUgfSk7XG4gICAgfVxuICB9XG5cbiAgLy8gTG9hZGluZyBPdmVybGF5IEZ1bmN0aW9uc1xuICBoaWRlTG9hZGluZ092ZXJsYXkoKSB7XG4gICAgY29uc3QgJCA9IHRoaXMuJDtcbiAgICAkKCdib2R5JykuY3NzKCdvdmVyZmxvdycsICcnKTtcbiAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2xvYWRpbmctYm9keScpO1xuICAgICQoYCNuZy1ldmVudHN0b3JlLWxpc3Rpbmctb3ZlcmxheS0ke3RoaXMuX2lkfWApLmhpZGUoKTtcbiAgfVxuXG4gIHNob3dMb2FkaW5nT3ZlcmxheSgpIHtcbiAgICBjb25zdCAkID0gdGhpcy4kO1xuICAgICQoYCNuZy1ldmVudHN0b3JlLWxpc3Rpbmctb3ZlcmxheS0ke3RoaXMuX2lkfWApLnNob3coKTtcbiAgICBpZiAodGhpcy5sb2FkaW5nVG9wQm91bmRTZWxlY3RvciA/IHRydWUgOiBmYWxzZSkge1xuICAgICAgdGhpcy5fZml4TG9hZGluZ092ZXJsYXlQb3NpdGlvbigpO1xuICAgIH1cbiAgfVxuXG4gIF9maXhMb2FkaW5nT3ZlcmxheVBvc2l0aW9uKCkge1xuICAgIGNvbnN0ICQgPSB0aGlzLiQ7XG4gICAgY29uc3Qgd2luZG93WSA9IHdpbmRvdy5wYWdlWU9mZnNldDtcbiAgICBjb25zdCBwYWdlSGVhZGVyU2VjdGlvbkhlaWdodCA9IDUzO1xuICAgIGNvbnN0IHBhZ2VIZWFkZXJTZWN0aW9uQm90dG9tWSA9ICQodGhpcy5sb2FkaW5nVG9wQm91bmRTZWxlY3Rvcikub2Zmc2V0KCkudG9wICsgcGFnZUhlYWRlclNlY3Rpb25IZWlnaHQ7XG4gICAgJCgnYm9keScpLmNzcygnb3ZlcmZsb3cnLCAnaGlkZGVuJyk7XG4gICAgJCgnYm9keScpLmFkZENsYXNzKCdsb2FkaW5nLWJvZHknKTtcbiAgICBpZiAod2luZG93WSA8IHBhZ2VIZWFkZXJTZWN0aW9uQm90dG9tWSkge1xuICAgICAgJChgI25nLWV2ZW50c3RvcmUtbGlzdGluZy1vdmVybGF5LSR7dGhpcy5faWR9YCkuY3NzKCdwb3NpdGlvbicsICdhYnNvbHV0ZScpO1xuICAgICAgJChgI25nLWV2ZW50c3RvcmUtbGlzdGluZy1vdmVybGF5LSR7dGhpcy5faWR9YCkuY3NzKCdoZWlnaHQnLCBgJHt3aW5kb3cuaW5uZXJIZWlnaHR9cHhgKTtcbiAgICAgICQoYCNuZy1ldmVudHN0b3JlLWxpc3Rpbmctb3ZlcmxheS0ke3RoaXMuX2lkfWApLmNzcygnd2lkdGgnLCAnMTAwJScpO1xuICAgICAgY29uc3QgcGFnZUhlYWRlckhlaWdodCA9IHBhZ2VIZWFkZXJTZWN0aW9uSGVpZ2h0O1xuICAgICAgJChgI25nLWV2ZW50c3RvcmUtbGlzdGluZy1vdmVybGF5LSR7dGhpcy5faWR9YCkuY3NzKCdtYXJnaW4tdG9wJywgYCR7cGFnZUhlYWRlckhlaWdodH1weGApO1xuICAgIH0gZWxzZSB7XG4gICAgICAkKGAjbmctZXZlbnRzdG9yZS1saXN0aW5nLW92ZXJsYXktJHt0aGlzLl9pZH1gKS5jc3MoJ3Bvc2l0aW9uJywgJ2ZpeGVkJyk7XG4gICAgICAkKGAjbmctZXZlbnRzdG9yZS1saXN0aW5nLW92ZXJsYXktJHt0aGlzLl9pZH1gKS5jc3MoJ2hlaWdodCcsICcxMDAlJyk7XG4gICAgICAkKGAjbmctZXZlbnRzdG9yZS1saXN0aW5nLW92ZXJsYXktJHt0aGlzLl9pZH1gKS5jc3MoJ21hcmdpbi10b3AnLCAnMHB4Jyk7XG4gICAgfVxuICB9XG59XG4iXX0=