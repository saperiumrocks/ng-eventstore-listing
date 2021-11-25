import { InjectionToken, Injectable, Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, Inject, Directive, ViewContainerRef, ViewChild, ComponentFactoryResolver, NgModule } from '@angular/core';
import { __awaiter } from 'tslib';
import _forOwn from 'lodash-es/forOwn';
import _clone from 'lodash-es/clone';
import { connect } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { switchMap, debounceTime, map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { fromJS } from 'immutable';
import _isEmpty from 'lodash-es/isEmpty';
import * as moment_ from 'moment-mini-ts';
import saveAs from 'file-saver';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const Helpers = {
    generateToken: () => {
        return Math.random().toString(36).substr(2, 9) + '-' + Date.now().toString();
    }
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
let JQ_TOKEN = new InjectionToken('jQuery');
/**
 * @return {?}
 */
function jQueryFactory() {
    return jQuery;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class ScriptService {
    constructor() {
        this.scripts = {};
    }
    /**
     * @param {?} scriptStore
     * @return {?}
     */
    init(scriptStore) {
        return __awaiter(this, void 0, void 0, function* () {
            /** @type {?} */
            const promises = [];
            scriptStore.forEach((script) => {
                // console.log('SCRIPT STORE LOGGING');
                this.scripts[script.name] = {
                    loaded: false,
                    src: script.src,
                    meta: script.meta,
                };
                promises.push(this.load(script.name));
            });
            return yield Promise.all(promises);
        });
    }
    /**
     * @param {...?} scripts
     * @return {?}
     */
    load(...scripts) {
        return __awaiter(this, void 0, void 0, function* () {
            /** @type {?} */
            const promises = [];
            scripts.forEach((script) => promises.push(this.loadScript(script)));
            return yield Promise.all(promises);
        });
    }
    /**
     * @param {?} name
     * @return {?}
     */
    loadScript(name) {
        return new Promise((resolve, reject) => {
            // resolve if already loaded
            if (this.scripts[name].loaded) {
                // console.log('LOADED');
                resolve({
                    script: name,
                    loaded: true,
                    status: 'Already Loaded',
                    meta: this.scripts[name].meta,
                });
            }
            else {
                /** @type {?} */
                const existingScript = document.querySelectorAll(`head script[src="${this.scripts[name].src}"]`);
                if (existingScript.length === 0) {
                    /** @type {?} */
                    const script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.src = this.scripts[name].src;
                    if (script.readyState) {
                        // IE
                        script.onreadystatechange = () => {
                            // console.log('ON READYSTATECHANGE');
                            if (script.readyState === 'loaded' ||
                                script.readyState === 'complete') {
                                script.onreadystatechange = null;
                                this.scripts[name].loaded = true;
                                resolve({
                                    script: name,
                                    loaded: true,
                                    status: 'Loaded',
                                    meta: this.scripts[name].meta,
                                });
                            }
                        };
                    }
                    else {
                        // Others
                        // console.log('ONLOAD');
                        script.onload = () => {
                            this.scripts[name].loaded = true;
                            resolve({
                                script: name,
                                loaded: true,
                                status: 'Loaded',
                                meta: this.scripts[name].meta,
                            });
                        };
                    }
                    script.onerror = (error) => console.log('ON ERROR', error);
                    resolve({
                        script: name,
                        loaded: false,
                        status: 'Loaded',
                        meta: this.scripts[name].meta,
                    });
                    document.getElementsByTagName('head')[0].appendChild(script);
                }
                else {
                    // console.log('Script already exists');
                    resolve();
                }
            }
        });
    }
    /**
     * @param {?} scriptName
     * @return {?}
     */
    getScript(scriptName) {
        return this.scripts[scriptName];
    }
}
ScriptService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
ScriptService.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class PushService {
    constructor() {
        this.subscriptions = {};
    }
    /**
     * @param {?} socketUrl
     * @return {?}
     */
    init(socketUrl) {
        if (!this.ioPush) {
            this.ioPush = connect(`${socketUrl}/events`);
            this.ioPush.on('message', (eventObj) => {
                this._processEvent(eventObj);
            });
            this.ioPush.on('reconnect', () => {
                // console.log('TEST RECONNECTION');
                // this.ioPush.emit('resubscribe', () => {
                // console.log(this.subscriptions);
                _forOwn(this.subscriptions, (sub) => {
                    /** @type {?} */
                    const subscriptionQuery = Object.assign(sub.query, {
                        offset: sub.offset,
                    });
                    this.ioPush.emit('subscribe', subscriptionQuery, (token) => {
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
    }
    /**
     * @param {?} eventObj
     * @return {?}
     */
    _processEvent(eventObj) {
        /** @type {?} */
        const self = this;
        /** @type {?} */
        const queryKey = `${eventObj.context}.${eventObj.aggregate}.${eventObj.aggregateId}`;
        /** @type {?} */
        const clientTokens = Object.keys(self.subscriptions);
        // redirect to mapped subscription/token callback
        clientTokens.forEach((clientToken) => {
            /** @type {?} */
            const sub = self.subscriptions[clientToken];
            if (sub) {
                /** @type {?} */
                const subQueryKey = `${sub.query.context}.${sub.query.aggregate}.${sub.query.aggregateId}`;
                if (subQueryKey === queryKey) {
                    // update next offset (from stream revision) for this subscription, so for reconnecting
                    if (!isNaN(eventObj.streamRevision)) {
                        sub.offset = eventObj.streamRevision + 1;
                    }
                    if (typeof sub.cb === 'function') {
                        sub.cb(undefined, eventObj, sub.owner, clientToken);
                    }
                    /** @type {?} */
                    const tags = Object.keys(sub.monitorTags);
                    tags.forEach((tag) => {
                        // check for state/eventSource._meta or event._meta
                        if (eventObj._meta && eventObj._meta.tag === tag) {
                            /** @type {?} */
                            let reason = 'N/A';
                            if (typeof eventObj.eventType === 'string') {
                                reason = eventObj.eventType;
                            }
                            else if (typeof eventObj.stateType === 'string') {
                                reason = eventObj.stateType;
                                if (eventObj.eventSource &&
                                    typeof eventObj.eventSource.eventType === 'string') {
                                    reason += ` <- ${eventObj.eventSource.eventType}`;
                                }
                            }
                            /** @type {?} */
                            const monitors = sub.monitorTags[tag];
                            monitors.forEach((monitor) => {
                                monitor.callback(reason, eventObj._meta);
                            });
                        }
                    });
                }
            }
        });
    }
    /**
     * @param {?} query
     * @param {?} offset
     * @param {?} owner
     * @param {?} cb
     * @return {?}
     */
    subscribe(query, offset, owner, cb) {
        /** @type {?} */
        const pushToken = Helpers.generateToken();
        // map new subscription, then try to subscribe to server asap
        this.subscriptions[pushToken] = {
            query: query,
            offset: offset,
            owner: owner,
            cb: cb,
            monitorTags: {},
        };
        /** @type {?} */
        const sub = this.subscriptions[pushToken];
        if (sub && !sub.token) {
            /** @type {?} */
            const subscriptionQuery = Object.assign(sub.query, {
                offset: sub.offset,
            });
            this.ioPush.emit('subscribe', subscriptionQuery, ({ subscriptionToken, catchUpEvents }) => {
                if (subscriptionToken) {
                    // console.log('Server Subscribed:', token, subscriptionQuery);
                    sub.token = subscriptionToken;
                }
                else {
                    console.error('Subscribe error for query', subscriptionQuery);
                }
                if (catchUpEvents && catchUpEvents.length > 0) {
                    catchUpEvents.forEach((event) => {
                        cb(undefined, event, owner, pushToken);
                    });
                }
            });
        }
        return pushToken;
    }
    /**
     * @param {?} pushTokens
     * @return {?}
     */
    unsubscribe(pushTokens) {
        /** @type {?} */
        const socketTokens = [];
        pushTokens.forEach((pushToken) => {
            if (this.subscriptions[pushToken]) {
                /** @type {?} */
                const clientSubscription = _clone(this.subscriptions[pushToken]);
                delete this.subscriptions[pushToken];
                /** @type {?} */
                const sub = clientSubscription;
                if (sub && sub.token) {
                    socketTokens.push(sub.token);
                }
            }
        });
        return new Promise((resolve, reject) => {
            this.ioPush.emit('unsubscribe', socketTokens, () => {
                resolve();
            });
        });
    }
}
PushService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
PushService.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class PlaybackService {
    /**
     * @param {?} pushService
     */
    constructor(pushService) {
        this.pushService = pushService;
        this._playbackRegistry = {};
        this._conditionalSubscriptionRegistry = {};
        this._customPlaybackRegistry = {};
    }
    /**
     * @param {?} socketUrl
     * @return {?}
     */
    init(socketUrl) {
        this.pushService.init(socketUrl);
    }
    /**
     * @param {?} playbackTokens
     * @return {?}
     */
    unregisterForPlayback(playbackTokens) {
        return __awaiter(this, void 0, void 0, function* () {
            /** @type {?} */
            const pushTokens = playbackTokens.map((playbackToken) => {
                return this._playbackRegistry[playbackToken].pushSubscriptionId;
            });
            playbackTokens.forEach((token) => __awaiter(this, void 0, void 0, function* () {
                /** @type {?} */
                const rowId = this._playbackRegistry[token].rowId;
                // console.log('BEFORE');
                // console.log(this._conditionalSubscriptionRegistry);
                if (rowId) {
                    delete this._conditionalSubscriptionRegistry[rowId];
                }
                // console.log('AFTER');
                // console.log(this._conditionalSubscriptionRegistry);
                // unsubscribe from push
                delete this._playbackRegistry[token];
            }));
            yield this.pushService.unsubscribe(pushTokens);
        });
    }
    /**
     * @param {?} owner
     * @param {?} scriptName
     * @param {?} query
     * @param {?} stateFunctions
     * @param {?} playbackList
     * @param {?=} streamRevisionFunction
     * @param {?=} rowId
     * @param {?=} conditionFunction
     * @param {?=} rowIdFunction
     * @return {?}
     */
    registerForPlayback(owner, scriptName, query, stateFunctions, playbackList, streamRevisionFunction = (item) => 0, rowId, conditionFunction, rowIdFunction) {
        return __awaiter(this, void 0, void 0, function* () {
            /** @type {?} */
            const playbackSubscriptionId = Helpers.generateToken();
            /** @type {?} */
            let rowData;
            if (rowId) {
                /** @type {?} */
                const aggregateId = rowId ? rowId : query.aggregateId;
                rowData = yield new Promise((resolve, reject) => {
                    playbackList.get(aggregateId, (error, item) => {
                        if (error) {
                            reject(error);
                        }
                        resolve(item);
                    });
                });
            }
            /** @type {?} */
            let streamRevision;
            /** @type {?} */
            let isConditionTrue;
            if (rowData) {
                streamRevision = streamRevisionFunction(rowData);
                isConditionTrue = conditionFunction ? (conditionFunction(rowData) ? true : false) : undefined;
            }
            /** @type {?} */
            let pushSubscriptionId;
            if (isConditionTrue === true || conditionFunction === undefined) {
                pushSubscriptionId = yield this.pushService.subscribe(query, streamRevision, this, (err, eventObj, owner2) => __awaiter(this, void 0, void 0, function* () {
                    /** @type {?} */
                    const self = /** @type {?} */ (owner2);
                    /** @type {?} */
                    const registration = self._playbackRegistry[playbackSubscriptionId];
                    if (registration) {
                        if (eventObj.aggregate === 'states') {
                            /** @type {?} */
                            const thisScriptName = registration.scriptName;
                            /** @type {?} */
                            const fromEvent = eventObj.payload._meta.fromEvent;
                            /** @type {?} */
                            const eventName = fromEvent.payload.name;
                            /** @type {?} */
                            const thisPlaybackScript = window[thisScriptName];
                            /** @type {?} */
                            const playbackFunction = thisPlaybackScript.playbackInterface[eventName];
                            if (playbackFunction) {
                                if (registration.rowId) {
                                    eventObj.aggregateId = registration.rowId;
                                }
                                /** @type {?} */
                                const state = eventObj.payload;
                                /** @type {?} */
                                const funcs = {
                                    emit: (targetQuery, payload, done) => {
                                        done();
                                    },
                                    getPlaybackList: (playbackListName, callback) => {
                                        if (registration.playbackList) {
                                            callback(null, registration.playbackList);
                                        }
                                        else {
                                            callback(new Error('PlaybackList does not exist in this registration'), null);
                                        }
                                    },
                                };
                                /** @type {?} */
                                const doneCallback = () => {
                                    registration.playbackList.get(eventObj.aggregateId, (error, item) => {
                                        self._updateConditionalSubscriptions(eventObj.aggregateId, item);
                                    });
                                };
                                playbackFunction(state, fromEvent, funcs, doneCallback);
                                // Run custom playbackEvents if they exist
                                if (this._customPlaybackRegistry[eventName]) {
                                    this._customPlaybackRegistry[eventName].forEach((customPlaybackConfiguration) => {
                                        customPlaybackConfiguration.playbackFunction(fromEvent);
                                    });
                                }
                            }
                        }
                        else {
                            /** @type {?} */
                            const thisScriptName = registration.scriptName;
                            /** @type {?} */
                            const thisPlaybackScript = window[thisScriptName];
                            /** @type {?} */
                            const playbackFunction = thisPlaybackScript.playbackInterface[eventObj.payload.name];
                            if (playbackFunction) {
                                // Override aggregateId to handle other subscriptions
                                if (registration.rowId) {
                                    eventObj.aggregateId = registration.rowId;
                                }
                                /** @type {?} */
                                const row = stateFunctions.getState(eventObj.aggregateId);
                                /** @type {?} */
                                const state = row.data;
                                /** @type {?} */
                                const funcs = {
                                    emit: (targetQuery, payload, done) => {
                                        done();
                                    },
                                    getPlaybackList: (playbackListName, callback) => {
                                        if (registration.playbackList) {
                                            callback(null, registration.playbackList);
                                        }
                                        else {
                                            callback(new Error('PlaybackList does not exist in this registration'), null);
                                        }
                                    },
                                };
                                /** @type {?} */
                                const doneCallback = () => {
                                    registration.playbackList.get(eventObj.aggregateId, (error, item) => {
                                        self._updateConditionalSubscriptions(eventObj.aggregateId, item);
                                    });
                                };
                                playbackFunction(state, eventObj, funcs, doneCallback);
                                // Run custom playbackEvents if they exist
                                if (this._customPlaybackRegistry[eventObj.payload.name]) {
                                    this._customPlaybackRegistry[eventObj.payload.name].forEach((customPlaybackConfiguration) => {
                                        customPlaybackConfiguration.playbackFunction(eventObj);
                                    });
                                }
                            }
                        }
                    }
                }));
            }
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
            return playbackSubscriptionId;
        });
    }
    /**
     * @param {?} customPlaybackConfigurations
     * @return {?}
     */
    registerCustomPlaybacks(customPlaybackConfigurations) {
        customPlaybackConfigurations.forEach((customPlaybackConfiguration) => {
            if (!this._customPlaybackRegistry[customPlaybackConfiguration.eventName]) {
                this._customPlaybackRegistry[customPlaybackConfiguration.eventName] = [];
            }
            this._customPlaybackRegistry[customPlaybackConfiguration.eventName].push(customPlaybackConfiguration);
        });
    }
    /**
     * @return {?}
     */
    resetCustomPlaybacks() {
        this._customPlaybackRegistry = {};
    }
    /**
     * @param {?} rowId
     * @param {?} rowData
     * @return {?}
     */
    _updateConditionalSubscriptions(rowId, rowData) {
        /** @type {?} */
        const conditionalSubscriptions = this._conditionalSubscriptionRegistry[rowId] || [];
        conditionalSubscriptions.forEach((conditionalSubscription) => __awaiter(this, void 0, void 0, function* () {
            if (!conditionalSubscription.pushSubscriptionId && conditionalSubscription.conditionFunction(rowData)) {
                /** @type {?} */
                const offset = conditionalSubscription.streamRevisionFunction(rowData);
                /** @type {?} */
                const subQuery = _clone(conditionalSubscription.query);
                if (conditionalSubscription.rowIdFunction) {
                    subQuery.aggregateId = conditionalSubscription.rowIdFunction(rowData);
                }
                /** @type {?} */
                const pushSubscriptionId = this.pushService.subscribe(subQuery, offset, this, (err, eventObj, owner2) => __awaiter(this, void 0, void 0, function* () {
                    /** @type {?} */
                    const self = /** @type {?} */ (owner2);
                    /** @type {?} */
                    const registration = self._playbackRegistry[conditionalSubscription.playbackSubscriptionId];
                    if (eventObj.aggregate === 'states') {
                        /** @type {?} */
                        const thisScriptName = registration.scriptName;
                        /** @type {?} */
                        const fromEvent = eventObj.payload._meta.fromEvent;
                        /** @type {?} */
                        const eventName = fromEvent.payload.name;
                        /** @type {?} */
                        const thisPlaybackScript = window[thisScriptName];
                        /** @type {?} */
                        const playbackFunction = thisPlaybackScript.playbackInterface[eventName];
                        if (playbackFunction) {
                            /** @type {?} */
                            const state = eventObj.payload;
                            /** @type {?} */
                            const funcs = {
                                emit: (targetQuery, payload, done) => {
                                    done();
                                },
                                getPlaybackList: (playbackListName, callback) => {
                                    if (registration.playbackList) {
                                        callback(null, registration.playbackList);
                                    }
                                    else {
                                        callback(new Error('PlaybackList does not exist in this registration'), null);
                                    }
                                },
                            };
                            /** @type {?} */
                            const doneCallback = () => {
                            };
                            playbackFunction(state, fromEvent, funcs, doneCallback);
                        }
                    }
                    else {
                        /** @type {?} */
                        const thisScriptName = registration.scriptName;
                        /** @type {?} */
                        const thisPlaybackScript = window[thisScriptName];
                        /** @type {?} */
                        const playbackFunction = thisPlaybackScript.playbackInterface[eventObj.payload.name];
                        if (playbackFunction) {
                            // Override aggregateId to handle other subscriptions
                            if (registration.rowId) {
                                eventObj.aggregateId = registration.rowId;
                            }
                            /** @type {?} */
                            const row = conditionalSubscription.stateFunctions.getState(eventObj.aggregateId);
                            /** @type {?} */
                            const state = row.data;
                            /** @type {?} */
                            const funcs = {
                                emit: (targetQuery, payload, done) => {
                                    done();
                                },
                                getPlaybackList: (playbackListName, callback) => {
                                    if (registration.playbackList) {
                                        callback(null, registration.playbackList);
                                    }
                                    else {
                                        callback(new Error('PlaybackList does not exist in this registration'), null);
                                    }
                                },
                            };
                            /** @type {?} */
                            const doneCallback = () => {
                                // stateFunctions.setState(row.rowId, row);
                            };
                            playbackFunction(state, eventObj, funcs, doneCallback);
                        }
                    }
                }));
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
                return pushSubscriptionId;
            }
            else if (!conditionalSubscription.conditionFunction(rowData) && conditionalSubscription.pushSubscriptionId) {
                this.pushService.unsubscribe([conditionalSubscription.pushSubscriptionId]).then(() => {
                    delete this._playbackRegistry[conditionalSubscription.playbackSubscriptionId];
                    conditionalSubscription.pushSubscriptionId = undefined;
                });
            }
        }));
    }
}
PlaybackService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
PlaybackService.ctorParameters = () => [
    { type: PushService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class PlaybackListService {
    /**
     * @param {?} http
     */
    constructor(http) {
        this.http = http;
    }
    /**
     * @param {?} playbackListBaseUrl
     * @param {?} playbackListName
     * @param {?} startIndex
     * @param {?} limit
     * @param {?=} filters
     * @param {?=} sort
     * @param {?=} previousKey
     * @param {?=} nextKey
     * @return {?}
     */
    getPlaybackList(playbackListBaseUrl, playbackListName, startIndex, limit, filters, sort, previousKey, nextKey) {
        /** @type {?} */
        let url = `${playbackListBaseUrl}/playback-list/${playbackListName}?startIndex=${startIndex}&limit=${limit}`;
        if (filters) {
            url += `&filters=${encodeURIComponent(JSON.stringify(filters))}`;
        }
        if (sort) {
            url += `&sort=${JSON.stringify(sort)}`;
        }
        if (previousKey) {
            url += '&previousKey=' + previousKey;
        }
        if (nextKey) {
            url += '&nextKey=' + nextKey;
        }
        return this.http.get(url);
    }
    /**
     * @param {?} playbackListBaseUrl
     * @param {?} playbackListName
     * @param {?} startIndex
     * @param {?} limit
     * @param {?=} filters
     * @param {?=} sort
     * @param {?=} type
     * @return {?}
     */
    getPlaybackListCsv(playbackListBaseUrl, playbackListName, startIndex, limit, filters, sort, type) {
        /** @type {?} */
        let url = `${playbackListBaseUrl}/playback-list/${playbackListName}/export?startIndex=${startIndex}&limit=${limit}`;
        if (filters) {
            url += `&filters=${JSON.stringify(filters)}`;
        }
        if (sort) {
            url += `&sort=${JSON.stringify(sort)}`;
        }
        if (type) {
            url += `&type=${type}`;
        }
        return this.http.get(url, /** @type {?} */ ({ responseType: 'text/csv' }));
    }
}
PlaybackListService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
PlaybackListService.ctorParameters = () => [
    { type: HttpClient }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgEventstoreListingComponent {
    /**
     * @param {?} $
     * @param {?} changeDetectorRef
     * @param {?} scriptService
     * @param {?} playbackService
     * @param {?} playbackListService
     */
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
                /** @type {?} */
                const rowIndex = this._dataList.findIndex((value) => {
                    return value.get('rowId') === rowId;
                });
                if (rowIndex > -1) {
                    /** @type {?} */
                    const data = this._dataList.get(rowIndex);
                    if (data) {
                        callback(null, (/** @type {?} */ (data)).toJS());
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
                /** @type {?} */
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
                /** @type {?} */
                const rowIndex = this._dataList.findIndex((value) => {
                    return value.get('rowId') === rowId;
                });
                /** @type {?} */
                const newEntry = fromJS({
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
                /** @type {?} */
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
                /** @type {?} */
                const index = this._dataList.findIndex((row) => {
                    return row.get('rowId') === id;
                });
                if (index > 0) {
                    return (/** @type {?} */ (this._dataList.get(index))).toJS();
                }
                return {};
            },
            setState: (id, data) => {
                /** @type {?} */
                const index = this._dataList.findIndex((row) => {
                    return row.get('rowId') === id;
                });
                this._dataList = this._dataList.set(index, fromJS(data));
                this.changeDetectorRef.markForCheck();
            },
        };
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        /** @type {?} */
        const self = this;
        if (!self._initialized) {
            this._initialized = true;
            this._loadScripts().then(() => {
                this._initializeRequests();
                this.playbackService.init(this.socketUrl);
                /** @type {?} */
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
            /** @type {?} */
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
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._resetSubscriptions();
        this.playbackService.resetCustomPlaybacks();
        this._initialized = false;
    }
    /**
     * @param {?} index
     * @param {?} item
     * @return {?}
     */
    trackByFn(index, item) {
        return item.get('rowId');
    }
    /**
     * @return {?}
     */
    _initializeRequests() {
        /** @type {?} */
        const self = this;
        self._getPlaybackListSubscription = self._getPlaybackListSubject
            .pipe(debounceTime(100), switchMap((params) => {
            return self.playbackListService.getPlaybackList(self.playbackListBaseUrl, params.playbackListName, params.startIndex, params.limit, params.filters, params.sort, params.previousKey, params.nextKey);
        }))
            .subscribe((res) => {
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
        }, (error) => {
            self.getPlaybackLIstErrorEmitter.emit(error);
            if (self.enableLoadingOverlay) {
                self.hideLoadingOverlay();
            }
            self._isLoading = false;
        });
        self._exportPlaybackListSubscription = self._exportPlaybackListSubject
            .pipe(debounceTime(100), switchMap((params) => {
            /** @type {?} */
            const playbackListRequest = params.playbackListRequest;
            return self.playbackListService.getPlaybackListCsv(self.playbackListBaseUrl, playbackListRequest.playbackListName, playbackListRequest.startIndex, playbackListRequest.limit, playbackListRequest.filters, playbackListRequest.sort, playbackListRequest.type).pipe(map((response) => {
                return [response, params.fileNameOverride];
            }));
        }))
            .subscribe(([result, fileNameOverride]) => {
            /** @type {?} */
            const csv = new Blob([result], { type: 'text/csv' });
            /** @type {?} */
            const moment = moment_;
            /** @type {?} */
            const now = moment();
            /** @type {?} */
            const fileName = `${fileNameOverride || this.csvFileName || this.playbackListName}-${now.format('YYYY-MM-DD_HHmmss')}.csv`;
            saveAs(csv, fileName);
        });
    }
    /**
     * @param {?} playbackListName
     * @param {?} startIndex
     * @param {?} limit
     * @param {?=} filters
     * @param {?=} sort
     * @param {?=} previousKey
     * @param {?=} nextKey
     * @return {?}
     */
    _getPlaybackList(playbackListName, startIndex, limit, filters, sort, previousKey, nextKey) {
        /** @type {?} */
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
    /**
     * @return {?}
     */
    requestPlaybackList() {
        /** @type {?} */
        let startIndex;
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
                /** @type {?} */
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
    /**
     * @return {?}
     */
    _loadScripts() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.scriptStore) {
                yield this.scriptService.init(this.scriptStore);
            }
        });
    }
    /**
     * @return {?}
     */
    _initSubscriptions() {
        return __awaiter(this, void 0, void 0, function* () {
            /** @type {?} */
            const self = this;
            // Per row subscriptions
            (self.itemSubscriptionConfigurations || []).forEach((itemSubscriptionConfiguration) => {
                if (itemSubscriptionConfiguration) {
                    self._dataList.forEach((row) => __awaiter(this, void 0, void 0, function* () {
                        /** @type {?} */
                        const streamRevisionFunction = itemSubscriptionConfiguration.streamRevisionFunction ?
                            itemSubscriptionConfiguration.streamRevisionFunction : () => +row.get('revision') + 1;
                        /** @type {?} */
                        const aggregateId = itemSubscriptionConfiguration.rowIdFunction ?
                            itemSubscriptionConfiguration.rowIdFunction(row.toJS()) : row.get('rowId');
                        /** @type {?} */
                        const query = _clone(itemSubscriptionConfiguration.query);
                        query.aggregateId = query.aggregateId.replace(/{{rowId}}/g, aggregateId);
                        /** @type {?} */
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
    /**
     * @return {?}
     */
    _initCustomPlaybackConfigurations() {
        if (!_isEmpty(this.customPlaybackConfigurations)) {
            this.playbackService.registerCustomPlaybacks(this.customPlaybackConfigurations);
        }
    }
    /**
     * @return {?}
     */
    _resetSubscriptions() {
        this.playbackService.unregisterForPlayback(this._playbackSubscriptionTokens);
        this._playbackSubscriptionTokens = [];
    }
    /**
     * @param {?} payload
     * @return {?}
     */
    _onUpdate(payload) {
        this.updateEmitter.emit(payload);
    }
    /**
     * @param {?} payload
     * @return {?}
     */
    _onGetLookups(payload) {
        this.getLookupsEmitter.emit(payload);
    }
    /**
     * @param {?} payload
     * @return {?}
     */
    _onShowModal(payload) {
        this.showModalEmitter.emit(payload);
    }
    /**
     * @param {?} payload
     * @return {?}
     */
    _onDelete(payload) {
        this.deleteEmitter.emit(payload);
    }
    /**
     * @param {?=} overrideParams
     * @param {?=} fileNameOverride
     * @return {?}
     */
    exportCSV(overrideParams, fileNameOverride) {
        if (overrideParams) {
            this._exportPlaybackListSubject.next({ playbackListRequest: overrideParams, fileNameOverride: fileNameOverride });
        }
        else {
            /** @type {?} */
            const startIndex = this.itemsPerPage * (this.pageIndex - 1);
            /** @type {?} */
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
    /**
     * @return {?}
     */
    hideLoadingOverlay() {
        /** @type {?} */
        const $ = this.$;
        $('body').css('overflow', '');
        $('body').removeClass('loading-body');
        $(`#ng-eventstore-listing-overlay-${this._id}`).hide();
    }
    /**
     * @return {?}
     */
    showLoadingOverlay() {
        /** @type {?} */
        const $ = this.$;
        $(`#ng-eventstore-listing-overlay-${this._id}`).show();
        if (this.loadingTopBoundSelector ? true : false) {
            this._fixLoadingOverlayPosition();
        }
    }
    /**
     * @return {?}
     */
    _fixLoadingOverlayPosition() {
        /** @type {?} */
        const $ = this.$;
        /** @type {?} */
        const windowY = window.pageYOffset;
        /** @type {?} */
        const pageHeaderSectionHeight = 53;
        /** @type {?} */
        const pageHeaderSectionBottomY = $(this.loadingTopBoundSelector).offset().top + pageHeaderSectionHeight;
        $('body').css('overflow', 'hidden');
        $('body').addClass('loading-body');
        if (windowY < pageHeaderSectionBottomY) {
            $(`#ng-eventstore-listing-overlay-${this._id}`).css('position', 'absolute');
            $(`#ng-eventstore-listing-overlay-${this._id}`).css('height', `${window.innerHeight}px`);
            $(`#ng-eventstore-listing-overlay-${this._id}`).css('width', '100%');
            /** @type {?} */
            const pageHeaderHeight = pageHeaderSectionHeight;
            $(`#ng-eventstore-listing-overlay-${this._id}`).css('margin-top', `${pageHeaderHeight}px`);
        }
        else {
            $(`#ng-eventstore-listing-overlay-${this._id}`).css('position', 'fixed');
            $(`#ng-eventstore-listing-overlay-${this._id}`).css('height', '100%');
            $(`#ng-eventstore-listing-overlay-${this._id}`).css('margin-top', '0px');
        }
    }
}
NgEventstoreListingComponent.decorators = [
    { type: Component, args: [{
                selector: 'lib-ng-eventstore-listing',
                template: `<!-- <div *ngIf="listHeaderGroups && listHeaderGroups.groups && listHeaderGroups.groups.length > 0"  [class]="'row ' + (listHeaderGroups && listHeaderGroups.generalRowClassName ? listHeaderGroups.generalRowClassName : '')">
  <div class="col-12">
    <div class="header bg-white p-2">
      <div [class]="'row ' + listHeaderGroups.generalRowClassName">
        <div *ngFor="let listHeaderGroup of listHeaderGroups.groups" [class]="listHeaderGroup.className">
          <div [class]="'row ' + listHeaderGroups.generalRowClassName">
            <div *ngFor="let listHeader of listHeaderGroup.listHeaders" [class]="listHeader.className">
              <span (click)="onSort(listHeader.sortProperty)" [ngClass]="{ 'sort-header': listHeader.sortProperty }">{{ listHeader.displayName }} <i *ngIf="sortFields[listHeader.sortProperty] && sortFields[listHeader.sortProperty].icon" [class]="'sort-icon ' + sortFields[listHeader.sortProperty].icon"></i></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div> -->
<!-- <div [class]="'row ' + (listHeaderGroups && listHeaderGroups.generalRowClassName) ? listHeaderGroups.generalRowClassName : ''" *ngFor="let item of dataList; trackBy: trackByFn"> -->
<div class="row" *ngFor="let item of _dataList; trackBy: trackByFn">
  <div class="col-12">
    <lib-item-template-holder
      [data]="item"
      [itemComponentClass]="itemComponentClass"
      [lookups]="lookups"
      (updateEmitter)="_onUpdate($event)"
      (getLookupsEmitter)="_onGetLookups($event)"
      (showModalEmitter)="_onShowModal($event)"
      (deleteEmitter)="_onDelete($event)">
    </lib-item-template-holder>
  </div>
</div>
<div class="row" *ngIf="(!_dataCount || _dataCount === 0) && !_isLoading">
  <div class="col-12">
    <div class="row">
      <div class="col-12 no-results-container">
        <div class="text-center text-secondary">
          <span class="italic">{{ emptyListDisplayText }}</span>
        </div>
      </div>
    </div>
  </div>
</div>

<div [id]="'ng-eventstore-listing-overlay-' + _id" class="ng-eventstore-listing-overlay">
  <div [id]="'ng-eventstore-listing-overlay-subject-' + _id" class="ng-eventstore-listing-overlay-subject" [ngStyle]="{ top:  loadingOffset }">
      <div class="ng-eventstore-listing-cssload-container">
        <div class="ng-eventstore-listing-cssload-speeding-wheel"></div>
      </div>
  </div>
</div>
`,
                styles: [`.ng-eventstore-listing-overlay{position:absolute;width:100%;height:100%;top:0;left:0;right:0;bottom:0;background-color:#efefef;opacity:.7;z-index:10;display:none}.ng-eventstore-listing-overlay-subject{position:absolute;left:50%;font-size:50px;color:transparent;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);text-align:center}.ng-eventstore-listing-cssload-container{width:100%;height:49px;text-align:center}.ng-eventstore-listing-cssload-speeding-wheel{width:49px;height:49px;margin:0 auto;border:3px solid #3b356e;border-radius:50%;border-left-color:transparent;border-right-color:transparent;animation:475ms linear infinite cssload-spin;-o-animation:475ms linear infinite cssload-spin;-ms-animation:cssload-spin 475ms infinite linear;-webkit-animation:475ms linear infinite cssload-spin;-moz-animation:475ms linear infinite cssload-spin}@keyframes cssload-spin{100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@-webkit-keyframes cssload-spin{100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}`],
                changeDetection: ChangeDetectionStrategy.OnPush
            },] },
];
/** @nocollapse */
NgEventstoreListingComponent.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [JQ_TOKEN,] }] },
    { type: ChangeDetectorRef },
    { type: ScriptService },
    { type: PlaybackService },
    { type: PlaybackListService }
];
NgEventstoreListingComponent.propDecorators = {
    updateEmitter: [{ type: Output }],
    getLookupsEmitter: [{ type: Output }],
    showModalEmitter: [{ type: Output }],
    deleteEmitter: [{ type: Output }],
    playbackListLoadedEmitter: [{ type: Output }],
    newItemNotifyEmitter: [{ type: Output }],
    removedItemNotifyEmitter: [{ type: Output }],
    getPlaybackLIstErrorEmitter: [{ type: Output }],
    itemComponentClass: [{ type: Input }],
    lookups: [{ type: Input }],
    socketUrl: [{ type: Input }],
    playbackListBaseUrl: [{ type: Input }],
    scriptStore: [{ type: Input }],
    itemSubscriptionConfigurations: [{ type: Input }],
    listSubscriptionConfiguration: [{ type: Input }],
    playbackListName: [{ type: Input }],
    filters: [{ type: Input }],
    sort: [{ type: Input }],
    pageIndex: [{ type: Input }],
    itemsPerPage: [{ type: Input }],
    responseBasePath: [{ type: Input }],
    emptyListDisplayText: [{ type: Input }],
    csvFileName: [{ type: Input }],
    customPlaybackConfigurations: [{ type: Input }],
    enableLoadingOverlay: [{ type: Input }],
    loadingTopBoundSelector: [{ type: Input }],
    minHeightCss: [{ type: Input }],
    loadingOffset: [{ type: Input }],
    debugging: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class TemplateDirective {
    /**
     * @param {?} viewContainerRef
     */
    constructor(viewContainerRef) {
        this.viewContainerRef = viewContainerRef;
    }
}
TemplateDirective.decorators = [
    { type: Directive, args: [{
                selector: '[libTemplateDirective]'
            },] },
];
/** @nocollapse */
TemplateDirective.ctorParameters = () => [
    { type: ViewContainerRef }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class ItemTemplateHolderComponent {
    /**
     * @param {?} componentFactoryResolver
     */
    constructor(componentFactoryResolver) {
        this.componentFactoryResolver = componentFactoryResolver;
        this.data = {};
        this.lookups = {};
        this.updateEmitter = new EventEmitter();
        this.getLookupsEmitter = new EventEmitter();
        this.showModalEmitter = new EventEmitter();
        this.deleteEmitter = new EventEmitter();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        // this.loadComponent();
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this.loadComponent();
        if (this.initialChanges) {
            this.ngOnChanges(this.initialChanges);
            this.initialChanges = undefined;
        }
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        /** @type {?} */
        const self = this;
        if (self.componentRef) {
            /** @type {?} */
            const changesKeys = Object.keys(changes);
            changesKeys.forEach((key) => {
                (/** @type {?} */ (self.componentRef.instance))[key] =
                    changes[key].currentValue;
            });
            (/** @type {?} */ (self.componentRef.instance)).ngOnChanges(changes);
        }
        else {
            this.initialChanges = changes;
        }
    }
    /**
     * @return {?}
     */
    loadComponent() {
        /** @type {?} */
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.itemComponentClass);
        /** @type {?} */
        const viewContainerRef = this.itemHost.viewContainerRef;
        viewContainerRef.clear();
        this.componentRef = viewContainerRef.createComponent(componentFactory);
        (/** @type {?} */ (this.componentRef.instance)).data = this.data;
        (/** @type {?} */ (this.componentRef
            .instance)).onUpdateEmitter = this.updateEmitter;
        (/** @type {?} */ (this.componentRef
            .instance)).onGetLookupsEmitter = this.getLookupsEmitter;
        (/** @type {?} */ (this.componentRef
            .instance)).onShowModalEmitter = this.showModalEmitter;
        (/** @type {?} */ (this.componentRef
            .instance)).onDeleteEmitter = this.deleteEmitter;
        // (this.componentRef.instance as ItemTemplateComponent).idPropertyName = this.idPropertyName;
        (/** @type {?} */ (this.componentRef
            .instance)).lookups = this.lookups;
        (/** @type {?} */ (this.componentRef.instance)).ngOnInit();
    }
}
ItemTemplateHolderComponent.decorators = [
    { type: Component, args: [{
                selector: 'lib-item-template-holder',
                template: `<div class="row no-gutters">
  <div class="col-12">
    <ng-template libTemplateDirective></ng-template>
  </div>
</div>
`,
                styles: [``],
                changeDetection: ChangeDetectionStrategy.OnPush,
            },] },
];
/** @nocollapse */
ItemTemplateHolderComponent.ctorParameters = () => [
    { type: ComponentFactoryResolver }
];
ItemTemplateHolderComponent.propDecorators = {
    itemComponentClass: [{ type: Input }],
    data: [{ type: Input }],
    lookups: [{ type: Input }],
    updateEmitter: [{ type: Output }],
    getLookupsEmitter: [{ type: Output }],
    showModalEmitter: [{ type: Output }],
    deleteEmitter: [{ type: Output }],
    itemHost: [{ type: ViewChild, args: [TemplateDirective,] }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class SocketIoService {
    constructor() { }
    /**
     * @param {?} socketUrl
     * @return {?}
     */
    getSocketInstance(socketUrl) {
        return connect(`${socketUrl}/events`);
        //   if (!this.sockets[socketUrl]) {
        //     this.sockets[socketUrl] = io.connect(`${socketUrl}/events`);
        //   }
        //   return this.sockets[socketUrl];
    }
}
SocketIoService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
SocketIoService.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
const ɵ0 = jQueryFactory;
class NgEventstoreListingModule {
}
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
                    SocketIoService,
                    { provide: JQ_TOKEN, useFactory: ɵ0 }
                ]
            },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @enum {string} */
const FilterOperator = {
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @enum {string} */
const SortDirection = {
    ASC: 'ASC',
    DESC: 'DESC',
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @enum {string} */
const GroupBooleanOperator = {
    and: 'and',
    or: 'or',
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @abstract
 */
class ItemTemplateComponent {
    /**
     * @param {?=} changeDetectorRef
     */
    constructor(changeDetectorRef) {
        this.changeDetectorRef = changeDetectorRef;
        // Event Emitters
        this.onUpdateEmitter = new EventEmitter();
        this.onGetLookupsEmitter = new EventEmitter();
        this.onShowModalEmitter = new EventEmitter();
        this.onDeleteEmitter = new EventEmitter();
        this._formGroup = new FormGroup({});
        this._formGroupKeys = [];
        this.registerChangeFunction = (changeFn) => {
            this._changeFn = changeFn;
        };
        this.onUpdate = (propertyName, actionData) => {
            /** @type {?} */
            const actionEventEmitterData = {
                propertyName: propertyName,
                id: this.data.get(this.idPropertyName),
                data: actionData,
            };
            this.onUpdateEmitter.emit(actionEventEmitterData);
        };
        this.onGetLookups = (lookupName, callback) => {
            /** @type {?} */
            const actionEventEmitterData = {
                lookupName: lookupName,
                callback: callback
            };
            this.onGetLookupsEmitter.emit(actionEventEmitterData);
        };
        this.onShowModal = (modalName, data) => {
            /** @type {?} */
            const actionEventEmitterData = {
                modalName: modalName,
                id: this.data.get(this.idPropertyName),
                data: data,
            };
            this.onShowModalEmitter.emit(actionEventEmitterData);
        };
        this.onDelete = (actionData) => {
            /** @type {?} */
            const actionEventEmitterData = {
                id: this.data.get(this.idPropertyName),
                data: actionData,
            };
            this.onDeleteEmitter.emit(actionEventEmitterData);
        };
        // registerFormControl(propertyName: string)
        this.registerFormGroup = (formGroup) => {
            this._formGroup = formGroup;
        };
    }
    /**
     * @return {?}
     */
    ngOnInit() { }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (this._changeFn) {
            this._changeFn(changes);
        }
        /** @type {?} */
        const dataChanges = changes["data"] ? changes["data"].currentValue : null;
        if (dataChanges && !changes["data"].isFirstChange()) {
            /** @type {?} */
            const dataObj = (/** @type {?} */ (dataChanges)).toJS();
            this._formGroupKeys.forEach((key) => {
                /** @type {?} */
                const newValue = dataObj.data[key];
                /** @type {?} */
                const oldValue = this._formGroup.get(key).value;
                if (newValue !== oldValue) {
                    this._formGroup.get(key).setValue(newValue, { emit: false, onlySelf: true });
                }
            });
        }
        if (this.changeDetectorRef) {
            this.changeDetectorRef.detectChanges();
        }
    }
    /**
     * @param {?} propertyName
     * @param {?} initialValue
     * @param {?} validators
     * @return {?}
     */
    createFormControl(propertyName, initialValue, validators) {
        /** @type {?} */
        const formControl = new FormControl(initialValue, validators);
        this._formGroup.addControl(propertyName, formControl);
        this._formGroupKeys.push(propertyName);
        return formControl;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @abstract
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/*
 * Public API Surface of ng-eventstore-listing
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { FilterOperator, SortDirection, GroupBooleanOperator, ItemTemplateComponent, NgEventstoreListingComponent, NgEventstoreListingModule, ItemTemplateHolderComponent as ɵg, TemplateDirective as ɵh, JQ_TOKEN as ɵa, jQueryFactory as ɵb, PlaybackListService as ɵf, PlaybackService as ɵd, PushService as ɵe, ScriptService as ɵc, SocketIoService as ɵi };
//# sourceMappingURL=ng-eventstore-listing.js.map
