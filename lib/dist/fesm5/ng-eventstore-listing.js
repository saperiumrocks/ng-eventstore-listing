import { __awaiter, __generator, __decorate, __assign, __read, __param } from 'tslib';
import { InjectionToken, Injectable, EventEmitter, Inject, ChangeDetectorRef, Output, Input, Component, ChangeDetectionStrategy, ViewContainerRef, Directive, ComponentFactoryResolver, ViewChild, NgModule } from '@angular/core';
import { debounceTime, switchMap, map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import _clone from 'lodash-es/clone';
import _forOwn from 'lodash-es/forOwn';
import { connect } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { fromJS } from 'immutable';
import _isEmpty from 'lodash-es/isEmpty';
import * as moment_ from 'moment-mini-ts';
import saveAs from 'file-saver';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';

var ɵ0 = function () {
    return Math.random().toString(36).substr(2, 9) + '-' + Date.now().toString();
};
var Helpers = {
    generateToken: ɵ0
};

var JQ_TOKEN = new InjectionToken('jQuery');
function jQueryFactory() {
    return jQuery;
}

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
                            // console.log('SCRIPT STORE LOGGING');
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
            // resolve if already loaded
            if (_this.scripts[name].loaded) {
                // console.log('LOADED');
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
                    // load script
                    var script_1 = document.createElement('script');
                    script_1.type = 'text/javascript';
                    script_1.src = _this.scripts[name].src;
                    if (script_1.readyState) {
                        // IE
                        script_1.onreadystatechange = function () {
                            // console.log('ON READYSTATECHANGE');
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
                        // Others
                        // console.log('ONLOAD');
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
                    script_1.onerror = function (error) {
                        return console.log('ON ERROR', error);
                    };
                    resolve({
                        script: name,
                        loaded: false,
                        status: 'Loaded',
                        meta: _this.scripts[name].meta,
                    });
                    document.getElementsByTagName('head')[0].appendChild(script_1);
                }
                else {
                    // console.log('Script already exists');
                    resolve();
                }
            }
        });
    };
    ScriptService.prototype.getScript = function (scriptName) {
        return this.scripts[scriptName];
    };
    ScriptService = __decorate([
        Injectable()
    ], ScriptService);
    return ScriptService;
}());

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
                // console.log('TEST RECONNECTION');
                // this.ioPush.emit('resubscribe', () => {
                // console.log(this.subscriptions);
                _forOwn(_this.subscriptions, function (sub) {
                    var subscriptionQuery = Object.assign(sub.query, {
                        offset: sub.offset,
                    });
                    _this.ioPush.emit('subscribe', subscriptionQuery, function (token) {
                        if (token) {
                            // console.log('Reconnected:', token, subscriptionQuery);
                            sub.token = token;
                        }
                        else {
                            console.error('Reconnect error for query', subscriptionQuery);
                        }
                    });
                });
                // });
            });
        }
    };
    PushService.prototype._processEvent = function (eventObj) {
        var self = this;
        // console.log('got message from push server: ', eventObj);
        var queryKey = eventObj.context + "." + eventObj.aggregate + "." + eventObj.aggregateId;
        var clientTokens = Object.keys(self.subscriptions);
        // redirect to mapped subscription/token callback
        clientTokens.forEach(function (clientToken) {
            var sub = self.subscriptions[clientToken];
            if (sub) {
                var subQueryKey = sub.query.context + "." + sub.query.aggregate + "." + sub.query.aggregateId;
                if (subQueryKey === queryKey) {
                    // update next offset (from stream revision) for this subscription, so for reconnecting
                    if (!isNaN(eventObj.streamRevision)) {
                        sub.offset = eventObj.streamRevision + 1;
                    }
                    if (typeof sub.cb === 'function') {
                        sub.cb(undefined, eventObj, sub.owner, clientToken);
                    }
                    // iterate on monitors meta tags
                    var tags = Object.keys(sub.monitorTags);
                    tags.forEach(function (tag) {
                        // check for state/eventSource._meta or event._meta
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
                            // iterate on the monitors
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
        // await this.waitForSocketConnection();
        var pushToken = Helpers.generateToken();
        // map new subscription, then try to subscribe to server asap
        this.subscriptions[pushToken] = {
            query: query,
            offset: offset,
            owner: owner,
            cb: cb,
            monitorTags: {},
        };
        var sub = this.subscriptions[pushToken];
        if (sub && !sub.token) {
            // build up proper subscribe request query
            var subscriptionQuery_1 = Object.assign(sub.query, {
                offset: sub.offset,
            });
            this.ioPush.emit('subscribe', subscriptionQuery_1, function (_a) {
                var subscriptionToken = _a.subscriptionToken, catchUpEvents = _a.catchUpEvents;
                if (subscriptionToken) {
                    // console.log('Server Subscribed:', token, subscriptionQuery);
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
    PushService = __decorate([
        Injectable()
    ], PushService);
    return PushService;
}());

var PlaybackService = /** @class */ (function () {
    function PlaybackService(pushService) {
        this.pushService = pushService;
        this._playbackRegistry = {};
        this._conditionalSubscriptionRegistry = {};
        this._customPlaybackRegistry = {};
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
                            var rowId;
                            return __generator(this, function (_a) {
                                rowId = this._playbackRegistry[token].rowId;
                                // console.log('BEFORE');
                                // console.log(this._conditionalSubscriptionRegistry);
                                if (rowId) {
                                    delete this._conditionalSubscriptionRegistry[rowId];
                                }
                                // console.log('AFTER');
                                // console.log(this._conditionalSubscriptionRegistry);
                                // unsubscribe from push
                                delete this._playbackRegistry[token];
                                return [2 /*return*/];
                            });
                        }); });
                        return [4 /*yield*/, this.pushService.unsubscribe(pushTokens)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PlaybackService.prototype.registerForPlayback = function (owner, scriptName, query, stateFunctions, playbackList, streamRevisionFunction, rowId, conditionFunction, rowIdFunction) {
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
                            isConditionTrue = conditionFunction ? (conditionFunction(rowData) ? true : false) : undefined;
                        }
                        if (!(isConditionTrue === true || conditionFunction === undefined)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.pushService.subscribe(query, streamRevision, this, function (err, eventObj, owner2) { return __awaiter(_this, void 0, void 0, function () {
                                var self, registration, thisScriptName, fromEvent_1, eventName, thisPlaybackScript, playbackFunction, state, funcs, doneCallback, thisScriptName, thisPlaybackScript, playbackFunction, row, state, funcs, doneCallback;
                                return __generator(this, function (_a) {
                                    self = owner2;
                                    registration = self._playbackRegistry[playbackSubscriptionId];
                                    if (registration) {
                                        if (eventObj.aggregate === 'states') {
                                            thisScriptName = registration.scriptName;
                                            fromEvent_1 = eventObj.payload._meta.fromEvent;
                                            eventName = fromEvent_1.payload.name;
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
                                                playbackFunction(state, fromEvent_1, funcs, doneCallback);
                                                // Run custom playbackEvents if they exist
                                                if (this._customPlaybackRegistry[eventName]) {
                                                    this._customPlaybackRegistry[eventName].forEach(function (customPlaybackConfiguration) {
                                                        customPlaybackConfiguration.playbackFunction(fromEvent_1);
                                                    });
                                                }
                                            }
                                        }
                                        else {
                                            thisScriptName = registration.scriptName;
                                            thisPlaybackScript = window[thisScriptName];
                                            playbackFunction = thisPlaybackScript.playbackInterface[eventObj.payload.name];
                                            if (playbackFunction) {
                                                // Override aggregateId to handle other subscriptions
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
                                                // Run custom playbackEvents if they exist
                                                if (this._customPlaybackRegistry[eventObj.payload.name]) {
                                                    this._customPlaybackRegistry[eventObj.payload.name].forEach(function (customPlaybackConfiguration) {
                                                        customPlaybackConfiguration.playbackFunction(eventObj);
                                                    });
                                                }
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
                        // If condition exists, register in conditional registry
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
                                    playbackSubscriptionId: playbackSubscriptionId,
                                    rowIdFunction: rowIdFunction
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
                                        playbackSubscriptionId: playbackSubscriptionId,
                                        rowIdFunction: rowIdFunction
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
    PlaybackService.prototype.registerCustomPlaybacks = function (customPlaybackConfigurations) {
        var _this = this;
        customPlaybackConfigurations.forEach(function (customPlaybackConfiguration) {
            if (!_this._customPlaybackRegistry[customPlaybackConfiguration.eventName]) {
                _this._customPlaybackRegistry[customPlaybackConfiguration.eventName] = [];
            }
            _this._customPlaybackRegistry[customPlaybackConfiguration.eventName].push(customPlaybackConfiguration);
        });
    };
    PlaybackService.prototype.resetCustomPlaybacks = function () {
        this._customPlaybackRegistry = {};
    };
    PlaybackService.prototype._updateConditionalSubscriptions = function (rowId, rowData) {
        var _this = this;
        var conditionalSubscriptions = this._conditionalSubscriptionRegistry[rowId] || [];
        conditionalSubscriptions.forEach(function (conditionalSubscription) { return __awaiter(_this, void 0, void 0, function () {
            var offset, subQuery, pushSubscriptionId;
            var _this = this;
            return __generator(this, function (_a) {
                if (!conditionalSubscription.pushSubscriptionId && conditionalSubscription.conditionFunction(rowData)) {
                    offset = conditionalSubscription.streamRevisionFunction(rowData);
                    subQuery = _clone(conditionalSubscription.query);
                    if (conditionalSubscription.rowIdFunction) {
                        subQuery.aggregateId = conditionalSubscription.rowIdFunction(rowData);
                    }
                    pushSubscriptionId = this.pushService.subscribe(subQuery, offset, this, function (err, eventObj, owner2) { return __awaiter(_this, void 0, void 0, function () {
                        var self, registration, thisScriptName, fromEvent, eventName, thisPlaybackScript, playbackFunction, state, funcs, doneCallback, thisScriptName, thisPlaybackScript, playbackFunction, row, state, funcs, doneCallback;
                        return __generator(this, function (_a) {
                            self = owner2;
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
                                    // Override aggregateId to handle other subscriptions
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
                                        // stateFunctions.setState(row.rowId, row);
                                    };
                                    playbackFunction(state, eventObj, funcs, doneCallback);
                                }
                            }
                            return [2 /*return*/];
                        });
                    }); });
                    // just use the subscriptionId to map the push subscription to the playback
                    this._playbackRegistry[conditionalSubscription.playbackSubscriptionId] = {
                        owner: conditionalSubscription.owner,
                        pushSubscriptionId: pushSubscriptionId,
                        playbackList: conditionalSubscription.playbackList,
                        scriptName: conditionalSubscription.scriptName,
                        rowId: rowId
                    };
                    conditionalSubscription.pushSubscriptionId = pushSubscriptionId;
                    // console.log('subscribed to playback: ', pushSubscriptionId, conditionalSubscription.query);
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
    PlaybackService.ctorParameters = function () { return [
        { type: PushService }
    ]; };
    PlaybackService = __decorate([
        Injectable()
    ], PlaybackService);
    return PlaybackService;
}());

var PlaybackListService = /** @class */ (function () {
    function PlaybackListService(http) {
        this.http = http;
    }
    PlaybackListService.prototype.getPlaybackList = function (playbackListBaseUrl, playbackListName, startIndex, limit, filters, sort, previousKey, nextKey) {
        var url = playbackListBaseUrl + "/playback-list/" + playbackListName + "?startIndex=" + startIndex + "&limit=" + limit;
        if (filters) {
            url += "&filters=" + encodeURIComponent(JSON.stringify(filters));
        }
        if (sort) {
            url += "&sort=" + JSON.stringify(sort);
        }
        if (previousKey) {
            url += '&previousKey=' + previousKey;
        }
        if (nextKey) {
            url += '&nextKey=' + nextKey;
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
        return this.http.get(url, { responseType: 'text/csv' });
    };
    PlaybackListService.ctorParameters = function () { return [
        { type: HttpClient }
    ]; };
    PlaybackListService = __decorate([
        Injectable()
    ], PlaybackListService);
    return PlaybackListService;
}());

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
                var newEntry = fromJS({
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
            self._dataList = fromJS(res.rows);
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
            return self.playbackListService.getPlaybackListCsv(self.playbackListBaseUrl, playbackListRequest.playbackListName, playbackListRequest.startIndex, playbackListRequest.limit, playbackListRequest.filters, playbackListRequest.sort, playbackListRequest.type).pipe(map(function (response) {
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

var TemplateDirective = /** @class */ (function () {
    function TemplateDirective(viewContainerRef) {
        this.viewContainerRef = viewContainerRef;
    }
    TemplateDirective.ctorParameters = function () { return [
        { type: ViewContainerRef }
    ]; };
    TemplateDirective = __decorate([
        Directive({
            selector: '[libTemplateDirective]'
        })
    ], TemplateDirective);
    return TemplateDirective;
}());

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
        // this.loadComponent();
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
                self.componentRef.instance[key] =
                    changes[key].currentValue;
            });
            self.componentRef.instance.ngOnChanges(changes);
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
        this.componentRef.instance.data = this.data;
        this.componentRef
            .instance.onUpdateEmitter = this.updateEmitter;
        this.componentRef
            .instance.onGetLookupsEmitter = this.getLookupsEmitter;
        this.componentRef
            .instance.onShowModalEmitter = this.showModalEmitter;
        this.componentRef
            .instance.onDeleteEmitter = this.deleteEmitter;
        // (this.componentRef.instance as ItemTemplateComponent).idPropertyName = this.idPropertyName;
        this.componentRef
            .instance.lookups = this.lookups;
        this.componentRef.instance.ngOnInit();
    };
    ItemTemplateHolderComponent.ctorParameters = function () { return [
        { type: ComponentFactoryResolver }
    ]; };
    __decorate([
        Input()
    ], ItemTemplateHolderComponent.prototype, "itemComponentClass", void 0);
    __decorate([
        Input()
    ], ItemTemplateHolderComponent.prototype, "data", void 0);
    __decorate([
        Input()
    ], ItemTemplateHolderComponent.prototype, "lookups", void 0);
    __decorate([
        Output()
    ], ItemTemplateHolderComponent.prototype, "updateEmitter", void 0);
    __decorate([
        Output()
    ], ItemTemplateHolderComponent.prototype, "getLookupsEmitter", void 0);
    __decorate([
        Output()
    ], ItemTemplateHolderComponent.prototype, "showModalEmitter", void 0);
    __decorate([
        Output()
    ], ItemTemplateHolderComponent.prototype, "deleteEmitter", void 0);
    __decorate([
        ViewChild(TemplateDirective)
    ], ItemTemplateHolderComponent.prototype, "itemHost", void 0);
    ItemTemplateHolderComponent = __decorate([
        Component({
            selector: 'lib-item-template-holder',
            template: "<div class=\"row no-gutters\">\n  <div class=\"col-12\">\n    <ng-template libTemplateDirective></ng-template>\n  </div>\n</div>\n",
            changeDetection: ChangeDetectionStrategy.OnPush,
            styles: [""]
        })
    ], ItemTemplateHolderComponent);
    return ItemTemplateHolderComponent;
}());

var SocketIoService = /** @class */ (function () {
    // sockets = {};
    function SocketIoService() {
    }
    SocketIoService.prototype.getSocketInstance = function (socketUrl) {
        return connect(socketUrl + "/events");
        //   if (!this.sockets[socketUrl]) {
        //     this.sockets[socketUrl] = io.connect(`${socketUrl}/events`);
        //   }
        //   return this.sockets[socketUrl];
    };
    SocketIoService = __decorate([
        Injectable()
    ], SocketIoService);
    return SocketIoService;
}());

var ɵ0$1 = jQueryFactory;
var NgEventstoreListingModule = /** @class */ (function () {
    function NgEventstoreListingModule() {
    }
    NgEventstoreListingModule = __decorate([
        NgModule({
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
                SocketIoService,
                { provide: JQ_TOKEN, useFactory: ɵ0$1 }
                // ,
                // { provide: IO_TOKEN, useValue: io }
            ]
        })
    ], NgEventstoreListingModule);
    return NgEventstoreListingModule;
}());

var FilterOperator;
(function (FilterOperator) {
    FilterOperator["range"] = "range";
    FilterOperator["dateRange"] = "dateRange";
    FilterOperator["is"] = "is";
    FilterOperator["any"] = "any";
    FilterOperator["contains"] = "contains";
    FilterOperator["endsWith"] = "endsWith";
    FilterOperator["startsWith"] = "startsWith";
    FilterOperator["arrayContains"] = "arrayContains";
    FilterOperator["exists"] = "exists";
    FilterOperator["notExists"] = "notExists";
})(FilterOperator || (FilterOperator = {}));

var SortDirection;
(function (SortDirection) {
    SortDirection["ASC"] = "ASC";
    SortDirection["DESC"] = "DESC";
})(SortDirection || (SortDirection = {}));

var GroupBooleanOperator;
(function (GroupBooleanOperator) {
    GroupBooleanOperator["and"] = "and";
    GroupBooleanOperator["or"] = "or";
})(GroupBooleanOperator || (GroupBooleanOperator = {}));

var ItemTemplateComponent = /** @class */ (function () {
    function ItemTemplateComponent(changeDetectorRef) {
        var _this = this;
        this.changeDetectorRef = changeDetectorRef;
        // Event Emitters
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
        // registerFormControl(propertyName: string)
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
        var dataChanges = changes.data ? changes.data.currentValue : null;
        if (dataChanges && !changes.data.isFirstChange()) {
            var dataObj_1 = dataChanges.toJS();
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

var HeaderFooterTemplateComponent = /** @class */ (function () {
    function HeaderFooterTemplateComponent(changeDetectorRef) {
        var _this = this;
        this.changeDetectorRef = changeDetectorRef;
        // Event Emitters
        this.actionEmitter = new EventEmitter();
        this.pageChangedEmitter = new EventEmitter();
        this.filterEmitter = new EventEmitter();
        this.onPageChanged = function (event) {
            _this.pageIndex = event;
            _this.updatePageValues();
            _this.pageChangedEmitter.emit(event);
        };
        this.onFilter = function (event) {
            _this.filterEmitter.emit(event);
        };
        this.onAction = function (action, data) {
            var actionData = {
                action: action,
                data: data
            };
            _this.actionEmitter.emit(actionData);
        };
    }
    HeaderFooterTemplateComponent.prototype.ngOnInit = function () { };
    HeaderFooterTemplateComponent.prototype.updatePageValues = function () {
        this.pageStart = ((this.pageIndex - 1) * this.itemsPerPage) + 1;
        this.pageEnd = Math.min((((this.pageIndex - 1) * this.itemsPerPage) + this.actualItemCount), this.totalItemCount);
        this.changeDetectorRef.detectChanges();
    };
    return HeaderFooterTemplateComponent;
}());

/*
 * Public API Surface of ng-eventstore-listing
 */

/**
 * Generated bundle index. Do not edit.
 */

export { FilterOperator, GroupBooleanOperator, ItemTemplateComponent, NgEventstoreListingComponent, NgEventstoreListingModule, SortDirection, ɵ0$1 as ɵ0, JQ_TOKEN as ɵa, jQueryFactory as ɵb, ScriptService as ɵc, PlaybackService as ɵd, PushService as ɵe, PlaybackListService as ɵf, ItemTemplateHolderComponent as ɵg, TemplateDirective as ɵh, SocketIoService as ɵi };
//# sourceMappingURL=ng-eventstore-listing.js.map
