import { __assign, __awaiter, __decorate, __generator, __param, __read } from "tslib";
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
var NgEventstoreListingComponent = /** @class */ (function () {
    function NgEventstoreListingComponent($, changeDetectorRef, scriptService, playbackService, playbackListService) {
        var _this = this;
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
            get: function (rowId, callback) {
                var rowIndex = _this._dataList.findIndex(function (value) {
                    return value.get('rowId') === rowId;
                });
                if (rowIndex > -1) {
                    var data = _this._dataList.get(rowIndex);
                    if (data) {
                        callback(null, data.toJS());
                    }
                    else {
                        callback(null, {});
                    }
                }
                else {
                    callback(new Error("Row with rowId: " + rowIndex + " does not exist"), null);
                }
            },
            add: function (rowId, revision, data, meta, callback) {
                // const newEntry = {
                //   rowId: rowId,
                //   revision: revision,
                //   data: data,
                //   meta: meta,
                // };
                // this.dataList = this.dataList.push(Immutable.fromJS(newEntry));
                // this.changeDetectorRef.detectChanges();
                // Do refresh trigger
                var newItem = {
                    rowId: rowId,
                    revision: revision,
                    data: data,
                    meta: meta
                };
                _this.newItemNotifyEmitter.emit(newItem);
                callback();
            },
            update: function (rowId, revision, oldData, newData, meta, callback) {
                var rowIndex = _this._dataList.findIndex(function (value) {
                    return value.get('rowId') === rowId;
                });
                // oldData is Immutable
                var newEntry = Immutable.fromJS({
                    rowId: rowId,
                    revision: revision,
                    data: __assign(__assign({}, oldData), newData),
                    meta: meta,
                });
                if (_this.debugging) {
                    console.log(newEntry);
                }
                if (rowIndex > -1) {
                    if (_this.debugging) {
                        console.log(rowIndex);
                        console.log(newEntry);
                        console.log(_this._dataList.toJS());
                    }
                    _this._dataList = _this._dataList.set(rowIndex, newEntry);
                    if (_this.debugging) {
                        console.log(_this._dataList.toJS());
                    }
                    _this.changeDetectorRef.detectChanges();
                    callback();
                }
                else {
                    callback(new Error("Row with rowId: " + rowIndex + " does not exist"));
                }
            },
            delete: function (rowId, callback) {
                var rowIndex = _this._dataList.findIndex(function (value) {
                    return value.get('rowId') === rowId;
                });
                if (rowIndex > -1) {
                    // this._dataList = this._dataList.remove(rowIndex);
                    _this.removedItemNotifyEmitter.emit(rowId);
                    callback(null);
                }
                else {
                    callback(new Error("Row with rowId: " + rowIndex + " does not exist"));
                }
            },
        };
        this._id = Helpers.generateToken();
        this._stateFunctions = {
            getState: function (id) {
                var index = _this._dataList.findIndex(function (row) {
                    return row.get('rowId') === id;
                });
                if (index > 0) {
                    return _this._dataList.get(index).toJS();
                }
                return {};
            },
            setState: function (id, data) {
                var index = _this._dataList.findIndex(function (row) {
                    return row.get('rowId') === id;
                });
                _this._dataList = _this._dataList.set(index, Immutable.fromJS(data));
                _this.changeDetectorRef.markForCheck();
            },
        };
    }
    NgEventstoreListingComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    NgEventstoreListingComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        var self = this;
        if (!self._initialized) {
            this._initialized = true;
            this._loadScripts().then(function () {
                _this._initializeRequests();
                _this.playbackService.init(_this.socketUrl);
                var changesKeys = Object.keys(changes);
                changesKeys.forEach(function (key) {
                    self[key] = changes[key].currentValue;
                    switch (key) {
                        case 'pageIndex':
                        case 'filters':
                        case 'sort': {
                            _this.requestPlaybackList();
                            break;
                        }
                    }
                });
            });
        }
        else {
            var changesKeys = Object.keys(changes);
            changesKeys.forEach(function (key) {
                if (key === 'pageIndex') {
                    self._previousPageIndex = changes[key].previousValue;
                }
                self[key] = changes[key].currentValue;
                switch (key) {
                    case 'pageIndex':
                    case 'filters':
                    case 'sort':
                    case 'playbackListName': {
                        _this.requestPlaybackList();
                        break;
                    }
                }
            });
        }
    };
    NgEventstoreListingComponent.prototype.ngOnDestroy = function () {
        this._resetSubscriptions();
        this.playbackService.resetCustomPlaybacks();
        this._initialized = false;
    };
    NgEventstoreListingComponent.prototype.trackByFn = function (index, item) {
        return item.get('rowId');
    };
    NgEventstoreListingComponent.prototype._initializeRequests = function () {
        var _this = this;
        var self = this;
        self._getPlaybackListSubscription = self._getPlaybackListSubject
            .pipe(debounceTime(100), switchMap(function (params) {
            return self.playbackListService.getPlaybackList(self.playbackListBaseUrl, params.playbackListName, params.startIndex, params.limit, params.filters, params.sort, params.previousKey, params.nextKey);
        }))
            .subscribe(function (res) {
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
        }, function (error) {
            self.getPlaybackLIstErrorEmitter.emit(error);
            if (self.enableLoadingOverlay) {
                self.hideLoadingOverlay();
            }
            self._isLoading = false;
        });
        self._exportPlaybackListSubscription = self._exportPlaybackListSubject
            .pipe(debounceTime(100), switchMap(function (params) {
            var playbackListRequest = params.playbackListRequest;
            return self.playbackListService.getPlaybackListCsv(self.playbackListBaseUrl, playbackListRequest.playbackListName, playbackListRequest.startIndex, playbackListRequest.limit, playbackListRequest.filters, playbackListRequest.sort, playbackListRequest.type).pipe(rxMap(function (response) {
                return [response, params.fileNameOverride];
            }));
        }))
            .subscribe(function (_a) {
            var _b = __read(_a, 2), result = _b[0], fileNameOverride = _b[1];
            var csv = new Blob([result], { type: 'text/csv' });
            var moment = moment_;
            var now = moment();
            var fileName = (fileNameOverride || _this.csvFileName || _this.playbackListName) + "-" + now.format('YYYY-MM-DD_HHmmss') + ".csv";
            saveAs(csv, fileName);
        });
    };
    NgEventstoreListingComponent.prototype._getPlaybackList = function (playbackListName, startIndex, limit, filters, sort, previousKey, nextKey) {
        var playbackListRequestParams = {
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
    };
    NgEventstoreListingComponent.prototype.requestPlaybackList = function () {
        var startIndex;
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
                var pageDelta = this.pageIndex - this._previousPageIndex;
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
    };
    NgEventstoreListingComponent.prototype._loadScripts = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.scriptStore) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.scriptService.init(this.scriptStore)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    NgEventstoreListingComponent.prototype._initSubscriptions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var self, _a, _b;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        self = this;
                        // Per row subscriptions
                        (self.itemSubscriptionConfigurations || []).forEach(function (itemSubscriptionConfiguration) {
                            if (itemSubscriptionConfiguration) {
                                self._dataList.forEach(function (row) { return __awaiter(_this, void 0, void 0, function () {
                                    var streamRevisionFunction, aggregateId, query, playbackSubscriptionToken;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                streamRevisionFunction = itemSubscriptionConfiguration.streamRevisionFunction ?
                                                    itemSubscriptionConfiguration.streamRevisionFunction : function () { return +row.get('revision') + 1; };
                                                aggregateId = itemSubscriptionConfiguration.rowIdFunction ?
                                                    itemSubscriptionConfiguration.rowIdFunction(row.toJS()) : row.get('rowId');
                                                query = _clone(itemSubscriptionConfiguration.query);
                                                query.aggregateId = query.aggregateId.replace(/{{rowId}}/g, aggregateId);
                                                return [4 /*yield*/, self.playbackService.registerForPlayback(self, itemSubscriptionConfiguration.playbackScriptName, query, self._stateFunctions, self._playbackList, streamRevisionFunction, row.get('rowId'), itemSubscriptionConfiguration.condition, itemSubscriptionConfiguration.rowIdFunction)];
                                            case 1:
                                                playbackSubscriptionToken = _a.sent();
                                                this._playbackSubscriptionTokens.push(playbackSubscriptionToken);
                                                return [2 /*return*/];
                                        }
                                    });
                                }); });
                            }
                        });
                        if (!self.listSubscriptionConfiguration) return [3 /*break*/, 2];
                        // List subscription
                        _b = (_a = this._playbackSubscriptionTokens).push;
                        return [4 /*yield*/, self.playbackService.registerForPlayback(self, self.listSubscriptionConfiguration.playbackScriptName, self.listSubscriptionConfiguration.query, self._stateFunctions, self._playbackList, function () { return 0; })];
                    case 1:
                        // List subscription
                        _b.apply(_a, [_c.sent()]);
                        _c.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    NgEventstoreListingComponent.prototype._initCustomPlaybackConfigurations = function () {
        if (!_isEmpty(this.customPlaybackConfigurations)) {
            this.playbackService.registerCustomPlaybacks(this.customPlaybackConfigurations);
        }
    };
    NgEventstoreListingComponent.prototype._resetSubscriptions = function () {
        this.playbackService.unregisterForPlayback(this._playbackSubscriptionTokens);
        this._playbackSubscriptionTokens = [];
    };
    NgEventstoreListingComponent.prototype._onUpdate = function (payload) {
        this.updateEmitter.emit(payload);
    };
    NgEventstoreListingComponent.prototype._onGetLookups = function (payload) {
        this.getLookupsEmitter.emit(payload);
    };
    NgEventstoreListingComponent.prototype._onShowModal = function (payload) {
        this.showModalEmitter.emit(payload);
    };
    NgEventstoreListingComponent.prototype._onDelete = function (payload) {
        this.deleteEmitter.emit(payload);
    };
    NgEventstoreListingComponent.prototype.exportCSV = function (overrideParams, fileNameOverride) {
        if (overrideParams) {
            this._exportPlaybackListSubject.next({ playbackListRequest: overrideParams, fileNameOverride: fileNameOverride });
        }
        else {
            var startIndex = this.itemsPerPage * (this.pageIndex - 1);
            var exportPlaybackListRequestParams = {
                playbackListName: this.playbackListName,
                startIndex: startIndex,
                limit: 1000000,
                filters: this.filters,
                sort: this.sort
            };
            this._exportPlaybackListSubject.next({ playbackListRequest: exportPlaybackListRequestParams, fileNameOverride: fileNameOverride });
        }
    };
    // Loading Overlay Functions
    NgEventstoreListingComponent.prototype.hideLoadingOverlay = function () {
        var $ = this.$;
        $('body').css('overflow', '');
        $('body').removeClass('loading-body');
        $("#ng-eventstore-listing-overlay-" + this._id).hide();
    };
    NgEventstoreListingComponent.prototype.showLoadingOverlay = function () {
        var $ = this.$;
        $("#ng-eventstore-listing-overlay-" + this._id).show();
        if (this.loadingTopBoundSelector ? true : false) {
            this._fixLoadingOverlayPosition();
        }
    };
    NgEventstoreListingComponent.prototype._fixLoadingOverlayPosition = function () {
        var $ = this.$;
        var windowY = window.pageYOffset;
        var pageHeaderSectionHeight = 53;
        var pageHeaderSectionBottomY = $(this.loadingTopBoundSelector).offset().top + pageHeaderSectionHeight;
        $('body').css('overflow', 'hidden');
        $('body').addClass('loading-body');
        if (windowY < pageHeaderSectionBottomY) {
            $("#ng-eventstore-listing-overlay-" + this._id).css('position', 'absolute');
            $("#ng-eventstore-listing-overlay-" + this._id).css('height', window.innerHeight + "px");
            $("#ng-eventstore-listing-overlay-" + this._id).css('width', '100%');
            var pageHeaderHeight = pageHeaderSectionHeight;
            $("#ng-eventstore-listing-overlay-" + this._id).css('margin-top', pageHeaderHeight + "px");
        }
        else {
            $("#ng-eventstore-listing-overlay-" + this._id).css('position', 'fixed');
            $("#ng-eventstore-listing-overlay-" + this._id).css('height', '100%');
            $("#ng-eventstore-listing-overlay-" + this._id).css('margin-top', '0px');
        }
    };
    NgEventstoreListingComponent.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Inject, args: [JQ_TOKEN,] }] },
        { type: ChangeDetectorRef },
        { type: ScriptService },
        { type: PlaybackService },
        { type: PlaybackListService }
    ]; };
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
    return NgEventstoreListingComponent;
}());
export { NgEventstoreListingComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctZXZlbnRzdG9yZS1saXN0aW5nLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25nLWV2ZW50c3RvcmUtbGlzdGluZy8iLCJzb3VyY2VzIjpbIm5nLWV2ZW50c3RvcmUtbGlzdGluZy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMxQyxPQUFPLEVBQ0wsU0FBUyxFQUNULE1BQU0sRUFDTixLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFDWixTQUFTLEVBQ1QsYUFBYSxFQUNiLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULE1BQU0sRUFDUCxNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBSSxHQUFHLElBQUksS0FBSyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDekUsT0FBTyxFQUFrQixPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDL0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBZ0JyRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDMUQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzlELE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBRXZFLE9BQU8sS0FBSyxTQUFTLE1BQU0sV0FBVyxDQUFDO0FBRXZDLE9BQU8sUUFBUSxNQUFNLG1CQUFtQixDQUFDO0FBR3pDLE9BQU8sTUFBTSxNQUFNLGlCQUFpQixDQUFDO0FBR3JDLE9BQU8sS0FBSyxPQUFPLE1BQU0sZ0JBQWdCLENBQUM7QUFFMUMsT0FBTyxNQUFNLE1BQU0sWUFBWSxDQUFDO0FBVWhDO0lBMktFLHNDQUMyQixDQUFNLEVBQ3ZCLGlCQUFvQyxFQUNwQyxhQUE0QixFQUM1QixlQUFnQyxFQUNoQyxtQkFBd0M7UUFM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O0lBQ3pCO1FBQVIsS0FBSyxFQUFFOzhEQUFxQjtJQUNwQjtRQUFSLEtBQUssRUFBRTttRUFBZTtJQUNkO1FBQVIsS0FBSyxFQUFFO3NFQUFzQjtJQUNyQjtRQUFSLEtBQUssRUFBRTswRUFBMkI7SUFDMUI7UUFBUixLQUFLLEVBQUU7OEVBQXFDO0lBQ3BDO1FBQVIsS0FBSyxFQUFFO3FFQUFrQjtJQUNqQjtRQUFSLEtBQUssRUFBRTtzRkFBNkQ7SUFDNUQ7UUFBUixLQUFLLEVBQUU7OEVBQTZCO0lBQzVCO1FBQVIsS0FBSyxFQUFFO2lGQUFpQztJQUNoQztRQUFSLEtBQUssRUFBRTtzRUFBd0I7SUFDdkI7UUFBUixLQUFLLEVBQUU7dUVBQXlCO0lBRXhCO1FBQVIsS0FBSyxFQUFFO21FQUFtQjtJQWhDaEIsNEJBQTRCO1FBUnhDLFNBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSwyQkFBMkI7WUFDckMseS9FQUFxRDtZQUlyRCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTs7U0FDaEQsQ0FBQztRQTZLRyxXQUFBLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQTtPQTVLUiw0QkFBNEIsQ0E2aEJ4QztJQUFELG1DQUFDO0NBQUEsQUE3aEJELElBNmhCQztTQTdoQlksNEJBQTRCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSGVscGVycyB9IGZyb20gJy4vdXRpbHMvaGVscGVycyc7XG5pbXBvcnQge1xuICBDb21wb25lbnQsXG4gIE9uSW5pdCxcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBPbkNoYW5nZXMsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgT25EZXN0cm95LFxuICBJbmplY3Rcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IHN3aXRjaE1hcCwgZGVib3VuY2VUaW1lICwgIG1hcCBhcyByeE1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiAsICBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBKUV9UT0tFTiB9IGZyb20gJy4vc2VydmljZXMvanF1ZXJ5LnNlcnZpY2UnO1xuXG5pbXBvcnQge1xuICBTdWJzY3JpcHRpb25Db25maWd1cmF0aW9uLFxuICBTY3JpcHQsXG4gIFBsYXliYWNrTGlzdCxcbiAgUm93SXRlbSxcbiAgRmlsdGVyLFxuICBRdWVyeSxcbiAgU29ydCxcbiAgUGxheWJhY2tMaXN0UmVxdWVzdCxcbiAgQ3VzdG9tUGxheWJhY2tDb25maWd1cmF0aW9uLFxuICBQbGF5YmFja0xpc3RSZXNwb25zZVxufSBmcm9tICcuL21vZGVscyc7XG5cblxuaW1wb3J0IHsgU2NyaXB0U2VydmljZSB9IGZyb20gJy4vc2VydmljZXMvc2NyaXB0LnNlcnZpY2UnO1xuaW1wb3J0IHsgUGxheWJhY2tTZXJ2aWNlIH0gZnJvbSAnLi9zZXJ2aWNlcy9wbGF5YmFjay5zZXJ2aWNlJztcbmltcG9ydCB7IFBsYXliYWNrTGlzdFNlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2VzL3BsYXliYWNrLWxpc3Quc2VydmljZSc7XG5cbmltcG9ydCAqIGFzIEltbXV0YWJsZSBmcm9tICdpbW11dGFibGUnO1xuaW1wb3J0IF9kZWZhdWx0c0RlZXAgZnJvbSAnbG9kYXNoLWVzL2RlZmF1bHRzRGVlcCc7XG5pbXBvcnQgX2lzRW1wdHkgZnJvbSAnbG9kYXNoLWVzL2lzRW1wdHknO1xuaW1wb3J0IF9pc0VxdWFsIGZyb20gJ2xvZGFzaC1lcy9pc0VxdWFsJztcbmltcG9ydCBfY2xvbmVEZWVwIGZyb20gJ2xvZGFzaC1lcy9jbG9uZURlZXAnO1xuaW1wb3J0IF9jbG9uZSBmcm9tICdsb2Rhc2gtZXMvY2xvbmUnO1xuaW1wb3J0IF91bmlxIGZyb20gJ2xvZGFzaC1lcy91bmlxJztcbmltcG9ydCBfbWVyZ2UgZnJvbSAnbG9kYXNoLWVzL2RlZmF1bHRzJztcbmltcG9ydCAqIGFzIG1vbWVudF8gZnJvbSAnbW9tZW50LW1pbmktdHMnO1xuXG5pbXBvcnQgc2F2ZUFzIGZyb20gJ2ZpbGUtc2F2ZXInO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdsaWItbmctZXZlbnRzdG9yZS1saXN0aW5nJyxcbiAgdGVtcGxhdGVVcmw6ICcuL25nLWV2ZW50c3RvcmUtbGlzdGluZy5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogW1xuICAgICcuL25nLWV2ZW50c3RvcmUtbGlzdGluZy5jb21wb25lbnQuY3NzJ1xuICBdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBOZ0V2ZW50c3RvcmVMaXN0aW5nQ29tcG9uZW50XG4gIGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gIEBPdXRwdXQoKSB1cGRhdGVFbWl0dGVyOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIGdldExvb2t1cHNFbWl0dGVyOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIHNob3dNb2RhbEVtaXR0ZXI6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgZGVsZXRlRW1pdHRlcjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBwbGF5YmFja0xpc3RMb2FkZWRFbWl0dGVyOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIG5ld0l0ZW1Ob3RpZnlFbWl0dGVyOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIHJlbW92ZWRJdGVtTm90aWZ5RW1pdHRlcjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBnZXRQbGF5YmFja0xJc3RFcnJvckVtaXR0ZXI6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIEBJbnB1dCgpIGl0ZW1Db21wb25lbnRDbGFzczogYW55O1xuICBASW5wdXQoKSBsb29rdXBzID0ge307XG4gIEBJbnB1dCgpIHNvY2tldFVybDogc3RyaW5nO1xuICBASW5wdXQoKSBwbGF5YmFja0xpc3RCYXNlVXJsOiBzdHJpbmc7XG4gIEBJbnB1dCgpIHNjcmlwdFN0b3JlOiBTY3JpcHRbXTtcbiAgQElucHV0KCkgaXRlbVN1YnNjcmlwdGlvbkNvbmZpZ3VyYXRpb25zOiBTdWJzY3JpcHRpb25Db25maWd1cmF0aW9uW10gPSBbXTtcbiAgQElucHV0KCkgbGlzdFN1YnNjcmlwdGlvbkNvbmZpZ3VyYXRpb246IFN1YnNjcmlwdGlvbkNvbmZpZ3VyYXRpb247XG4gIEBJbnB1dCgpIHBsYXliYWNrTGlzdE5hbWU6IHN0cmluZztcbiAgQElucHV0KCkgZmlsdGVyczogRmlsdGVyW10gPSBudWxsO1xuICBASW5wdXQoKSBzb3J0OiBTb3J0W10gPSBudWxsO1xuICBASW5wdXQoKSBwYWdlSW5kZXggPSAxO1xuICBASW5wdXQoKSBpdGVtc1BlclBhZ2U6IG51bWJlcjtcbiAgQElucHV0KCkgcmVzcG9uc2VCYXNlUGF0aCA9ICdkYXRhJztcbiAgQElucHV0KCkgZW1wdHlMaXN0RGlzcGxheVRleHQgPSAnTm8gUmVzdWx0cyc7XG4gIEBJbnB1dCgpIGNzdkZpbGVOYW1lID0gJyc7XG4gIEBJbnB1dCgpIGN1c3RvbVBsYXliYWNrQ29uZmlndXJhdGlvbnM6IEN1c3RvbVBsYXliYWNrQ29uZmlndXJhdGlvbltdO1xuICBASW5wdXQoKSBlbmFibGVMb2FkaW5nT3ZlcmxheSA9IHRydWU7XG4gIEBJbnB1dCgpIGxvYWRpbmdUb3BCb3VuZFNlbGVjdG9yOiBzdHJpbmc7XG4gIEBJbnB1dCgpIG1pbkhlaWdodENzcyA9ICc1MDBweCc7XG4gIEBJbnB1dCgpIGxvYWRpbmdPZmZzZXQgPSAnMjAwcHgnO1xuXG4gIEBJbnB1dCgpIGRlYnVnZ2luZyA9IGZhbHNlO1xuXG4gIF9kYXRhTGlzdDogSW1tdXRhYmxlLkxpc3Q8Um93SXRlbT47XG4gIF9kYXRhQ291bnQ6IG51bWJlcjtcbiAgX2RhdGFUb3RhbENvdW50OiBudW1iZXI7XG4gIF9wcmV2aW91c0tleTogc3RyaW5nO1xuICBfbmV4dEtleTogc3RyaW5nO1xuICBfcHJldmlvdXNQYWdlSW5kZXg6IG51bWJlcjtcbiAgX2luaXRpYWxpemVkID0gZmFsc2U7XG4gIF9pc0xvYWRpbmcgPSBmYWxzZTtcbiAgX2dldFBsYXliYWNrTGlzdFN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICBfZ2V0UGxheWJhY2tMaXN0U3ViamVjdDogU3ViamVjdDxQbGF5YmFja0xpc3RSZXF1ZXN0PiA9IG5ldyBTdWJqZWN0KCk7XG4gIF9leHBvcnRQbGF5YmFja0xpc3RTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgX2V4cG9ydFBsYXliYWNrTGlzdFN1YmplY3Q6IFN1YmplY3Q8YW55PiA9IG5ldyBTdWJqZWN0KCk7XG4gIF9wbGF5YmFja1N1YnNjcmlwdGlvblRva2Vuczogc3RyaW5nW10gPSBbXTtcbiAgX3BsYXliYWNrTGlzdDogUGxheWJhY2tMaXN0ID0ge1xuICAgIGdldDogKHJvd0lkOiBzdHJpbmcsIGNhbGxiYWNrOiAoZXJyLCBpdGVtKSA9PiB2b2lkKSA9PiB7XG4gICAgICBjb25zdCByb3dJbmRleCA9IHRoaXMuX2RhdGFMaXN0LmZpbmRJbmRleCgodmFsdWU6IGFueSkgPT4ge1xuICAgICAgICByZXR1cm4gdmFsdWUuZ2V0KCdyb3dJZCcpID09PSByb3dJZDtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAocm93SW5kZXggPiAtMSkge1xuICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5fZGF0YUxpc3QuZ2V0KHJvd0luZGV4KTtcbiAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICBjYWxsYmFjayhudWxsLCAoZGF0YSBhcyBhbnkpLnRvSlMoKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2FsbGJhY2sobnVsbCwge30pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoYFJvdyB3aXRoIHJvd0lkOiAke3Jvd0luZGV4fSBkb2VzIG5vdCBleGlzdGApLCBudWxsKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGFkZDogKFxuICAgICAgcm93SWQ6IHN0cmluZyxcbiAgICAgIHJldmlzaW9uOiBudW1iZXIsXG4gICAgICBkYXRhOiBhbnksXG4gICAgICBtZXRhOiBhbnksXG4gICAgICBjYWxsYmFjazogKGVycj86IGFueSkgPT4gdm9pZFxuICAgICkgPT4ge1xuICAgICAgLy8gY29uc3QgbmV3RW50cnkgPSB7XG4gICAgICAvLyAgIHJvd0lkOiByb3dJZCxcbiAgICAgIC8vICAgcmV2aXNpb246IHJldmlzaW9uLFxuICAgICAgLy8gICBkYXRhOiBkYXRhLFxuICAgICAgLy8gICBtZXRhOiBtZXRhLFxuICAgICAgLy8gfTtcbiAgICAgIC8vIHRoaXMuZGF0YUxpc3QgPSB0aGlzLmRhdGFMaXN0LnB1c2goSW1tdXRhYmxlLmZyb21KUyhuZXdFbnRyeSkpO1xuICAgICAgLy8gdGhpcy5jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAvLyBEbyByZWZyZXNoIHRyaWdnZXJcbiAgICAgIGNvbnN0IG5ld0l0ZW0gPSB7XG4gICAgICAgIHJvd0lkLFxuICAgICAgICByZXZpc2lvbixcbiAgICAgICAgZGF0YSxcbiAgICAgICAgbWV0YVxuICAgICAgfTtcbiAgICAgIHRoaXMubmV3SXRlbU5vdGlmeUVtaXR0ZXIuZW1pdChuZXdJdGVtKTtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfSxcbiAgICB1cGRhdGU6IChcbiAgICAgIHJvd0lkOiBzdHJpbmcsXG4gICAgICByZXZpc2lvbjogbnVtYmVyLFxuICAgICAgb2xkRGF0YTogYW55LFxuICAgICAgbmV3RGF0YTogYW55LFxuICAgICAgbWV0YTogYW55LFxuICAgICAgY2FsbGJhY2s6IChlcnI/KSA9PiB2b2lkXG4gICAgKSA9PiB7XG4gICAgICBjb25zdCByb3dJbmRleCA9IHRoaXMuX2RhdGFMaXN0LmZpbmRJbmRleCgodmFsdWU6IGFueSkgPT4ge1xuICAgICAgICByZXR1cm4gdmFsdWUuZ2V0KCdyb3dJZCcpID09PSByb3dJZDtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBvbGREYXRhIGlzIEltbXV0YWJsZVxuICAgICAgY29uc3QgbmV3RW50cnkgPSBJbW11dGFibGUuZnJvbUpTKHtcbiAgICAgICAgcm93SWQ6IHJvd0lkLFxuICAgICAgICByZXZpc2lvbjogcmV2aXNpb24sXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAuLi5vbGREYXRhLFxuICAgICAgICAgIC4uLm5ld0RhdGEsXG4gICAgICAgIH0sXG4gICAgICAgIG1ldGE6IG1ldGEsXG4gICAgICB9KTtcblxuICAgICAgaWYgKHRoaXMuZGVidWdnaW5nKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKG5ld0VudHJ5KTtcbiAgICAgIH1cblxuICAgICAgaWYgKHJvd0luZGV4ID4gLTEpIHtcbiAgICAgICAgaWYgKHRoaXMuZGVidWdnaW5nKSB7XG4gICAgICAgICAgY29uc29sZS5sb2cocm93SW5kZXgpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKG5ld0VudHJ5KTtcblxuICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuX2RhdGFMaXN0LnRvSlMoKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fZGF0YUxpc3QgPSB0aGlzLl9kYXRhTGlzdC5zZXQocm93SW5kZXgsIG5ld0VudHJ5KTtcblxuICAgICAgICBpZiAodGhpcy5kZWJ1Z2dpbmcpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLl9kYXRhTGlzdC50b0pTKCkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKGBSb3cgd2l0aCByb3dJZDogJHtyb3dJbmRleH0gZG9lcyBub3QgZXhpc3RgKSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBkZWxldGU6IChyb3dJZDogc3RyaW5nLCBjYWxsYmFjazogKGVycm9yPzogYW55KSA9PiB2b2lkKSA9PiB7XG4gICAgICBjb25zdCByb3dJbmRleCA9IHRoaXMuX2RhdGFMaXN0LmZpbmRJbmRleCgodmFsdWU6IGFueSkgPT4ge1xuICAgICAgICByZXR1cm4gdmFsdWUuZ2V0KCdyb3dJZCcpID09PSByb3dJZDtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAocm93SW5kZXggPiAtMSkge1xuICAgICAgICAvLyB0aGlzLl9kYXRhTGlzdCA9IHRoaXMuX2RhdGFMaXN0LnJlbW92ZShyb3dJbmRleCk7XG4gICAgICAgIHRoaXMucmVtb3ZlZEl0ZW1Ob3RpZnlFbWl0dGVyLmVtaXQocm93SWQpO1xuICAgICAgICBjYWxsYmFjayhudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihgUm93IHdpdGggcm93SWQ6ICR7cm93SW5kZXh9IGRvZXMgbm90IGV4aXN0YCkpO1xuICAgICAgfVxuICAgIH0sXG4gIH07XG5cbiAgX2lkOiBzdHJpbmcgPSBIZWxwZXJzLmdlbmVyYXRlVG9rZW4oKTtcblxuICBfc3RhdGVGdW5jdGlvbnMgPSB7XG4gICAgZ2V0U3RhdGU6IChpZDogc3RyaW5nKSA9PiB7XG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMuX2RhdGFMaXN0LmZpbmRJbmRleCgocm93OiBhbnkpID0+IHtcbiAgICAgICAgcmV0dXJuIHJvdy5nZXQoJ3Jvd0lkJykgPT09IGlkO1xuICAgICAgfSk7XG4gICAgICBpZiAoaW5kZXggPiAwKSB7XG4gICAgICAgIHJldHVybiAodGhpcy5fZGF0YUxpc3QuZ2V0KGluZGV4KSBhcyBhbnkpLnRvSlMoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHt9O1xuICAgIH0sXG4gICAgc2V0U3RhdGU6IChpZDogc3RyaW5nLCBkYXRhOiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fZGF0YUxpc3QuZmluZEluZGV4KChyb3c6IGFueSkgPT4ge1xuICAgICAgICByZXR1cm4gcm93LmdldCgncm93SWQnKSA9PT0gaWQ7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX2RhdGFMaXN0ID0gdGhpcy5fZGF0YUxpc3Quc2V0KGluZGV4LCBJbW11dGFibGUuZnJvbUpTKGRhdGEpKTtcbiAgICAgIHRoaXMuY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfSxcbiAgfTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBASW5qZWN0KEpRX1RPS0VOKSBwdWJsaWMgJDogYW55LFxuICAgIHByaXZhdGUgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByaXZhdGUgc2NyaXB0U2VydmljZTogU2NyaXB0U2VydmljZSxcbiAgICBwcml2YXRlIHBsYXliYWNrU2VydmljZTogUGxheWJhY2tTZXJ2aWNlLFxuICAgIHByaXZhdGUgcGxheWJhY2tMaXN0U2VydmljZTogUGxheWJhY2tMaXN0U2VydmljZVxuICApIHt9XG5cbiAgYXN5bmMgbmdPbkluaXQoKSB7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoIXNlbGYuX2luaXRpYWxpemVkKSB7XG4gICAgICB0aGlzLl9pbml0aWFsaXplZCA9IHRydWU7XG4gICAgICB0aGlzLl9sb2FkU2NyaXB0cygpLnRoZW4oKCkgPT4ge1xuICAgICAgICB0aGlzLl9pbml0aWFsaXplUmVxdWVzdHMoKTtcbiAgICAgICAgdGhpcy5wbGF5YmFja1NlcnZpY2UuaW5pdCh0aGlzLnNvY2tldFVybCk7XG4gICAgICAgIGNvbnN0IGNoYW5nZXNLZXlzID0gT2JqZWN0LmtleXMoY2hhbmdlcyk7XG4gICAgICAgIGNoYW5nZXNLZXlzLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgIHNlbGZba2V5XSA9IGNoYW5nZXNba2V5XS5jdXJyZW50VmFsdWU7XG4gICAgICAgICAgc3dpdGNoIChrZXkpIHtcbiAgICAgICAgICAgIGNhc2UgJ3BhZ2VJbmRleCc6XG4gICAgICAgICAgICBjYXNlICdmaWx0ZXJzJzpcbiAgICAgICAgICAgIGNhc2UgJ3NvcnQnOiB7XG4gICAgICAgICAgICAgIHRoaXMucmVxdWVzdFBsYXliYWNrTGlzdCgpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgY2hhbmdlc0tleXMgPSBPYmplY3Qua2V5cyhjaGFuZ2VzKTtcbiAgICAgIGNoYW5nZXNLZXlzLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICBpZiAoa2V5ID09PSAncGFnZUluZGV4Jykge1xuICAgICAgICAgIHNlbGYuX3ByZXZpb3VzUGFnZUluZGV4ID0gY2hhbmdlc1trZXldLnByZXZpb3VzVmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgc2VsZltrZXldID0gY2hhbmdlc1trZXldLmN1cnJlbnRWYWx1ZTtcbiAgICAgICAgc3dpdGNoIChrZXkpIHtcbiAgICAgICAgICBjYXNlICdwYWdlSW5kZXgnOlxuICAgICAgICAgIGNhc2UgJ2ZpbHRlcnMnOlxuICAgICAgICAgIGNhc2UgJ3NvcnQnOlxuICAgICAgICAgIGNhc2UgJ3BsYXliYWNrTGlzdE5hbWUnOiB7XG4gICAgICAgICAgICB0aGlzLnJlcXVlc3RQbGF5YmFja0xpc3QoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9yZXNldFN1YnNjcmlwdGlvbnMoKTtcbiAgICB0aGlzLnBsYXliYWNrU2VydmljZS5yZXNldEN1c3RvbVBsYXliYWNrcygpO1xuICAgIHRoaXMuX2luaXRpYWxpemVkID0gZmFsc2U7XG4gIH1cblxuICB0cmFja0J5Rm4oaW5kZXg6IG51bWJlciwgaXRlbTogYW55KSB7XG4gICAgcmV0dXJuIGl0ZW0uZ2V0KCdyb3dJZCcpO1xuICB9XG5cbiAgcHJpdmF0ZSBfaW5pdGlhbGl6ZVJlcXVlc3RzKCk6IHZvaWQge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHNlbGYuX2dldFBsYXliYWNrTGlzdFN1YnNjcmlwdGlvbiA9IHNlbGYuX2dldFBsYXliYWNrTGlzdFN1YmplY3RcbiAgICAgIC5waXBlKFxuICAgICAgICBkZWJvdW5jZVRpbWUoMTAwKSxcbiAgICAgICAgc3dpdGNoTWFwKChwYXJhbXMpID0+IHtcbiAgICAgICAgICByZXR1cm4gc2VsZi5wbGF5YmFja0xpc3RTZXJ2aWNlLmdldFBsYXliYWNrTGlzdChcbiAgICAgICAgICAgIHNlbGYucGxheWJhY2tMaXN0QmFzZVVybCxcbiAgICAgICAgICAgIHBhcmFtcy5wbGF5YmFja0xpc3ROYW1lLFxuICAgICAgICAgICAgcGFyYW1zLnN0YXJ0SW5kZXgsXG4gICAgICAgICAgICBwYXJhbXMubGltaXQsXG4gICAgICAgICAgICBwYXJhbXMuZmlsdGVycyxcbiAgICAgICAgICAgIHBhcmFtcy5zb3J0LFxuICAgICAgICAgICAgcGFyYW1zLnByZXZpb3VzS2V5LFxuICAgICAgICAgICAgcGFyYW1zLm5leHRLZXlcbiAgICAgICAgICApO1xuICAgICAgICB9KVxuICAgICAgKVxuICAgICAgLnN1YnNjcmliZSgocmVzOiBhbnkpID0+IHtcbiAgICAgICAgc2VsZi5fZGF0YUxpc3QgPSBJbW11dGFibGUuZnJvbUpTKHJlcy5yb3dzKTtcbiAgICAgICAgc2VsZi5fZGF0YUNvdW50ID0gcmVzLnJvd3MubGVuZ3RoO1xuICAgICAgICBzZWxmLl9kYXRhVG90YWxDb3VudCA9IHJlcy5jb3VudDtcbiAgICAgICAgc2VsZi5fcHJldmlvdXNLZXkgPSByZXMucHJldmlvdXNLZXk7XG4gICAgICAgIHNlbGYuX25leHRLZXkgPSByZXMubmV4dEtleTtcblxuICAgICAgICBzZWxmLl9yZXNldFN1YnNjcmlwdGlvbnMoKTtcbiAgICAgICAgc2VsZi5faW5pdFN1YnNjcmlwdGlvbnMoKTtcbiAgICAgICAgc2VsZi5faW5pdEN1c3RvbVBsYXliYWNrQ29uZmlndXJhdGlvbnMoKTtcblxuICAgICAgICBzZWxmLmNoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcblxuICAgICAgICBzZWxmLnBsYXliYWNrTGlzdExvYWRlZEVtaXR0ZXIuZW1pdCh7XG4gICAgICAgICAgdG90YWxJdGVtczogc2VsZi5fZGF0YVRvdGFsQ291bnQsXG4gICAgICAgICAgZGF0YUNvdW50OiBzZWxmLl9kYXRhQ291bnQsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChzZWxmLmVuYWJsZUxvYWRpbmdPdmVybGF5KSB7XG4gICAgICAgICAgc2VsZi5oaWRlTG9hZGluZ092ZXJsYXkoKTtcbiAgICAgICAgfVxuICAgICAgICBzZWxmLl9pc0xvYWRpbmcgPSBmYWxzZTtcbiAgICAgIH0sIChlcnJvcjogYW55KSA9PiB7XG4gICAgICAgIHNlbGYuZ2V0UGxheWJhY2tMSXN0RXJyb3JFbWl0dGVyLmVtaXQoZXJyb3IpO1xuICAgICAgICBpZiAoc2VsZi5lbmFibGVMb2FkaW5nT3ZlcmxheSkge1xuICAgICAgICAgIHNlbGYuaGlkZUxvYWRpbmdPdmVybGF5KCk7XG4gICAgICAgIH1cbiAgICAgICAgc2VsZi5faXNMb2FkaW5nID0gZmFsc2U7XG4gICAgICB9KTtcblxuICAgIHNlbGYuX2V4cG9ydFBsYXliYWNrTGlzdFN1YnNjcmlwdGlvbiA9IHNlbGYuX2V4cG9ydFBsYXliYWNrTGlzdFN1YmplY3RcbiAgICAucGlwZShcbiAgICAgIGRlYm91bmNlVGltZSgxMDApLFxuICAgICAgc3dpdGNoTWFwKChwYXJhbXMpID0+IHtcbiAgICAgICAgY29uc3QgcGxheWJhY2tMaXN0UmVxdWVzdCA9IHBhcmFtcy5wbGF5YmFja0xpc3RSZXF1ZXN0O1xuICAgICAgICByZXR1cm4gc2VsZi5wbGF5YmFja0xpc3RTZXJ2aWNlLmdldFBsYXliYWNrTGlzdENzdihcbiAgICAgICAgICBzZWxmLnBsYXliYWNrTGlzdEJhc2VVcmwsXG4gICAgICAgICAgcGxheWJhY2tMaXN0UmVxdWVzdC5wbGF5YmFja0xpc3ROYW1lLFxuICAgICAgICAgIHBsYXliYWNrTGlzdFJlcXVlc3Quc3RhcnRJbmRleCxcbiAgICAgICAgICBwbGF5YmFja0xpc3RSZXF1ZXN0LmxpbWl0LFxuICAgICAgICAgIHBsYXliYWNrTGlzdFJlcXVlc3QuZmlsdGVycyxcbiAgICAgICAgICBwbGF5YmFja0xpc3RSZXF1ZXN0LnNvcnQsXG4gICAgICAgICAgcGxheWJhY2tMaXN0UmVxdWVzdC50eXBlXG4gICAgICAgICkucGlwZShcbiAgICAgICAgICByeE1hcCgocmVzcG9uc2U6IFBsYXliYWNrTGlzdFJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gW3Jlc3BvbnNlLCBwYXJhbXMuZmlsZU5hbWVPdmVycmlkZV07XG4gICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICAgIH0pXG4gICAgKVxuICAgIC5zdWJzY3JpYmUoKFtyZXN1bHQsIGZpbGVOYW1lT3ZlcnJpZGVdKSA9PiB7XG4gICAgICBjb25zdCBjc3YgPSBuZXcgQmxvYihbcmVzdWx0XSwgeyB0eXBlOiAndGV4dC9jc3YnIH0pO1xuICAgICAgY29uc3QgbW9tZW50ID0gbW9tZW50XztcbiAgICAgIGNvbnN0IG5vdyA9IG1vbWVudCgpO1xuICAgICAgY29uc3QgZmlsZU5hbWUgPSBgJHtmaWxlTmFtZU92ZXJyaWRlIHx8IHRoaXMuY3N2RmlsZU5hbWUgfHwgdGhpcy5wbGF5YmFja0xpc3ROYW1lfS0ke25vdy5mb3JtYXQoJ1lZWVktTU0tRERfSEhtbXNzJyl9LmNzdmA7XG4gICAgICBzYXZlQXMoY3N2LCBmaWxlTmFtZSk7XG4gICAgfSk7XG4gIH1cblxuICBfZ2V0UGxheWJhY2tMaXN0KFxuICAgIHBsYXliYWNrTGlzdE5hbWU6IHN0cmluZyxcbiAgICBzdGFydEluZGV4OiBudW1iZXIsXG4gICAgbGltaXQ6IG51bWJlcixcbiAgICBmaWx0ZXJzPzogRmlsdGVyW10sXG4gICAgc29ydD86IFNvcnRbXSxcbiAgICBwcmV2aW91c0tleT86IHN0cmluZyxcbiAgICBuZXh0S2V5Pzogc3RyaW5nXG4gICkge1xuICAgIGNvbnN0IHBsYXliYWNrTGlzdFJlcXVlc3RQYXJhbXM6IFBsYXliYWNrTGlzdFJlcXVlc3QgPSB7XG4gICAgICBwbGF5YmFja0xpc3ROYW1lOiBwbGF5YmFja0xpc3ROYW1lLFxuICAgICAgc3RhcnRJbmRleDogc3RhcnRJbmRleCxcbiAgICAgIGxpbWl0OiBsaW1pdCxcbiAgICAgIGZpbHRlcnM6IGZpbHRlcnMsXG4gICAgICBzb3J0OiBzb3J0LFxuICAgICAgcHJldmlvdXNLZXk6IHByZXZpb3VzS2V5LFxuICAgICAgbmV4dEtleTogbmV4dEtleVxuICAgIH07XG4gICAgdGhpcy5faXNMb2FkaW5nID0gdHJ1ZTtcbiAgICBpZiAodGhpcy5lbmFibGVMb2FkaW5nT3ZlcmxheSkge1xuICAgICAgdGhpcy5zaG93TG9hZGluZ092ZXJsYXkoKTtcbiAgICB9XG4gICAgdGhpcy5fZ2V0UGxheWJhY2tMaXN0U3ViamVjdC5uZXh0KHBsYXliYWNrTGlzdFJlcXVlc3RQYXJhbXMpO1xuICB9XG5cbiAgcmVxdWVzdFBsYXliYWNrTGlzdCgpIHtcbiAgICBsZXQgc3RhcnRJbmRleDtcbiAgICBpZiAodGhpcy5wYWdlSW5kZXggPT09IDEpIHtcbiAgICAgIHRoaXMuX3ByZXZpb3VzUGFnZUluZGV4ID0gbnVsbDtcbiAgICAgIHRoaXMuX3ByZXZpb3VzS2V5ID0gbnVsbDtcbiAgICAgIHRoaXMuX25leHRLZXkgPSBudWxsO1xuICAgICAgc3RhcnRJbmRleCA9IDA7XG4gICAgICB0aGlzLl9nZXRQbGF5YmFja0xpc3QoXG4gICAgICAgIHRoaXMucGxheWJhY2tMaXN0TmFtZSxcbiAgICAgICAgc3RhcnRJbmRleCxcbiAgICAgICAgdGhpcy5pdGVtc1BlclBhZ2UsXG4gICAgICAgIHRoaXMuZmlsdGVycyxcbiAgICAgICAgdGhpcy5zb3J0LFxuICAgICAgICBudWxsLFxuICAgICAgICBudWxsXG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAodGhpcy5fcHJldmlvdXNLZXkgJiYgdGhpcy5fbmV4dEtleSkge1xuICAgICAgaWYgKHRoaXMuX2RhdGFUb3RhbENvdW50IC0gKHRoaXMucGFnZUluZGV4ICogdGhpcy5pdGVtc1BlclBhZ2UpIDw9IDApIHtcbiAgICAgICAgc3RhcnRJbmRleCA9IDA7XG4gICAgICAgIHRoaXMuX2dldFBsYXliYWNrTGlzdChcbiAgICAgICAgICB0aGlzLnBsYXliYWNrTGlzdE5hbWUsXG4gICAgICAgICAgc3RhcnRJbmRleCxcbiAgICAgICAgICB0aGlzLml0ZW1zUGVyUGFnZSxcbiAgICAgICAgICB0aGlzLmZpbHRlcnMsXG4gICAgICAgICAgdGhpcy5zb3J0LFxuICAgICAgICAgIG51bGwsXG4gICAgICAgICAgJ19fTEFTVCdcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBwYWdlRGVsdGEgPSB0aGlzLnBhZ2VJbmRleCAtIHRoaXMuX3ByZXZpb3VzUGFnZUluZGV4O1xuICAgICAgICBpZiAocGFnZURlbHRhIDwgMCkge1xuICAgICAgICAgIHBhZ2VEZWx0YSAqPSAtMTtcbiAgICAgICAgICBzdGFydEluZGV4ID0gdGhpcy5pdGVtc1BlclBhZ2UgKiAocGFnZURlbHRhIC0gMSk7XG4gICAgICAgICAgdGhpcy5fZ2V0UGxheWJhY2tMaXN0KFxuICAgICAgICAgICAgdGhpcy5wbGF5YmFja0xpc3ROYW1lLFxuICAgICAgICAgICAgc3RhcnRJbmRleCxcbiAgICAgICAgICAgIHRoaXMuaXRlbXNQZXJQYWdlLFxuICAgICAgICAgICAgdGhpcy5maWx0ZXJzLFxuICAgICAgICAgICAgdGhpcy5zb3J0LFxuICAgICAgICAgICAgdGhpcy5fcHJldmlvdXNLZXksXG4gICAgICAgICAgICBudWxsXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdGFydEluZGV4ID0gdGhpcy5pdGVtc1BlclBhZ2UgKiAocGFnZURlbHRhIC0gMSk7XG4gICAgICAgICAgdGhpcy5fZ2V0UGxheWJhY2tMaXN0KFxuICAgICAgICAgICAgdGhpcy5wbGF5YmFja0xpc3ROYW1lLFxuICAgICAgICAgICAgc3RhcnRJbmRleCxcbiAgICAgICAgICAgIHRoaXMuaXRlbXNQZXJQYWdlLFxuICAgICAgICAgICAgdGhpcy5maWx0ZXJzLFxuICAgICAgICAgICAgdGhpcy5zb3J0LFxuICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgIHRoaXMuX25leHRLZXlcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXJ0SW5kZXggPSB0aGlzLml0ZW1zUGVyUGFnZSAqICh0aGlzLnBhZ2VJbmRleCAtIDEpO1xuICAgICAgdGhpcy5fZ2V0UGxheWJhY2tMaXN0KFxuICAgICAgICB0aGlzLnBsYXliYWNrTGlzdE5hbWUsXG4gICAgICAgIHN0YXJ0SW5kZXgsXG4gICAgICAgIHRoaXMuaXRlbXNQZXJQYWdlLFxuICAgICAgICB0aGlzLmZpbHRlcnMsXG4gICAgICAgIHRoaXMuc29ydCxcbiAgICAgICAgbnVsbCxcbiAgICAgICAgbnVsbFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIF9sb2FkU2NyaXB0cygpIHtcbiAgICBpZiAodGhpcy5zY3JpcHRTdG9yZSkge1xuICAgICAgYXdhaXQgdGhpcy5zY3JpcHRTZXJ2aWNlLmluaXQodGhpcy5zY3JpcHRTdG9yZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBfaW5pdFN1YnNjcmlwdGlvbnMoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgLy8gUGVyIHJvdyBzdWJzY3JpcHRpb25zXG4gICAgKHNlbGYuaXRlbVN1YnNjcmlwdGlvbkNvbmZpZ3VyYXRpb25zIHx8IFtdKS5mb3JFYWNoKChpdGVtU3Vic2NyaXB0aW9uQ29uZmlndXJhdGlvbjogU3Vic2NyaXB0aW9uQ29uZmlndXJhdGlvbikgPT4ge1xuICAgICAgaWYgKGl0ZW1TdWJzY3JpcHRpb25Db25maWd1cmF0aW9uKSB7XG4gICAgICAgIHNlbGYuX2RhdGFMaXN0LmZvckVhY2goYXN5bmMgKHJvdzogYW55KSA9PiB7XG4gICAgICAgICAgY29uc3Qgc3RyZWFtUmV2aXNpb25GdW5jdGlvbiA9IGl0ZW1TdWJzY3JpcHRpb25Db25maWd1cmF0aW9uLnN0cmVhbVJldmlzaW9uRnVuY3Rpb24gP1xuICAgICAgICAgICAgaXRlbVN1YnNjcmlwdGlvbkNvbmZpZ3VyYXRpb24uc3RyZWFtUmV2aXNpb25GdW5jdGlvbiA6ICgpID0+ICtyb3cuZ2V0KCdyZXZpc2lvbicpICsgMTtcblxuXG4gICAgICAgICAgY29uc3QgYWdncmVnYXRlSWQgPSBpdGVtU3Vic2NyaXB0aW9uQ29uZmlndXJhdGlvbi5yb3dJZEZ1bmN0aW9uID9cbiAgICAgICAgICAgICAgaXRlbVN1YnNjcmlwdGlvbkNvbmZpZ3VyYXRpb24ucm93SWRGdW5jdGlvbihyb3cudG9KUygpKSA6IHJvdy5nZXQoJ3Jvd0lkJyk7XG5cbiAgICAgICAgICBjb25zdCBxdWVyeTogUXVlcnkgPSBfY2xvbmUoaXRlbVN1YnNjcmlwdGlvbkNvbmZpZ3VyYXRpb24ucXVlcnkpO1xuICAgICAgICAgIHF1ZXJ5LmFnZ3JlZ2F0ZUlkID0gcXVlcnkuYWdncmVnYXRlSWQucmVwbGFjZShcbiAgICAgICAgICAgIC97e3Jvd0lkfX0vZyxcbiAgICAgICAgICAgIGFnZ3JlZ2F0ZUlkXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIGNvbnN0IHBsYXliYWNrU3Vic2NyaXB0aW9uVG9rZW4gPSBhd2FpdCBzZWxmLnBsYXliYWNrU2VydmljZS5yZWdpc3RlckZvclBsYXliYWNrKFxuICAgICAgICAgICAgc2VsZixcbiAgICAgICAgICAgIGl0ZW1TdWJzY3JpcHRpb25Db25maWd1cmF0aW9uLnBsYXliYWNrU2NyaXB0TmFtZSxcbiAgICAgICAgICAgIHF1ZXJ5LFxuICAgICAgICAgICAgc2VsZi5fc3RhdGVGdW5jdGlvbnMsXG4gICAgICAgICAgICBzZWxmLl9wbGF5YmFja0xpc3QsXG4gICAgICAgICAgICBzdHJlYW1SZXZpc2lvbkZ1bmN0aW9uLFxuICAgICAgICAgICAgcm93LmdldCgncm93SWQnKSxcbiAgICAgICAgICAgIGl0ZW1TdWJzY3JpcHRpb25Db25maWd1cmF0aW9uLmNvbmRpdGlvbixcbiAgICAgICAgICAgIGl0ZW1TdWJzY3JpcHRpb25Db25maWd1cmF0aW9uLnJvd0lkRnVuY3Rpb25cbiAgICAgICAgICApO1xuICAgICAgICAgIHRoaXMuX3BsYXliYWNrU3Vic2NyaXB0aW9uVG9rZW5zLnB1c2gocGxheWJhY2tTdWJzY3JpcHRpb25Ub2tlbik7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHNlbGYubGlzdFN1YnNjcmlwdGlvbkNvbmZpZ3VyYXRpb24pIHtcbiAgICAgIC8vIExpc3Qgc3Vic2NyaXB0aW9uXG4gICAgICB0aGlzLl9wbGF5YmFja1N1YnNjcmlwdGlvblRva2Vucy5wdXNoKFxuICAgICAgICBhd2FpdCBzZWxmLnBsYXliYWNrU2VydmljZS5yZWdpc3RlckZvclBsYXliYWNrKFxuICAgICAgICAgIHNlbGYsXG4gICAgICAgICAgc2VsZi5saXN0U3Vic2NyaXB0aW9uQ29uZmlndXJhdGlvbi5wbGF5YmFja1NjcmlwdE5hbWUsXG4gICAgICAgICAgc2VsZi5saXN0U3Vic2NyaXB0aW9uQ29uZmlndXJhdGlvbi5xdWVyeSxcbiAgICAgICAgICBzZWxmLl9zdGF0ZUZ1bmN0aW9ucyxcbiAgICAgICAgICBzZWxmLl9wbGF5YmFja0xpc3QsXG4gICAgICAgICAgKCkgPT4gMFxuICAgICAgICApXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2luaXRDdXN0b21QbGF5YmFja0NvbmZpZ3VyYXRpb25zKCkge1xuICAgIGlmICghX2lzRW1wdHkodGhpcy5jdXN0b21QbGF5YmFja0NvbmZpZ3VyYXRpb25zKSkge1xuICAgICAgdGhpcy5wbGF5YmFja1NlcnZpY2UucmVnaXN0ZXJDdXN0b21QbGF5YmFja3ModGhpcy5jdXN0b21QbGF5YmFja0NvbmZpZ3VyYXRpb25zKTtcbiAgICB9XG4gIH1cblxuICBfcmVzZXRTdWJzY3JpcHRpb25zKCkge1xuICAgIHRoaXMucGxheWJhY2tTZXJ2aWNlLnVucmVnaXN0ZXJGb3JQbGF5YmFjayh0aGlzLl9wbGF5YmFja1N1YnNjcmlwdGlvblRva2Vucyk7XG4gICAgdGhpcy5fcGxheWJhY2tTdWJzY3JpcHRpb25Ub2tlbnMgPSBbXTtcbiAgfVxuXG4gIF9vblVwZGF0ZShwYXlsb2FkOiBhbnkpIHtcbiAgICB0aGlzLnVwZGF0ZUVtaXR0ZXIuZW1pdChwYXlsb2FkKTtcbiAgfVxuXG4gIF9vbkdldExvb2t1cHMocGF5bG9hZDogYW55KSB7XG4gICAgdGhpcy5nZXRMb29rdXBzRW1pdHRlci5lbWl0KHBheWxvYWQpO1xuICB9XG5cbiAgX29uU2hvd01vZGFsKHBheWxvYWQ6IGFueSkge1xuICAgIHRoaXMuc2hvd01vZGFsRW1pdHRlci5lbWl0KHBheWxvYWQpO1xuICB9XG5cbiAgX29uRGVsZXRlKHBheWxvYWQ6IGFueSkge1xuICAgIHRoaXMuZGVsZXRlRW1pdHRlci5lbWl0KHBheWxvYWQpO1xuICB9XG5cbiAgZXhwb3J0Q1NWKG92ZXJyaWRlUGFyYW1zPzogUGxheWJhY2tMaXN0UmVxdWVzdCwgZmlsZU5hbWVPdmVycmlkZT86IHN0cmluZykge1xuICAgIGlmIChvdmVycmlkZVBhcmFtcykge1xuICAgICAgdGhpcy5fZXhwb3J0UGxheWJhY2tMaXN0U3ViamVjdC5uZXh0KHsgcGxheWJhY2tMaXN0UmVxdWVzdDogb3ZlcnJpZGVQYXJhbXMsIGZpbGVOYW1lT3ZlcnJpZGU6IGZpbGVOYW1lT3ZlcnJpZGUgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHN0YXJ0SW5kZXggPSB0aGlzLml0ZW1zUGVyUGFnZSAqICh0aGlzLnBhZ2VJbmRleCAtIDEpO1xuICAgICAgY29uc3QgZXhwb3J0UGxheWJhY2tMaXN0UmVxdWVzdFBhcmFtczogUGxheWJhY2tMaXN0UmVxdWVzdCA9IHtcbiAgICAgICAgcGxheWJhY2tMaXN0TmFtZTogdGhpcy5wbGF5YmFja0xpc3ROYW1lLFxuICAgICAgICBzdGFydEluZGV4OiBzdGFydEluZGV4LFxuICAgICAgICBsaW1pdDogMTAwMDAwMCxcbiAgICAgICAgZmlsdGVyczogdGhpcy5maWx0ZXJzLFxuICAgICAgICBzb3J0OiB0aGlzLnNvcnRcbiAgICAgIH07XG5cbiAgICAgIHRoaXMuX2V4cG9ydFBsYXliYWNrTGlzdFN1YmplY3QubmV4dCh7IHBsYXliYWNrTGlzdFJlcXVlc3Q6IGV4cG9ydFBsYXliYWNrTGlzdFJlcXVlc3RQYXJhbXMsIGZpbGVOYW1lT3ZlcnJpZGU6IGZpbGVOYW1lT3ZlcnJpZGUgfSk7XG4gICAgfVxuICB9XG5cbiAgLy8gTG9hZGluZyBPdmVybGF5IEZ1bmN0aW9uc1xuICBoaWRlTG9hZGluZ092ZXJsYXkoKSB7XG4gICAgY29uc3QgJCA9IHRoaXMuJDtcbiAgICAkKCdib2R5JykuY3NzKCdvdmVyZmxvdycsICcnKTtcbiAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2xvYWRpbmctYm9keScpO1xuICAgICQoYCNuZy1ldmVudHN0b3JlLWxpc3Rpbmctb3ZlcmxheS0ke3RoaXMuX2lkfWApLmhpZGUoKTtcbiAgfVxuXG4gIHNob3dMb2FkaW5nT3ZlcmxheSgpIHtcbiAgICBjb25zdCAkID0gdGhpcy4kO1xuICAgICQoYCNuZy1ldmVudHN0b3JlLWxpc3Rpbmctb3ZlcmxheS0ke3RoaXMuX2lkfWApLnNob3coKTtcbiAgICBpZiAodGhpcy5sb2FkaW5nVG9wQm91bmRTZWxlY3RvciA/IHRydWUgOiBmYWxzZSkge1xuICAgICAgdGhpcy5fZml4TG9hZGluZ092ZXJsYXlQb3NpdGlvbigpO1xuICAgIH1cbiAgfVxuXG4gIF9maXhMb2FkaW5nT3ZlcmxheVBvc2l0aW9uKCkge1xuICAgIGNvbnN0ICQgPSB0aGlzLiQ7XG4gICAgY29uc3Qgd2luZG93WSA9IHdpbmRvdy5wYWdlWU9mZnNldDtcbiAgICBjb25zdCBwYWdlSGVhZGVyU2VjdGlvbkhlaWdodCA9IDUzO1xuICAgIGNvbnN0IHBhZ2VIZWFkZXJTZWN0aW9uQm90dG9tWSA9ICQodGhpcy5sb2FkaW5nVG9wQm91bmRTZWxlY3Rvcikub2Zmc2V0KCkudG9wICsgcGFnZUhlYWRlclNlY3Rpb25IZWlnaHQ7XG4gICAgJCgnYm9keScpLmNzcygnb3ZlcmZsb3cnLCAnaGlkZGVuJyk7XG4gICAgJCgnYm9keScpLmFkZENsYXNzKCdsb2FkaW5nLWJvZHknKTtcbiAgICBpZiAod2luZG93WSA8IHBhZ2VIZWFkZXJTZWN0aW9uQm90dG9tWSkge1xuICAgICAgJChgI25nLWV2ZW50c3RvcmUtbGlzdGluZy1vdmVybGF5LSR7dGhpcy5faWR9YCkuY3NzKCdwb3NpdGlvbicsICdhYnNvbHV0ZScpO1xuICAgICAgJChgI25nLWV2ZW50c3RvcmUtbGlzdGluZy1vdmVybGF5LSR7dGhpcy5faWR9YCkuY3NzKCdoZWlnaHQnLCBgJHt3aW5kb3cuaW5uZXJIZWlnaHR9cHhgKTtcbiAgICAgICQoYCNuZy1ldmVudHN0b3JlLWxpc3Rpbmctb3ZlcmxheS0ke3RoaXMuX2lkfWApLmNzcygnd2lkdGgnLCAnMTAwJScpO1xuICAgICAgY29uc3QgcGFnZUhlYWRlckhlaWdodCA9IHBhZ2VIZWFkZXJTZWN0aW9uSGVpZ2h0O1xuICAgICAgJChgI25nLWV2ZW50c3RvcmUtbGlzdGluZy1vdmVybGF5LSR7dGhpcy5faWR9YCkuY3NzKCdtYXJnaW4tdG9wJywgYCR7cGFnZUhlYWRlckhlaWdodH1weGApO1xuICAgIH0gZWxzZSB7XG4gICAgICAkKGAjbmctZXZlbnRzdG9yZS1saXN0aW5nLW92ZXJsYXktJHt0aGlzLl9pZH1gKS5jc3MoJ3Bvc2l0aW9uJywgJ2ZpeGVkJyk7XG4gICAgICAkKGAjbmctZXZlbnRzdG9yZS1saXN0aW5nLW92ZXJsYXktJHt0aGlzLl9pZH1gKS5jc3MoJ2hlaWdodCcsICcxMDAlJyk7XG4gICAgICAkKGAjbmctZXZlbnRzdG9yZS1saXN0aW5nLW92ZXJsYXktJHt0aGlzLl9pZH1gKS5jc3MoJ21hcmdpbi10b3AnLCAnMHB4Jyk7XG4gICAgfVxuICB9XG59XG4iXX0=