(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('lodash-es/forOwn'), require('lodash-es/clone'), require('socket.io-client'), require('@angular/common/http'), require('rxjs/operators'), require('rxjs'), require('immutable'), require('lodash-es/isEmpty'), require('moment-mini-ts'), require('file-saver'), require('@angular/common'), require('@angular/forms')) :
	typeof define === 'function' && define.amd ? define('ng-eventstore-listing', ['exports', '@angular/core', 'lodash-es/forOwn', 'lodash-es/clone', 'socket.io-client', '@angular/common/http', 'rxjs/operators', 'rxjs', 'immutable', 'lodash-es/isEmpty', 'moment-mini-ts', 'file-saver', '@angular/common', '@angular/forms'], factory) :
	(factory((global['ng-eventstore-listing'] = {}),global.ng.core,global._forOwn,global._clone,global.socket_ioClient,global.ng.common.http,global.Rx.Observable.prototype,global.rxjs,global.immutable,global._isEmpty,global.moment_,global.saveAs,global.ng.common,global.ng.forms));
}(this, (function (exports,core,_forOwn,_clone,socket_ioClient,http,operators,rxjs,immutable,_isEmpty,moment_,saveAs,common,forms) { 'use strict';

_forOwn = _forOwn && _forOwn.hasOwnProperty('default') ? _forOwn['default'] : _forOwn;
_clone = _clone && _clone.hasOwnProperty('default') ? _clone['default'] : _clone;
_isEmpty = _isEmpty && _isEmpty.hasOwnProperty('default') ? _isEmpty['default'] : _isEmpty;
saveAs = saveAs && saveAs.hasOwnProperty('default') ? saveAs['default'] : saveAs;

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



function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

var Helpers = {
    generateToken: function () {
        return Math.random().toString(36).substr(2, 9) + '-' + Date.now().toString();
    }
};
var JQ_TOKEN = new core.InjectionToken('jQuery');
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
    { type: core.Injectable },
];
ScriptService.ctorParameters = function () { return []; };
var PushService = /** @class */ (function () {
    function PushService() {
        this.subscriptions = {};
    }
    PushService.prototype.init = function (socketUrl) {
        var _this = this;
        if (!this.ioPush) {
            this.ioPush = socket_ioClient.connect(socketUrl + "/events");
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
    { type: core.Injectable },
];
PushService.ctorParameters = function () { return []; };
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
                                if (rowId) {
                                    delete this._conditionalSubscriptionRegistry[rowId];
                                }
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
                                    self = (owner2);
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
    { type: core.Injectable },
];
PlaybackService.ctorParameters = function () { return [
    { type: PushService }
]; };
var PlaybackListService = /** @class */ (function () {
    function PlaybackListService(http$$1) {
        this.http = http$$1;
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
        return this.http.get(url, ({ responseType: 'text/csv' }));
    };
    return PlaybackListService;
}());
PlaybackListService.decorators = [
    { type: core.Injectable },
];
PlaybackListService.ctorParameters = function () { return [
    { type: http.HttpClient }
]; };
var NgEventstoreListingComponent = /** @class */ (function () {
    function NgEventstoreListingComponent($, changeDetectorRef, scriptService, playbackService, playbackListService) {
        var _this = this;
        this.$ = $;
        this.changeDetectorRef = changeDetectorRef;
        this.scriptService = scriptService;
        this.playbackService = playbackService;
        this.playbackListService = playbackListService;
        this.updateEmitter = new core.EventEmitter();
        this.getLookupsEmitter = new core.EventEmitter();
        this.showModalEmitter = new core.EventEmitter();
        this.deleteEmitter = new core.EventEmitter();
        this.playbackListLoadedEmitter = new core.EventEmitter();
        this.newItemNotifyEmitter = new core.EventEmitter();
        this.removedItemNotifyEmitter = new core.EventEmitter();
        this.getPlaybackLIstErrorEmitter = new core.EventEmitter();
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
        this._getPlaybackListSubject = new rxjs.Subject();
        this._exportPlaybackListSubject = new rxjs.Subject();
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
                var newEntry = immutable.fromJS({
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
        this._id = Helpers.generateToken();
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
                _this._dataList = _this._dataList.set(index, immutable.fromJS(data));
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
            .pipe(operators.debounceTime(100), operators.switchMap(function (params) {
            return self.playbackListService.getPlaybackList(self.playbackListBaseUrl, params.playbackListName, params.startIndex, params.limit, params.filters, params.sort, params.previousKey, params.nextKey);
        }))
            .subscribe(function (res) {
            self._dataList = immutable.fromJS(res.rows);
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
            .pipe(operators.debounceTime(100), operators.switchMap(function (params) {
            var playbackListRequest = params.playbackListRequest;
            return self.playbackListService.getPlaybackListCsv(self.playbackListBaseUrl, playbackListRequest.playbackListName, playbackListRequest.startIndex, playbackListRequest.limit, playbackListRequest.filters, playbackListRequest.sort, playbackListRequest.type).pipe(operators.map(function (response) {
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
        else if (this._previousPageIndex) {
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
    return NgEventstoreListingComponent;
}());
NgEventstoreListingComponent.decorators = [
    { type: core.Component, args: [{
                selector: 'lib-ng-eventstore-listing',
                template: "<!-- <div *ngIf=\"listHeaderGroups && listHeaderGroups.groups && listHeaderGroups.groups.length > 0\"  [class]=\"'row ' + (listHeaderGroups && listHeaderGroups.generalRowClassName ? listHeaderGroups.generalRowClassName : '')\">\n  <div class=\"col-12\">\n    <div class=\"header bg-white p-2\">\n      <div [class]=\"'row ' + listHeaderGroups.generalRowClassName\">\n        <div *ngFor=\"let listHeaderGroup of listHeaderGroups.groups\" [class]=\"listHeaderGroup.className\">\n          <div [class]=\"'row ' + listHeaderGroups.generalRowClassName\">\n            <div *ngFor=\"let listHeader of listHeaderGroup.listHeaders\" [class]=\"listHeader.className\">\n              <span (click)=\"onSort(listHeader.sortProperty)\" [ngClass]=\"{ 'sort-header': listHeader.sortProperty }\">{{ listHeader.displayName }} <i *ngIf=\"sortFields[listHeader.sortProperty] && sortFields[listHeader.sortProperty].icon\" [class]=\"'sort-icon ' + sortFields[listHeader.sortProperty].icon\"></i></span>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div> -->\n<!-- <div [class]=\"'row ' + (listHeaderGroups && listHeaderGroups.generalRowClassName) ? listHeaderGroups.generalRowClassName : ''\" *ngFor=\"let item of dataList; trackBy: trackByFn\"> -->\n<div class=\"row\" *ngFor=\"let item of _dataList; trackBy: trackByFn\">\n  <div class=\"col-12\">\n    <lib-item-template-holder\n      [data]=\"item\"\n      [itemComponentClass]=\"itemComponentClass\"\n      [lookups]=\"lookups\"\n      (updateEmitter)=\"_onUpdate($event)\"\n      (getLookupsEmitter)=\"_onGetLookups($event)\"\n      (showModalEmitter)=\"_onShowModal($event)\"\n      (deleteEmitter)=\"_onDelete($event)\">\n    </lib-item-template-holder>\n  </div>\n</div>\n<div class=\"row\" *ngIf=\"(!_dataCount || _dataCount === 0) && !_isLoading\">\n  <div class=\"col-12\">\n    <div class=\"row\">\n      <div class=\"col-12 no-results-container\">\n        <div class=\"text-center text-secondary\">\n          <span class=\"italic\">{{ emptyListDisplayText }}</span>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n\n<div [id]=\"'ng-eventstore-listing-overlay-' + _id\" class=\"ng-eventstore-listing-overlay\">\n  <div [id]=\"'ng-eventstore-listing-overlay-subject-' + _id\" class=\"ng-eventstore-listing-overlay-subject\" [ngStyle]=\"{ top:  loadingOffset }\">\n      <div class=\"ng-eventstore-listing-cssload-container\">\n        <div class=\"ng-eventstore-listing-cssload-speeding-wheel\"></div>\n      </div>\n  </div>\n</div>\n",
                styles: [".ng-eventstore-listing-overlay{position:absolute;width:100%;height:100%;top:0;left:0;right:0;bottom:0;background-color:#efefef;opacity:.7;z-index:10;display:none}.ng-eventstore-listing-overlay-subject{position:absolute;left:50%;font-size:50px;color:transparent;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);text-align:center}.ng-eventstore-listing-cssload-container{width:100%;height:49px;text-align:center}.ng-eventstore-listing-cssload-speeding-wheel{width:49px;height:49px;margin:0 auto;border:3px solid #3b356e;border-radius:50%;border-left-color:transparent;border-right-color:transparent;animation:475ms linear infinite cssload-spin;-o-animation:475ms linear infinite cssload-spin;-ms-animation:cssload-spin 475ms infinite linear;-webkit-animation:475ms linear infinite cssload-spin;-moz-animation:475ms linear infinite cssload-spin}@keyframes cssload-spin{100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@-webkit-keyframes cssload-spin{100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}"],
                changeDetection: core.ChangeDetectionStrategy.OnPush
            },] },
];
NgEventstoreListingComponent.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: core.Inject, args: [JQ_TOKEN,] }] },
    { type: core.ChangeDetectorRef },
    { type: ScriptService },
    { type: PlaybackService },
    { type: PlaybackListService }
]; };
NgEventstoreListingComponent.propDecorators = {
    updateEmitter: [{ type: core.Output }],
    getLookupsEmitter: [{ type: core.Output }],
    showModalEmitter: [{ type: core.Output }],
    deleteEmitter: [{ type: core.Output }],
    playbackListLoadedEmitter: [{ type: core.Output }],
    newItemNotifyEmitter: [{ type: core.Output }],
    removedItemNotifyEmitter: [{ type: core.Output }],
    getPlaybackLIstErrorEmitter: [{ type: core.Output }],
    itemComponentClass: [{ type: core.Input }],
    lookups: [{ type: core.Input }],
    socketUrl: [{ type: core.Input }],
    playbackListBaseUrl: [{ type: core.Input }],
    scriptStore: [{ type: core.Input }],
    itemSubscriptionConfigurations: [{ type: core.Input }],
    listSubscriptionConfiguration: [{ type: core.Input }],
    playbackListName: [{ type: core.Input }],
    filters: [{ type: core.Input }],
    sort: [{ type: core.Input }],
    pageIndex: [{ type: core.Input }],
    itemsPerPage: [{ type: core.Input }],
    responseBasePath: [{ type: core.Input }],
    emptyListDisplayText: [{ type: core.Input }],
    csvFileName: [{ type: core.Input }],
    customPlaybackConfigurations: [{ type: core.Input }],
    enableLoadingOverlay: [{ type: core.Input }],
    loadingTopBoundSelector: [{ type: core.Input }],
    minHeightCss: [{ type: core.Input }],
    loadingOffset: [{ type: core.Input }],
    debugging: [{ type: core.Input }]
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
    { type: core.ViewContainerRef }
]; };
var ItemTemplateHolderComponent = /** @class */ (function () {
    function ItemTemplateHolderComponent(componentFactoryResolver) {
        this.componentFactoryResolver = componentFactoryResolver;
        this.data = {};
        this.lookups = {};
        this.updateEmitter = new core.EventEmitter();
        this.getLookupsEmitter = new core.EventEmitter();
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
    { type: core.Component, args: [{
                selector: 'lib-item-template-holder',
                template: "<div class=\"row no-gutters\">\n  <div class=\"col-12\">\n    <ng-template libTemplateDirective></ng-template>\n  </div>\n</div>\n",
                styles: [""],
                changeDetection: core.ChangeDetectionStrategy.OnPush,
            },] },
];
ItemTemplateHolderComponent.ctorParameters = function () { return [
    { type: core.ComponentFactoryResolver }
]; };
ItemTemplateHolderComponent.propDecorators = {
    itemComponentClass: [{ type: core.Input }],
    data: [{ type: core.Input }],
    lookups: [{ type: core.Input }],
    updateEmitter: [{ type: core.Output }],
    getLookupsEmitter: [{ type: core.Output }],
    showModalEmitter: [{ type: core.Output }],
    deleteEmitter: [{ type: core.Output }],
    itemHost: [{ type: core.ViewChild, args: [TemplateDirective,] }]
};
var SocketIoService = /** @class */ (function () {
    function SocketIoService() {
    }
    SocketIoService.prototype.getSocketInstance = function (socketUrl) {
        return socket_ioClient.connect(socketUrl + "/events");
    };
    return SocketIoService;
}());
SocketIoService.decorators = [
    { type: core.Injectable },
];
SocketIoService.ctorParameters = function () { return []; };
var ɵ0 = jQueryFactory;
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
                    SocketIoService,
                    { provide: JQ_TOKEN, useFactory: ɵ0 }
                ]
            },] },
];
var FilterOperator = {
    range: 'range',
    dateRange: 'dateRange',
    is: 'is',
    any: 'any',
    contains: 'contains',
    endsWith: 'endsWith',
    startsWith: 'startsWith',
    arrayContains: 'arrayContains',
    exists: 'exists',
    notExists: 'notExists',
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
        this.onGetLookupsEmitter = new core.EventEmitter();
        this.onShowModalEmitter = new core.EventEmitter();
        this.onDeleteEmitter = new core.EventEmitter();
        this._formGroup = new forms.FormGroup({});
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
        var formControl = new forms.FormControl(initialValue, validators);
        this._formGroup.addControl(propertyName, formControl);
        this._formGroupKeys.push(propertyName);
        return formControl;
    };
    return ItemTemplateComponent;
}());

exports.FilterOperator = FilterOperator;
exports.SortDirection = SortDirection;
exports.GroupBooleanOperator = GroupBooleanOperator;
exports.ItemTemplateComponent = ItemTemplateComponent;
exports.NgEventstoreListingComponent = NgEventstoreListingComponent;
exports.NgEventstoreListingModule = NgEventstoreListingModule;
exports.ɵg = ItemTemplateHolderComponent;
exports.ɵh = TemplateDirective;
exports.ɵa = JQ_TOKEN;
exports.ɵb = jQueryFactory;
exports.ɵf = PlaybackListService;
exports.ɵd = PlaybackService;
exports.ɵe = PushService;
exports.ɵc = ScriptService;
exports.ɵi = SocketIoService;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ng-eventstore-listing.umd.js.map
