(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common/http'), require('rxjs/operators'), require('immutable'), require('lodash-es/clone'), require('rxjs/Subject'), require('@angular/common'), require('socket.io-client')) :
	typeof define === 'function' && define.amd ? define('ng-eventstore-listing', ['exports', '@angular/core', '@angular/common/http', 'rxjs/operators', 'immutable', 'lodash-es/clone', 'rxjs/Subject', '@angular/common', 'socket.io-client'], factory) :
	(factory((global['ng-eventstore-listing'] = {}),global.ng.core,global.ng.common.http,global.Rx.Observable.prototype,global.immutable,global._clone,global.Rx,global.ng.common,global.io));
}(this, (function (exports,core,http,operators,immutable,_clone,Subject,common,io) { 'use strict';

_clone = _clone && _clone.hasOwnProperty('default') ? _clone['default'] : _clone;

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.
Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.
THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */






function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}
function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var ScriptService = /** @class */ (function () {
    function ScriptService() {
        this.scripts = {};
    }
    ScriptService.prototype.init = function (scriptStore) {
        var _this = this;
        scriptStore.forEach(function (script) {
            _this.scripts[script.name] = {
                loaded: false,
                src: script.src,
                meta: script.meta,
            };
        });
    };
    ScriptService.prototype.load = function () {
        var _this = this;
        var scripts = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            scripts[_i] = arguments[_i];
        }
        var promises = [];
        scripts.forEach(function (script) { return promises.push(_this.loadScript(script)); });
        return Promise.all(promises);
    };
    ScriptService.prototype.loadScript = function (name) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.scripts[name].loaded) {
                resolve({
                    script: name,
                    loaded: true,
                    status: 'Already Loaded',
                    meta: _this.scripts[name].meta,
                });
            }
            else {
                var script_1 = document.createElement('script');
                script_1.type = 'text/javascript';
                script_1.src = _this.scripts[name].src;
                if (script_1.readyState) {
                    script_1.onreadystatechange = function () {
                        if (script_1.readyState === 'loaded' ||
                            script_1.readyState === 'complete') {
                            script_1.onreadystatechange = null;
                            _this.scripts[name].loaded = true;
                            resolve({
                                script: name,
                                loaded: true,
                                status: 'Loaded',
                                meta: _this.scripts[name].meta,
                            });
                        }
                    };
                }
                else {
                    script_1.onload = function () {
                        _this.scripts[name].loaded = true;
                        resolve({
                            script: name,
                            loaded: true,
                            status: 'Loaded',
                            meta: _this.scripts[name].meta,
                        });
                    };
                }
                script_1.onerror = function (error) { return resolve({
                    script: name,
                    loaded: false,
                    status: 'Loaded',
                    meta: _this.scripts[name].meta,
                }); };
                document.getElementsByTagName('head')[0].appendChild(script_1);
            }
        });
    };
    return ScriptService;
}());
ScriptService.decorators = [
    { type: core.Injectable },
];
ScriptService.ctorParameters = function () { return []; };
var IO_TOKEN = new core.InjectionToken('io');
var PushService = /** @class */ (function () {
    function PushService(io$$1) {
        this.io = io$$1;
        this.subscriptions = {};
    }
    PushService.prototype.init = function (socketUrl) {
        this.ioPush = this.io(socketUrl + "/events");
        var self = this;
        this.ioPush.on('message', function (eventObj, token) {
            console.log('got message from push server: ', eventObj, token);
            var clientTokens = Object.keys(self.subscriptions);
            clientTokens.forEach(function (clientToken) {
                var sub = self.subscriptions[clientToken];
                if (sub.token === token) {
                    if (!isNaN(eventObj.streamRevision)) {
                        sub.offset = eventObj.streamRevision + 1;
                    }
                    if (typeof sub.cb === 'function') {
                        sub.cb(undefined, eventObj, sub.owner, clientToken);
                    }
                    var tags = Object.keys(sub.monitorTags);
                    tags.forEach(function (tag) {
                        if (eventObj._meta && eventObj._meta.tag === tag) {
                            var reason_1 = 'N/A';
                            if (typeof eventObj.eventType === 'string') {
                                reason_1 = eventObj.eventType;
                            }
                            else if (typeof eventObj.stateType === 'string') {
                                reason_1 = eventObj.stateType;
                                if (eventObj.eventSource &&
                                    typeof eventObj.eventSource.eventType === 'string') {
                                    reason_1 += " <- " + eventObj.eventSource.eventType;
                                }
                            }
                            var monitors = sub.monitorTags[tag];
                            monitors.forEach(function (monitor) {
                                monitor.callback(reason_1, eventObj._meta);
                            });
                        }
                    });
                }
            });
        });
    };
    PushService.prototype.subscribe = function (query, offset, owner, cb) {
        return __awaiter(this, void 0, void 0, function () {
            var clientToken;
            return __generator(this, function (_a) {
                clientToken = Math.random().toString(36).substr(2, 9) + '-' + Date.now().toString();
                this.subscriptions[clientToken] = {
                    query: query,
                    offset: offset,
                    owner: owner,
                    cb: cb,
                    monitorTags: {},
                };
                this.subscribeStreams();
                return [2 /*return*/, clientToken];
            });
        });
    };
    PushService.prototype.subscribeStreams = function () {
        var _this = this;
        if (this.ioPush.connected) {
            var clientTokens = Object.keys(this.subscriptions);
            clientTokens.forEach(function (clientToken) {
                var sub = _this.subscriptions[clientToken];
                if (!sub.token) {
                    var query_1 = Object.assign(sub.query, {
                        offset: sub.offset,
                    });
                    _this.ioPush.emit('subscribe', query_1, function (token) {
                        if (token) {
                            console.log('Server Subscribed:', token, query_1);
                            sub.token = token;
                        }
                        else {
                            console.error('Subscribe error for query', query_1);
                        }
                    });
                }
            });
        }
    };
    PushService.prototype.unsubscribe = function (clientToken) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var sub = _this.subscriptions[clientToken];
                if (sub) {
                    if (sub.token && _this.ioPush.connected) {
                        _this.ioPush.emit('unsubscribe', sub.token, function () {
                            resolve();
                        });
                    }
                    delete _this.subscriptions[clientToken];
                    resolve();
                }
                resolve();
            }
            catch (error) {
                reject(error);
                console.error('error in unsubscribing: ', error);
            }
        });
    };
    return PushService;
}());
PushService.decorators = [
    { type: core.Injectable },
];
PushService.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: core.Inject, args: [IO_TOKEN,] },] },
]; };
var PlaybackService = /** @class */ (function () {
    function PlaybackService(scriptService, pushService) {
        this.scriptService = scriptService;
        this.pushService = pushService;
        this.playbackRegistry = {};
    }
    PlaybackService.prototype.init = function (socketUrl) {
        this.pushService.init(socketUrl);
    };
    PlaybackService.prototype.unRegisterForPlayback = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pushService.unsubscribe(token)];
                    case 1:
                        _a.sent();
                        delete this.playbackRegistry[token];
                        return [2 /*return*/];
                }
            });
        });
    };
    PlaybackService.prototype.registerForPlayback = function (scriptName, owner, query, stateFunctions, offset, playbackList) {
        return __awaiter(this, void 0, void 0, function () {
            var script, playbackScript, subscriptionId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.scriptService.load(scriptName)];
                    case 1:
                        script = _a.sent();
                        playbackScript = window[script[0].meta.objectName];
                        return [4 /*yield*/, this.pushService.subscribe(query, offset, this, function (err, eventObj, owner2, token) {
                                var self = (owner2);
                                var registration = self.playbackRegistry[token];
                                if (eventObj.context === 'states') {
                                }
                                else {
                                    var playbackFunction = registration.playbackScript.playbackInterface[eventObj.payload.name];
                                    if (playbackFunction) {
                                        var row_1 = stateFunctions.getState(eventObj.aggregateId);
                                        var state = row_1.data;
                                        var funcs = {
                                            emit: function (targetQuery, payload, done) {
                                                done();
                                            },
                                            getPlaybackList: function (playbackListName, callback) {
                                                if (registration.playbackList) {
                                                    callback(null, registration.playbackList);
                                                }
                                                else {
                                                    callback(new Error('PlaybackList does not exist in this registration'), null);
                                                }
                                            },
                                        };
                                        var doneCallback = function () {
                                            stateFunctions.setState(row_1.rowId, row_1);
                                        };
                                        playbackFunction(state, eventObj, funcs, doneCallback);
                                    }
                                }
                            })];
                    case 2:
                        subscriptionId = _a.sent();
                        this.playbackRegistry[subscriptionId] = {
                            playbackScript: playbackScript,
                            owner: owner,
                            registrationId: subscriptionId,
                            playbackList: playbackList,
                        };
                        console.log('subscribed to playback: ', subscriptionId, query);
                        return [2 /*return*/, subscriptionId];
                }
            });
        });
    };
    return PlaybackService;
}());
PlaybackService.decorators = [
    { type: core.Injectable },
];
PlaybackService.ctorParameters = function () { return [
    { type: ScriptService, },
    { type: PushService, },
]; };
var PlaybackListService = /** @class */ (function () {
    function PlaybackListService(http$$1) {
        this.http = http$$1;
    }
    PlaybackListService.prototype.getPlaybackList = function (playbackListBaseUrl, playbackListName, startIndex, limit, filters, sort) {
        var url = playbackListBaseUrl + "/playback-list/" + playbackListName + "?startIndex=" + startIndex + "&limit=" + limit;
        if (filters) {
            url += "&filters=" + JSON.stringify(filters);
        }
        if (sort) {
            console.log(sort);
            url += "&sort=" + JSON.stringify(sort);
        }
        return this.http.get(url);
    };
    return PlaybackListService;
}());
PlaybackListService.decorators = [
    { type: core.Injectable },
];
PlaybackListService.ctorParameters = function () { return [
    { type: http.HttpClient, },
]; };
var NgEventstoreListingComponent = /** @class */ (function () {
    function NgEventstoreListingComponent(changeDetectorRef, scriptService, playbackService, playbackListService) {
        var _this = this;
        this.changeDetectorRef = changeDetectorRef;
        this.scriptService = scriptService;
        this.playbackService = playbackService;
        this.playbackListService = playbackListService;
        this.updateEmitter = new core.EventEmitter();
        this.updateLookupsEmitter = new core.EventEmitter();
        this.showModalEmitter = new core.EventEmitter();
        this.deleteEmitter = new core.EventEmitter();
        this.playbackListLoadedEmitter = new core.EventEmitter();
        this.lookups = {};
        this.filters = null;
        this.sort = null;
        this.pageIndex = 1;
        this.responseBasePath = 'data';
        this.initialized = false;
        this.getPlaybackListSubject = new Subject.Subject();
        this.subscriptionTokens = [];
        this.playbackList = {
            get: function (rowId, callback) {
                var rowIndex = _this.dataList.findIndex(function (value) {
                    return value.get('rowId') === rowId;
                });
                if (rowIndex > -1) {
                    callback(null, _this.dataList.get(rowIndex));
                }
                else {
                    callback(new Error("Row with rowId: " + rowIndex + " does not exist"), null);
                }
            },
            add: function (rowId, revision, data, meta, callback) {
                var newEntry = {
                    rowId: rowId,
                    revision: revision,
                    data: data,
                    meta: meta,
                };
                _this.changeDetectorRef.markForCheck();
                _this.dataList = _this.dataList.push(immutable.fromJS(newEntry));
                callback();
            },
            update: function (rowId, revision, oldData, newData, meta, callback) {
                var rowIndex = _this.dataList.findIndex(function (value) {
                    return value.get('rowId') === rowId;
                });
                var newEntry = immutable.fromJS({
                    rowId: rowId,
                    revision: revision,
                    data: Object.assign({}, oldData, newData),
                    meta: meta,
                });
                if (rowIndex > -1) {
                    _this.dataList = _this.dataList.set(rowIndex, newEntry);
                    _this.changeDetectorRef.markForCheck();
                    callback();
                }
                else {
                    callback(new Error("Row with rowId: " + rowIndex + " does not exist"));
                }
            },
            delete: function (rowId, callback) {
                var rowIndex = _this.dataList.findIndex(function (value) {
                    return value.get('rowId') === rowId;
                });
                if (rowIndex > -1) {
                    _this.dataList = _this.dataList.remove(rowIndex);
                    callback(null);
                }
                else {
                    callback(new Error("Row with rowId: " + rowIndex + " does not exist"));
                }
            },
        };
        this.stateFunctions = {
            getState: function (id) {
                var index = _this.dataList.findIndex(function (row) {
                    return row.get('rowId') === id;
                });
                return ((_this.dataList.get(index))).toJS();
            },
            setState: function (id, data) {
                var index = _this.dataList.findIndex(function (row) {
                    return row.get('rowId') === id;
                });
                _this.dataList = _this.dataList.set(index, immutable.fromJS(data));
                _this.changeDetectorRef.markForCheck();
            },
        };
    }
    NgEventstoreListingComponent.prototype.ngOnInit = function () {
        this.playbackService.init(this.socketUrl);
    };
    NgEventstoreListingComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        var self = this;
        if (!this.initialized) {
            this._initializeRequests();
            this._loadScripts();
            this.initialized = true;
        }
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
    };
    NgEventstoreListingComponent.prototype.ngOnDestroy = function () {
        this._resetSubscriptions();
    };
    NgEventstoreListingComponent.prototype.trackByFn = function (index, item) {
        return item.get('rowId');
    };
    NgEventstoreListingComponent.prototype._initializeRequests = function () {
        var _this = this;
        this.getPlaybackListSubscription = this.getPlaybackListSubject
            .pipe(operators.debounceTime(100), operators.switchMap(function (params) {
            return _this.playbackListService.getPlaybackList(_this.playbackListBaseUrl, params.playbackListName, params.startIndex, params.limit, params.filters, params.sort);
        }))
            .subscribe(function (res) {
            _this.dataList = immutable.fromJS(res.rows);
            _this.dataCount = res.rows.length;
            _this.dataTotalCount = res.count;
            _this._resetSubscriptions();
            _this._initSubscriptions();
            _this.changeDetectorRef.markForCheck();
            _this.playbackListLoadedEmitter.emit({
                totalItems: _this.dataTotalCount,
                dataCount: _this.dataCount,
            });
        });
    };
    NgEventstoreListingComponent.prototype.getPlaybackList = function (playbackListName, startIndex, limit, filters, sort) {
        var playbackListRequestParams = {
            playbackListName: playbackListName,
            startIndex: startIndex,
            limit: limit,
            filters: filters,
            sort: sort,
        };
        this.getPlaybackListSubject.next(playbackListRequestParams);
    };
    NgEventstoreListingComponent.prototype.requestPlaybackList = function () {
        var startIndex = this.itemsPerPage * (this.pageIndex - 1);
        this.getPlaybackList(this.playbackListName, startIndex, this.itemsPerPage, this.filters, this.sort);
    };
    NgEventstoreListingComponent.prototype._loadScripts = function () {
        if (this.scriptStore) {
            this.scriptService.init(this.scriptStore);
        }
    };
    NgEventstoreListingComponent.prototype._initSubscriptions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var self, _a, _b;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        self = this;
                        self.dataList.forEach(function (row) { return __awaiter(_this, void 0, void 0, function () {
                            var query, _a, _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        query = _clone(self.itemSubscriptionConfiguration.query);
                                        query.aggregateId = query.aggregateId.replace(/{{rowId}}/g, row.get('rowId'));
                                        _b = (_a = this.subscriptionTokens).push;
                                        return [4 /*yield*/, self.playbackService.registerForPlayback(self.itemSubscriptionConfiguration.playbackScriptName, self, query, self.stateFunctions, row.get('revision') + 1, self.playbackList)];
                                    case 1:
                                        _b.apply(_a, [_c.sent()]);
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        _b = (_a = this.subscriptionTokens).push;
                        return [4 /*yield*/, self.playbackService.registerForPlayback(self.listSubscriptionConfiguration.playbackScriptName, self, self.listSubscriptionConfiguration.query, self.stateFunctions, 0, self.playbackList)];
                    case 1:
                        _b.apply(_a, [_c.sent()]);
                        return [2 /*return*/];
                }
            });
        });
    };
    NgEventstoreListingComponent.prototype._resetSubscriptions = function () {
        var _this = this;
        this.subscriptionTokens.forEach(function (subscriptionToken) {
            _this.playbackService.unRegisterForPlayback(subscriptionToken);
        });
        this.subscriptionTokens = [];
    };
    NgEventstoreListingComponent.prototype.onUpdate = function (payload) {
        this.updateEmitter.emit(payload);
    };
    NgEventstoreListingComponent.prototype.onUpdateLookups = function (payload) {
        this.updateLookupsEmitter.emit(payload);
    };
    NgEventstoreListingComponent.prototype.onShowModal = function (payload) {
        this.showModalEmitter.emit(payload);
    };
    NgEventstoreListingComponent.prototype.onDelete = function (payload) {
        this.deleteEmitter.emit(payload);
    };
    return NgEventstoreListingComponent;
}());
NgEventstoreListingComponent.decorators = [
    { type: core.Component, args: [{
                selector: 'lib-ng-eventstore-listing',
                template: "<!-- <div *ngIf=\"listHeaderGroups && listHeaderGroups.groups && listHeaderGroups.groups.length > 0\"  [class]=\"'row ' + (listHeaderGroups && listHeaderGroups.generalRowClassName ? listHeaderGroups.generalRowClassName : '')\">\n  <div class=\"col-12\">\n    <div class=\"header bg-white p-2\">\n      <div [class]=\"'row ' + listHeaderGroups.generalRowClassName\">\n        <div *ngFor=\"let listHeaderGroup of listHeaderGroups.groups\" [class]=\"listHeaderGroup.className\">\n          <div [class]=\"'row ' + listHeaderGroups.generalRowClassName\">\n            <div *ngFor=\"let listHeader of listHeaderGroup.listHeaders\" [class]=\"listHeader.className\">\n              <span (click)=\"onSort(listHeader.sortProperty)\" [ngClass]=\"{ 'sort-header': listHeader.sortProperty }\">{{ listHeader.displayName }} <i *ngIf=\"sortFields[listHeader.sortProperty] && sortFields[listHeader.sortProperty].icon\" [class]=\"'sort-icon ' + sortFields[listHeader.sortProperty].icon\"></i></span>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div> -->\n<!-- <div [class]=\"'row ' + (listHeaderGroups && listHeaderGroups.generalRowClassName) ? listHeaderGroups.generalRowClassName : ''\" *ngFor=\"let item of dataList; trackBy: trackByFn\"> -->\n<div class=\"row\" *ngFor=\"let item of dataList; trackBy: trackByFn\">\n  <div class=\"col-12\">\n    <lib-item-template-holder\n      [data]=\"item\"\n      [itemComponentClass]=\"itemComponentClass\"\n      [lookups]=\"lookups\"\n      (updateEmitter)=\"onUpdate($event)\"\n      (updateLookupsEmitter)=\"onUpdateLookups($event)\"\n      (showModalEmitter)=\"onShowModal($event)\"\n      (deleteEmitter)=\"onDelete($event)\">\n    </lib-item-template-holder>\n  </div>\n</div>\n",
                styles: [],
                changeDetection: core.ChangeDetectionStrategy.OnPush,
            },] },
];
NgEventstoreListingComponent.ctorParameters = function () { return [
    { type: core.ChangeDetectorRef, },
    { type: ScriptService, },
    { type: PlaybackService, },
    { type: PlaybackListService, },
]; };
NgEventstoreListingComponent.propDecorators = {
    "updateEmitter": [{ type: core.Output },],
    "updateLookupsEmitter": [{ type: core.Output },],
    "showModalEmitter": [{ type: core.Output },],
    "deleteEmitter": [{ type: core.Output },],
    "playbackListLoadedEmitter": [{ type: core.Output },],
    "itemComponentClass": [{ type: core.Input },],
    "lookups": [{ type: core.Input },],
    "socketUrl": [{ type: core.Input },],
    "playbackListBaseUrl": [{ type: core.Input },],
    "scriptStore": [{ type: core.Input },],
    "itemSubscriptionConfiguration": [{ type: core.Input },],
    "listSubscriptionConfiguration": [{ type: core.Input },],
    "playbackListName": [{ type: core.Input },],
    "filters": [{ type: core.Input },],
    "sort": [{ type: core.Input },],
    "pageIndex": [{ type: core.Input },],
    "itemsPerPage": [{ type: core.Input },],
    "responseBasePath": [{ type: core.Input },],
};
var TemplateDirective = /** @class */ (function () {
    function TemplateDirective(viewContainerRef) {
        this.viewContainerRef = viewContainerRef;
    }
    return TemplateDirective;
}());
TemplateDirective.decorators = [
    { type: core.Directive, args: [{
                selector: '[libTemplateDirective]'
            },] },
];
TemplateDirective.ctorParameters = function () { return [
    { type: core.ViewContainerRef, },
]; };
var ItemTemplateHolderComponent = /** @class */ (function () {
    function ItemTemplateHolderComponent(componentFactoryResolver) {
        this.componentFactoryResolver = componentFactoryResolver;
        this.data = {};
        this.lookups = {};
        this.updateEmitter = new core.EventEmitter();
        this.updateLookupsEmitter = new core.EventEmitter();
        this.showModalEmitter = new core.EventEmitter();
        this.deleteEmitter = new core.EventEmitter();
    }
    ItemTemplateHolderComponent.prototype.ngOnInit = function () {
    };
    ItemTemplateHolderComponent.prototype.ngAfterViewInit = function () {
        this.loadComponent();
        if (this.initialChanges) {
            this.ngOnChanges(this.initialChanges);
            this.initialChanges = undefined;
        }
    };
    ItemTemplateHolderComponent.prototype.ngOnChanges = function (changes) {
        var self = this;
        if (self.componentRef) {
            var changesKeys = Object.keys(changes);
            changesKeys.forEach(function (key) {
                ((self.componentRef.instance))[key] =
                    changes[key].currentValue;
            });
            ((self.componentRef.instance)).ngOnChanges(changes);
        }
        else {
            this.initialChanges = changes;
        }
    };
    ItemTemplateHolderComponent.prototype.loadComponent = function () {
        var componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.itemComponentClass);
        var viewContainerRef = this.itemHost.viewContainerRef;
        viewContainerRef.clear();
        this.componentRef = viewContainerRef.createComponent(componentFactory);
        ((this.componentRef.instance)).data = this.data;
        ((this.componentRef
            .instance)).onUpdateEmitter = this.updateEmitter;
        ((this.componentRef
            .instance)).onUpdateLookupsEmitter = this.updateLookupsEmitter;
        ((this.componentRef
            .instance)).onShowModalEmitter = this.showModalEmitter;
        ((this.componentRef
            .instance)).onDeleteEmitter = this.deleteEmitter;
        ((this.componentRef
            .instance)).lookups = this.lookups;
        ((this.componentRef.instance)).ngOnInit();
    };
    return ItemTemplateHolderComponent;
}());
ItemTemplateHolderComponent.decorators = [
    { type: core.Component, args: [{
                selector: 'lib-item-template-holder',
                template: "<div class=\"row no-gutters\">\n  <div class=\"col-12\">\n    <ng-template libTemplateDirective></ng-template>\n  </div>\n</div>\n",
                styles: [""],
                changeDetection: core.ChangeDetectionStrategy.OnPush,
            },] },
];
ItemTemplateHolderComponent.ctorParameters = function () { return [
    { type: core.ComponentFactoryResolver, },
]; };
ItemTemplateHolderComponent.propDecorators = {
    "itemComponentClass": [{ type: core.Input },],
    "data": [{ type: core.Input },],
    "lookups": [{ type: core.Input },],
    "updateEmitter": [{ type: core.Output },],
    "updateLookupsEmitter": [{ type: core.Output },],
    "showModalEmitter": [{ type: core.Output },],
    "deleteEmitter": [{ type: core.Output },],
    "itemHost": [{ type: core.ViewChild, args: [TemplateDirective,] },],
};
var ɵ0 = io;
var NgEventstoreListingModule = /** @class */ (function () {
    function NgEventstoreListingModule() {
    }
    return NgEventstoreListingModule;
}());
NgEventstoreListingModule.decorators = [
    { type: core.NgModule, args: [{
                declarations: [
                    NgEventstoreListingComponent,
                    ItemTemplateHolderComponent,
                    TemplateDirective,
                ],
                imports: [common.CommonModule],
                exports: [
                    NgEventstoreListingComponent
                ],
                providers: [
                    ScriptService,
                    PlaybackService,
                    PlaybackListService,
                    PushService,
                    { provide: IO_TOKEN, useValue: ɵ0 }
                ]
            },] },
];
NgEventstoreListingModule.ctorParameters = function () { return []; };
var FilterOperator = {
    range: 'range',
    is: 'is',
    any: 'any',
    contains: 'contains',
};
var SortDirection = {
    ASC: 'ASC',
    DESC: 'DESC',
};
var GroupBooleanOperator = {
    and: 'and',
    or: 'or',
};
var ItemTemplateComponent = /** @class */ (function () {
    function ItemTemplateComponent(changeDetectorRef) {
        var _this = this;
        this.changeDetectorRef = changeDetectorRef;
        this.onUpdateEmitter = new core.EventEmitter();
        this.onUpdateLookupsEmitter = new core.EventEmitter();
        this.onShowModalEmitter = new core.EventEmitter();
        this.onDeleteEmitter = new core.EventEmitter();
        this.registerChangeFunction = function (changeFn) {
            _this._changeFn = changeFn;
        };
        this.onUpdate = function (propertyName, actionData) {
            var actionEventEmitterData = {
                propertyName: propertyName,
                id: _this.data.get(_this.idPropertyName),
                data: actionData,
            };
            _this.onUpdateEmitter.emit(actionEventEmitterData);
        };
        this.onUpdateLookups = function (lookup) {
            var actionEventEmitterData = {
                lookup: lookup,
            };
            _this.onUpdateLookupsEmitter.emit(actionEventEmitterData);
        };
        this.onShowModal = function (modalName, data) {
            var actionEventEmitterData = {
                modalName: modalName,
                id: _this.data.get(_this.idPropertyName),
                data: data,
            };
            _this.onShowModalEmitter.emit(actionEventEmitterData);
        };
        this.onDelete = function (actionData) {
            var actionEventEmitterData = {
                id: _this.data.get(_this.idPropertyName),
                data: actionData,
            };
            _this.onDeleteEmitter.emit(actionEventEmitterData);
        };
    }
    ItemTemplateComponent.prototype.ngOnInit = function () { };
    ItemTemplateComponent.prototype.ngOnChanges = function (changes) {
        if (this._changeFn) {
            this._changeFn(changes);
        }
        if (this.changeDetectorRef) {
            this.changeDetectorRef.detectChanges();
        }
    };
    return ItemTemplateComponent;
}());

exports.FilterOperator = FilterOperator;
exports.SortDirection = SortDirection;
exports.GroupBooleanOperator = GroupBooleanOperator;
exports.ItemTemplateComponent = ItemTemplateComponent;
exports.NgEventstoreListingModule = NgEventstoreListingModule;
exports.ɵg = ItemTemplateHolderComponent;
exports.ɵh = TemplateDirective;
exports.ɵa = NgEventstoreListingComponent;
exports.ɵf = PlaybackListService;
exports.ɵc = PlaybackService;
exports.ɵd = PushService;
exports.ɵb = ScriptService;
exports.ɵe = IO_TOKEN;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ng-eventstore-listing.umd.js.map
