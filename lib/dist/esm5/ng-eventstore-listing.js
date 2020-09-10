import { __awaiter, __generator } from 'tslib';
import { Injectable, Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, Directive, ViewContainerRef, ViewChild, ComponentFactoryResolver, NgModule } from '@angular/core';
import _forOwn from 'lodash-es/forOwn';
import _clone from 'lodash-es/clone';
import { connect } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { switchMap, debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { fromJS } from 'immutable';
import * as moment_ from 'moment-mini-ts';
import saveAs from 'file-saver';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';

var ScriptService = /** @class */ (function () {
    function ScriptService() {
        this.scripts = {};
    }
    ScriptService.prototype.init = function (scriptStore) {
        return __awaiter(this, void 0, void 0, function () {
            var promises;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promises = [];
                        scriptStore.forEach(function (script) {
                            _this.scripts[script.name] = {
                                loaded: false,
                                src: script.src,
                                meta: script.meta,
                            };
                            promises.push(_this.load(script.name));
                        });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ScriptService.prototype.load = function () {
        var scripts = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            scripts[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var promises;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promises = [];
                        scripts.forEach(function (script) { return promises.push(_this.loadScript(script)); });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
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
                var existingScript = document.querySelectorAll("head script[src=\"" + _this.scripts[name].src + "\"]");
                if (existingScript.length === 0) {
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
                    script_1.onerror = function (error) { return console.log('ON ERROR', error); };
                    resolve({
                        script: name,
                        loaded: false,
                        status: 'Loaded',
                        meta: _this.scripts[name].meta,
                    });
                    document.getElementsByTagName('head')[0].appendChild(script_1);
                }
                else {
                    resolve();
                }
            }
        });
    };
    ScriptService.prototype.getScript = function (scriptName) {
        return this.scripts[scriptName];
    };
    return ScriptService;
}());
ScriptService.decorators = [
    { type: Injectable },
];
ScriptService.ctorParameters = function () { return []; };
var Helpers = {
    generateToken: function () {
        return Math.random().toString(36).substr(2, 9) + '-' + Date.now().toString();
    }
};
var PushService = /** @class */ (function () {
    function PushService() {
        this.subscriptions = {};
    }
    PushService.prototype.init = function (socketUrl) {
        var _this = this;
        if (!this.ioPush) {
            this.ioPush = connect(socketUrl + "/events");
            this.ioPush.on('message', function (eventObj) {
                _this._processEvent(eventObj);
            });
            this.ioPush.on('reconnect', function () {
                _forOwn(_this.subscriptions, function (sub) {
                    var subscriptionQuery = Object.assign(sub.query, {
                        offset: sub.offset,
                    });
                    _this.ioPush.emit('subscribe', subscriptionQuery, function (token) {
                        if (token) {
                            sub.token = token;
                        }
                        else {
                            console.error('Reconnect error for query', subscriptionQuery);
                        }
                    });
                });
            });
        }
    };
    PushService.prototype._processEvent = function (eventObj) {
        var self = this;
        var queryKey = eventObj.context + "." + eventObj.aggregate + "." + eventObj.aggregateId;
        var clientTokens = Object.keys(self.subscriptions);
        clientTokens.forEach(function (clientToken) {
            var sub = self.subscriptions[clientToken];
            if (sub) {
                var subQueryKey = sub.query.context + "." + sub.query.aggregate + "." + sub.query.aggregateId;
                if (subQueryKey === queryKey) {
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
            }
        });
    };
    PushService.prototype.subscribe = function (query, offset, owner, cb) {
        var pushToken = Helpers.generateToken();
        this.subscriptions[pushToken] = {
            query: query,
            offset: offset,
            owner: owner,
            cb: cb,
            monitorTags: {},
        };
        var sub = this.subscriptions[pushToken];
        if (sub && !sub.token) {
            var subscriptionQuery_1 = Object.assign(sub.query, {
                offset: sub.offset,
            });
            this.ioPush.emit('subscribe', subscriptionQuery_1, function (_a) {
                var subscriptionToken = _a.subscriptionToken, catchUpEvents = _a.catchUpEvents;
                if (subscriptionToken) {
                    sub.token = subscriptionToken;
                }
                else {
                    console.error('Subscribe error for query', subscriptionQuery_1);
                }
                if (catchUpEvents && catchUpEvents.length > 0) {
                    catchUpEvents.forEach(function (event) {
                        cb(undefined, event, owner, pushToken);
                    });
                }
            });
        }
        return pushToken;
    };
    PushService.prototype.unsubscribe = function (pushTokens) {
        var _this = this;
        var socketTokens = [];
        pushTokens.forEach(function (pushToken) {
            if (_this.subscriptions[pushToken]) {
                var clientSubscription = _clone(_this.subscriptions[pushToken]);
                delete _this.subscriptions[pushToken];
                var sub = clientSubscription;
                if (sub && sub.token) {
                    socketTokens.push(sub.token);
                }
            }
        });
        return new Promise(function (resolve, reject) {
            _this.ioPush.emit('unsubscribe', socketTokens, function () {
                resolve();
            });
        });
    };
    return PushService;
}());
PushService.decorators = [
    { type: Injectable },
];
PushService.ctorParameters = function () { return []; };
var PlaybackService = /** @class */ (function () {
    function PlaybackService(scriptService, pushService) {
        this.scriptService = scriptService;
        this.pushService = pushService;
        this._playbackRegistry = {};
        this._conditionalSubscriptionRegistry = {};
    }
    PlaybackService.prototype.init = function (socketUrl) {
        this.pushService.init(socketUrl);
    };
    PlaybackService.prototype.unregisterForPlayback = function (playbackTokens) {
        return __awaiter(this, void 0, void 0, function () {
            var pushTokens;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pushTokens = playbackTokens.map(function (playbackToken) {
                            return _this._playbackRegistry[playbackToken].pushSubscriptionId;
                        });
                        playbackTokens.forEach(function (token) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                delete this._playbackRegistry[token];
                                return [2 /*return*/];
                            });
                        }); });
                        console.log('PUSH TOKENS TO UNSUB');
                        console.log(pushTokens);
                        return [4 /*yield*/, this.pushService.unsubscribe(pushTokens)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PlaybackService.prototype.registerForPlayback = function (owner, scriptName, query, stateFunctions, playbackList, streamRevisionFunction, rowId, conditionFunction) {
        if (streamRevisionFunction === void 0) { streamRevisionFunction = function (item) { return 0; }; }
        return __awaiter(this, void 0, void 0, function () {
            var playbackSubscriptionId, rowData, aggregateId_1, streamRevision, isConditionTrue, pushSubscriptionId;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        playbackSubscriptionId = Helpers.generateToken();
                        if (!rowId) return [3 /*break*/, 2];
                        aggregateId_1 = rowId ? rowId : query.aggregateId;
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                playbackList.get(aggregateId_1, function (error, item) {
                                    if (error) {
                                        reject(error);
                                    }
                                    resolve(item);
                                });
                            })];
                    case 1:
                        rowData = _a.sent();
                        _a.label = 2;
                    case 2:
                        if (rowData) {
                            streamRevision = streamRevisionFunction(rowData);
                            isConditionTrue = conditionFunction ? conditionFunction(rowData) : undefined;
                        }
                        if (!(isConditionTrue === true || conditionFunction === undefined)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.pushService.subscribe(query, streamRevision, this, function (err, eventObj, owner2) { return __awaiter(_this, void 0, void 0, function () {
                                var self, registration, thisScriptName, fromEvent, eventName, thisPlaybackScript, playbackFunction, state, funcs, doneCallback, thisScriptName, thisPlaybackScript, playbackFunction, row, state, funcs, doneCallback;
                                return __generator(this, function (_a) {
                                    self = (owner2);
                                    console.log(self._playbackRegistry);
                                    registration = self._playbackRegistry[playbackSubscriptionId];
                                    if (registration) {
                                        if (eventObj.aggregate === 'states') {
                                            thisScriptName = registration.scriptName;
                                            fromEvent = eventObj.payload._meta.fromEvent;
                                            eventName = fromEvent.payload.name;
                                            thisPlaybackScript = window[thisScriptName];
                                            playbackFunction = thisPlaybackScript.playbackInterface[eventName];
                                            if (playbackFunction) {
                                                if (registration.rowId) {
                                                    eventObj.aggregateId = registration.rowId;
                                                }
                                                state = eventObj.payload;
                                                funcs = {
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
                                                doneCallback = function () {
                                                    registration.playbackList.get(eventObj.aggregateId, function (error, item) {
                                                        self._updateConditionalSubscriptions(eventObj.aggregateId, item);
                                                    });
                                                };
                                                playbackFunction(state, fromEvent, funcs, doneCallback);
                                            }
                                        }
                                        else {
                                            thisScriptName = registration.scriptName;
                                            thisPlaybackScript = window[thisScriptName];
                                            playbackFunction = thisPlaybackScript.playbackInterface[eventObj.payload.name];
                                            if (playbackFunction) {
                                                if (registration.rowId) {
                                                    eventObj.aggregateId = registration.rowId;
                                                }
                                                row = stateFunctions.getState(eventObj.aggregateId);
                                                state = row.data;
                                                funcs = {
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
                                                doneCallback = function () {
                                                    registration.playbackList.get(eventObj.aggregateId, function (error, item) {
                                                        self._updateConditionalSubscriptions(eventObj.aggregateId, item);
                                                    });
                                                };
                                                playbackFunction(state, eventObj, funcs, doneCallback);
                                            }
                                        }
                                    }
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 3:
                        pushSubscriptionId = _a.sent();
                        _a.label = 4;
                    case 4:
                        if (conditionFunction) {
                            if (this._conditionalSubscriptionRegistry[rowId] && Array.isArray(this._conditionalSubscriptionRegistry[rowId])) {
                                this._conditionalSubscriptionRegistry[rowId].push({
                                    playbackList: playbackList,
                                    scriptName: scriptName,
                                    owner: owner,
                                    stateFunctions: stateFunctions,
                                    query: query,
                                    streamRevisionFunction: streamRevisionFunction,
                                    conditionFunction: conditionFunction,
                                    pushSubscriptionId: pushSubscriptionId,
                                    playbackSubscriptionId: playbackSubscriptionId
                                });
                            }
                            else {
                                this._conditionalSubscriptionRegistry[rowId] = [{
                                        playbackList: playbackList,
                                        scriptName: scriptName,
                                        owner: owner,
                                        stateFunctions: stateFunctions,
                                        query: query,
                                        streamRevisionFunction: streamRevisionFunction,
                                        conditionFunction: conditionFunction,
                                        pushSubscriptionId: pushSubscriptionId,
                                        playbackSubscriptionId: playbackSubscriptionId
                                    }];
                            }
                        }
                        this._playbackRegistry[playbackSubscriptionId] = {
                            owner: owner,
                            pushSubscriptionId: pushSubscriptionId,
                            playbackList: playbackList,
                            scriptName: scriptName,
                            rowId: rowId
                        };
                        return [2 /*return*/, playbackSubscriptionId];
                }
            });
        });
    };
    PlaybackService.prototype._updateConditionalSubscriptions = function (rowId, rowData) {
        var _this = this;
        var conditionalSubscriptions = this._conditionalSubscriptionRegistry[rowId] || [];
        conditionalSubscriptions.forEach(function (conditionalSubscription) { return __awaiter(_this, void 0, void 0, function () {
            var offset, pushSubscriptionId;
            var _this = this;
            return __generator(this, function (_a) {
                if (!conditionalSubscription.pushSubscriptionId && conditionalSubscription.conditionFunction(rowData)) {
                    offset = conditionalSubscription.streamRevisionFunction(rowData);
                    pushSubscriptionId = this.pushService.subscribe(conditionalSubscription.query, offset, this, function (err, eventObj, owner2) { return __awaiter(_this, void 0, void 0, function () {
                        var self, registration, thisScriptName, fromEvent, eventName, thisPlaybackScript, playbackFunction, state, funcs, doneCallback, thisScriptName, thisPlaybackScript, playbackFunction, row, state, funcs, doneCallback;
                        return __generator(this, function (_a) {
                            self = (owner2);
                            registration = self._playbackRegistry[conditionalSubscription.playbackSubscriptionId];
                            if (eventObj.aggregate === 'states') {
                                thisScriptName = registration.scriptName;
                                fromEvent = eventObj.payload._meta.fromEvent;
                                eventName = fromEvent.payload.name;
                                thisPlaybackScript = window[thisScriptName];
                                playbackFunction = thisPlaybackScript.playbackInterface[eventName];
                                if (playbackFunction) {
                                    state = eventObj.payload;
                                    funcs = {
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
                                    doneCallback = function () {
                                    };
                                    playbackFunction(state, fromEvent, funcs, doneCallback);
                                }
                            }
                            else {
                                thisScriptName = registration.scriptName;
                                thisPlaybackScript = window[thisScriptName];
                                playbackFunction = thisPlaybackScript.playbackInterface[eventObj.payload.name];
                                if (playbackFunction) {
                                    if (registration.rowId) {
                                        eventObj.aggregateId = registration.rowId;
                                    }
                                    row = conditionalSubscription.stateFunctions.getState(eventObj.aggregateId);
                                    state = row.data;
                                    funcs = {
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
                                    doneCallback = function () {
                                    };
                                    playbackFunction(state, eventObj, funcs, doneCallback);
                                }
                            }
                            return [2 /*return*/];
                        });
                    }); });
                    this._playbackRegistry[conditionalSubscription.playbackSubscriptionId] = {
                        owner: conditionalSubscription.owner,
                        pushSubscriptionId: pushSubscriptionId,
                        playbackList: conditionalSubscription.playbackList,
                        scriptName: conditionalSubscription.scriptName,
                        rowId: rowId
                    };
                    conditionalSubscription.pushSubscriptionId = pushSubscriptionId;
                    return [2 /*return*/, pushSubscriptionId];
                }
                else if (!conditionalSubscription.conditionFunction(rowData) && conditionalSubscription.pushSubscriptionId) {
                    this.pushService.unsubscribe([conditionalSubscription.pushSubscriptionId]).then(function () {
                        delete _this._playbackRegistry[conditionalSubscription.playbackSubscriptionId];
                        conditionalSubscription.pushSubscriptionId = undefined;
                    });
                }
                return [2 /*return*/];
            });
        }); });
    };
    return PlaybackService;
}());
PlaybackService.decorators = [
    { type: Injectable },
];
PlaybackService.ctorParameters = function () { return [
    { type: ScriptService, },
    { type: PushService, },
]; };
var PlaybackListService = /** @class */ (function () {
    function PlaybackListService(http) {
        this.http = http;
    }
    PlaybackListService.prototype.getPlaybackList = function (playbackListBaseUrl, playbackListName, startIndex, limit, filters, sort) {
        var url = playbackListBaseUrl + "/playback-list/" + playbackListName + "?startIndex=" + startIndex + "&limit=" + limit;
        if (filters) {
            url += "&filters=" + JSON.stringify(filters);
        }
        if (sort) {
            url += "&sort=" + JSON.stringify(sort);
        }
        return this.http.get(url);
    };
    PlaybackListService.prototype.getPlaybackListCsv = function (playbackListBaseUrl, playbackListName, startIndex, limit, filters, sort, type) {
        var url = playbackListBaseUrl + "/playback-list/" + playbackListName + "/export?startIndex=" + startIndex + "&limit=" + limit;
        if (filters) {
            url += "&filters=" + JSON.stringify(filters);
        }
        if (sort) {
            url += "&sort=" + JSON.stringify(sort);
        }
        if (type) {
            url += "&type=" + type;
        }
        return this.http.get(url);
    };
    return PlaybackListService;
}());
PlaybackListService.decorators = [
    { type: Injectable },
];
PlaybackListService.ctorParameters = function () { return [
    { type: HttpClient, },
]; };
var NgEventstoreListingComponent = /** @class */ (function () {
    function NgEventstoreListingComponent(changeDetectorRef, scriptService, playbackService, playbackListService) {
        var _this = this;
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
        this.lookups = {};
        this.itemSubscriptionConfigurations = [];
        this.filters = null;
        this.sort = null;
        this.pageIndex = 1;
        this.responseBasePath = 'data';
        this.emptyListDisplayText = 'No Results';
        this.csvFileName = '';
        this.debugging = false;
        this._initialized = false;
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
                        callback(null, ((data)).toJS());
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
                var newEntry = fromJS({
                    rowId: rowId,
                    revision: revision,
                    data: Object.assign({}, oldData, newData),
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
                    _this.removedItemNotifyEmitter.emit(rowId);
                    callback(null);
                }
                else {
                    callback(new Error("Row with rowId: " + rowIndex + " does not exist"));
                }
            },
        };
        this._stateFunctions = {
            getState: function (id) {
                var index = _this._dataList.findIndex(function (row) {
                    return row.get('rowId') === id;
                });
                if (index > 0) {
                    return ((_this._dataList.get(index))).toJS();
                }
                return {};
            },
            setState: function (id, data) {
                var index = _this._dataList.findIndex(function (row) {
                    return row.get('rowId') === id;
                });
                _this._dataList = _this._dataList.set(index, fromJS(data));
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
        this._initialized = false;
    };
    NgEventstoreListingComponent.prototype.trackByFn = function (index, item) {
        return item.get('rowId');
    };
    NgEventstoreListingComponent.prototype._initializeRequests = function () {
        var _this = this;
        this._getPlaybackListSubscription = this._getPlaybackListSubject
            .pipe(debounceTime(100), switchMap(function (params) {
            return _this.playbackListService.getPlaybackList(_this.playbackListBaseUrl, params.playbackListName, params.startIndex, params.limit, params.filters, params.sort);
        }))
            .subscribe(function (res) {
            _this._dataList = fromJS(res.rows);
            _this._dataCount = res.rows.length;
            _this._dataTotalCount = res.count;
            _this._resetSubscriptions();
            _this._initSubscriptions();
            _this.changeDetectorRef.detectChanges();
            _this.playbackListLoadedEmitter.emit({
                totalItems: _this._dataTotalCount,
                dataCount: _this._dataCount,
            });
        });
        this._exportPlaybackListSubscription = this._exportPlaybackListSubject
            .pipe(debounceTime(100), switchMap(function (params) {
            return _this.playbackListService.getPlaybackListCsv(_this.playbackListBaseUrl, params.playbackListName, params.startIndex, params.limit, params.filters, params.sort, params.type);
        }))
            .subscribe(function (result) {
            var csv = new Blob([result], { type: 'text/csv' });
            var moment = moment_;
            var now = moment();
            var fileName = now.format('YYYY_MM_DD_HH_mm_ss') + "_" + (_this.csvFileName || _this.playbackListName) + ".csv";
            saveAs(csv, fileName);
        });
    };
    NgEventstoreListingComponent.prototype._getPlaybackList = function (playbackListName, startIndex, limit, filters, sort) {
        var playbackListRequestParams = {
            playbackListName: playbackListName,
            startIndex: startIndex,
            limit: limit,
            filters: filters,
            sort: sort,
        };
        this._getPlaybackListSubject.next(playbackListRequestParams);
    };
    NgEventstoreListingComponent.prototype.requestPlaybackList = function () {
        var startIndex = this.itemsPerPage * (this.pageIndex - 1);
        this._getPlaybackList(this.playbackListName, startIndex, this.itemsPerPage, this.filters, this.sort);
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
                        (self.itemSubscriptionConfigurations || []).forEach(function (itemSubscriptionConfiguration) {
                            if (itemSubscriptionConfiguration) {
                                self._dataList.forEach(function (row) { return __awaiter(_this, void 0, void 0, function () {
                                    var streamRevisionFunction, aggregateId, query, playbackSubscriptionToken;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                streamRevisionFunction = itemSubscriptionConfiguration.streamRevisionFunction ?
                                                    itemSubscriptionConfiguration.streamRevisionFunction : function () { return +row.get('revision') + 1; };
                                                aggregateId = itemSubscriptionConfiguration.rowIdFieldName ?
                                                    row.get('data').get(itemSubscriptionConfiguration.rowIdFieldName) : row.get('rowId');
                                                query = _clone(itemSubscriptionConfiguration.query);
                                                query.aggregateId = query.aggregateId.replace(/{{rowId}}/g, aggregateId);
                                                return [4 /*yield*/, self.playbackService.registerForPlayback(self, itemSubscriptionConfiguration.playbackScriptName, query, self._stateFunctions, self._playbackList, streamRevisionFunction, row.get('rowId'), itemSubscriptionConfiguration.condition)];
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
                        _b = (_a = this._playbackSubscriptionTokens).push;
                        return [4 /*yield*/, self.playbackService.registerForPlayback(self, self.listSubscriptionConfiguration.playbackScriptName, self.listSubscriptionConfiguration.query, self._stateFunctions, self._playbackList, function () { return 0; })];
                    case 1:
                        _b.apply(_a, [_c.sent()]);
                        _c.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
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
    NgEventstoreListingComponent.prototype.exportCSV = function (overrideParams) {
        if (overrideParams) {
            this._exportPlaybackListSubject.next(overrideParams);
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
            this._exportPlaybackListSubject.next(exportPlaybackListRequestParams);
        }
    };
    return NgEventstoreListingComponent;
}());
NgEventstoreListingComponent.decorators = [
    { type: Component, args: [{
                selector: 'lib-ng-eventstore-listing',
                template: "<!-- <div *ngIf=\"listHeaderGroups && listHeaderGroups.groups && listHeaderGroups.groups.length > 0\"  [class]=\"'row ' + (listHeaderGroups && listHeaderGroups.generalRowClassName ? listHeaderGroups.generalRowClassName : '')\">\n  <div class=\"col-12\">\n    <div class=\"header bg-white p-2\">\n      <div [class]=\"'row ' + listHeaderGroups.generalRowClassName\">\n        <div *ngFor=\"let listHeaderGroup of listHeaderGroups.groups\" [class]=\"listHeaderGroup.className\">\n          <div [class]=\"'row ' + listHeaderGroups.generalRowClassName\">\n            <div *ngFor=\"let listHeader of listHeaderGroup.listHeaders\" [class]=\"listHeader.className\">\n              <span (click)=\"onSort(listHeader.sortProperty)\" [ngClass]=\"{ 'sort-header': listHeader.sortProperty }\">{{ listHeader.displayName }} <i *ngIf=\"sortFields[listHeader.sortProperty] && sortFields[listHeader.sortProperty].icon\" [class]=\"'sort-icon ' + sortFields[listHeader.sortProperty].icon\"></i></span>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div> -->\n<!-- <div [class]=\"'row ' + (listHeaderGroups && listHeaderGroups.generalRowClassName) ? listHeaderGroups.generalRowClassName : ''\" *ngFor=\"let item of dataList; trackBy: trackByFn\"> -->\n<div class=\"row\" *ngFor=\"let item of _dataList; trackBy: trackByFn\">\n  <div class=\"col-12\">\n    <lib-item-template-holder\n      [data]=\"item\"\n      [itemComponentClass]=\"itemComponentClass\"\n      [lookups]=\"lookups\"\n      (updateEmitter)=\"_onUpdate($event)\"\n      (getLookupsEmitter)=\"_onGetLookups($event)\"\n      (showModalEmitter)=\"_onShowModal($event)\"\n      (deleteEmitter)=\"_onDelete($event)\">\n    </lib-item-template-holder>\n  </div>\n</div>\n\n<div class=\"row\" *ngIf=\"!_dataCount || _dataCount === 0\">\n  <div class=\"col-12\">\n    <div class=\"row\">\n      <div class=\"col-12 no-results-container\">\n        <div class=\"text-center text-secondary\">\n          <span class=\"italic\">{{ emptyListDisplayText }}</span>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n",
                styles: [],
                changeDetection: ChangeDetectionStrategy.OnPush,
            },] },
];
NgEventstoreListingComponent.ctorParameters = function () { return [
    { type: ChangeDetectorRef, },
    { type: ScriptService, },
    { type: PlaybackService, },
    { type: PlaybackListService, },
]; };
NgEventstoreListingComponent.propDecorators = {
    "updateEmitter": [{ type: Output },],
    "getLookupsEmitter": [{ type: Output },],
    "showModalEmitter": [{ type: Output },],
    "deleteEmitter": [{ type: Output },],
    "playbackListLoadedEmitter": [{ type: Output },],
    "newItemNotifyEmitter": [{ type: Output },],
    "removedItemNotifyEmitter": [{ type: Output },],
    "itemComponentClass": [{ type: Input },],
    "lookups": [{ type: Input },],
    "socketUrl": [{ type: Input },],
    "playbackListBaseUrl": [{ type: Input },],
    "scriptStore": [{ type: Input },],
    "itemSubscriptionConfigurations": [{ type: Input },],
    "listSubscriptionConfiguration": [{ type: Input },],
    "playbackListName": [{ type: Input },],
    "filters": [{ type: Input },],
    "sort": [{ type: Input },],
    "pageIndex": [{ type: Input },],
    "itemsPerPage": [{ type: Input },],
    "responseBasePath": [{ type: Input },],
    "emptyListDisplayText": [{ type: Input },],
    "csvFileName": [{ type: Input },],
    "debugging": [{ type: Input },],
};
var TemplateDirective = /** @class */ (function () {
    function TemplateDirective(viewContainerRef) {
        this.viewContainerRef = viewContainerRef;
    }
    return TemplateDirective;
}());
TemplateDirective.decorators = [
    { type: Directive, args: [{
                selector: '[libTemplateDirective]'
            },] },
];
TemplateDirective.ctorParameters = function () { return [
    { type: ViewContainerRef, },
]; };
var ItemTemplateHolderComponent = /** @class */ (function () {
    function ItemTemplateHolderComponent(componentFactoryResolver) {
        this.componentFactoryResolver = componentFactoryResolver;
        this.data = {};
        this.lookups = {};
        this.updateEmitter = new EventEmitter();
        this.getLookupsEmitter = new EventEmitter();
        this.showModalEmitter = new EventEmitter();
        this.deleteEmitter = new EventEmitter();
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
            .instance)).onGetLookupsEmitter = this.getLookupsEmitter;
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
    { type: Component, args: [{
                selector: 'lib-item-template-holder',
                template: "<div class=\"row no-gutters\">\n  <div class=\"col-12\">\n    <ng-template libTemplateDirective></ng-template>\n  </div>\n</div>\n",
                styles: [""],
                changeDetection: ChangeDetectionStrategy.OnPush,
            },] },
];
ItemTemplateHolderComponent.ctorParameters = function () { return [
    { type: ComponentFactoryResolver, },
]; };
ItemTemplateHolderComponent.propDecorators = {
    "itemComponentClass": [{ type: Input },],
    "data": [{ type: Input },],
    "lookups": [{ type: Input },],
    "updateEmitter": [{ type: Output },],
    "getLookupsEmitter": [{ type: Output },],
    "showModalEmitter": [{ type: Output },],
    "deleteEmitter": [{ type: Output },],
    "itemHost": [{ type: ViewChild, args: [TemplateDirective,] },],
};
var SocketIoService = /** @class */ (function () {
    function SocketIoService() {
    }
    SocketIoService.prototype.getSocketInstance = function (socketUrl) {
        return connect(socketUrl + "/events");
    };
    return SocketIoService;
}());
SocketIoService.decorators = [
    { type: Injectable },
];
SocketIoService.ctorParameters = function () { return []; };
var NgEventstoreListingModule = /** @class */ (function () {
    function NgEventstoreListingModule() {
    }
    return NgEventstoreListingModule;
}());
NgEventstoreListingModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    NgEventstoreListingComponent,
                    ItemTemplateHolderComponent,
                    TemplateDirective,
                ],
                imports: [CommonModule],
                exports: [
                    NgEventstoreListingComponent
                ],
                providers: [
                    ScriptService,
                    PlaybackService,
                    PlaybackListService,
                    PushService,
                    SocketIoService
                ]
            },] },
];
NgEventstoreListingModule.ctorParameters = function () { return []; };
var FilterOperator = {
    range: 'range',
    is: 'is',
    any: 'any',
    contains: 'contains',
    endsWith: 'endsWith',
    startsWith: 'startsWith',
    arrayContains: 'arrayContains',
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
        this.onUpdateEmitter = new EventEmitter();
        this.onGetLookupsEmitter = new EventEmitter();
        this.onShowModalEmitter = new EventEmitter();
        this.onDeleteEmitter = new EventEmitter();
        this._formGroup = new FormGroup({});
        this._formGroupKeys = [];
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
        this.onGetLookups = function (lookupName, callback) {
            var actionEventEmitterData = {
                lookupName: lookupName,
                callback: callback
            };
            _this.onGetLookupsEmitter.emit(actionEventEmitterData);
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
        this.registerFormGroup = function (formGroup) {
            _this._formGroup = formGroup;
        };
    }
    ItemTemplateComponent.prototype.ngOnInit = function () { };
    ItemTemplateComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        if (this._changeFn) {
            this._changeFn(changes);
        }
        var dataChanges = changes["data"] ? changes["data"].currentValue : null;
        if (dataChanges && !changes["data"].isFirstChange()) {
            var dataObj_1 = ((dataChanges)).toJS();
            this._formGroupKeys.forEach(function (key) {
                var newValue = dataObj_1.data[key];
                var oldValue = _this._formGroup.get(key).value;
                if (newValue !== oldValue) {
                    _this._formGroup.get(key).setValue(newValue, { emit: false, onlySelf: true });
                }
            });
        }
        if (this.changeDetectorRef) {
            this.changeDetectorRef.detectChanges();
        }
    };
    ItemTemplateComponent.prototype.createFormControl = function (propertyName, initialValue, validators) {
        var formControl = new FormControl(initialValue, validators);
        this._formGroup.addControl(propertyName, formControl);
        this._formGroupKeys.push(propertyName);
        return formControl;
    };
    return ItemTemplateComponent;
}());

export { FilterOperator, SortDirection, GroupBooleanOperator, ItemTemplateComponent, NgEventstoreListingComponent, NgEventstoreListingModule, ItemTemplateHolderComponent as ɵe, TemplateDirective as ɵf, PlaybackListService as ɵd, PlaybackService as ɵb, PushService as ɵc, ScriptService as ɵa, SocketIoService as ɵg };
//# sourceMappingURL=ng-eventstore-listing.js.map
