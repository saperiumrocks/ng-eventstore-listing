import { __awaiter } from 'tslib';
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
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
            const /** @type {?} */ promises = [];
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
            const /** @type {?} */ promises = [];
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
                const /** @type {?} */ existingScript = document.querySelectorAll(`head script[src="${this.scripts[name].src}"]`);
                if (existingScript.length === 0) {
                    // load script
                    const /** @type {?} */ script = document.createElement('script');
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
 * @suppress {checkTypes} checked by tsc
 */
const Helpers = {
    generateToken: () => {
        return Math.random().toString(36).substr(2, 9) + '-' + Date.now().toString();
    }
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
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
                    const /** @type {?} */ subscriptionQuery = Object.assign(sub.query, {
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
        const /** @type {?} */ self = this;
        // console.log('got message from push server: ', eventObj);
        const /** @type {?} */ queryKey = `${eventObj.context}.${eventObj.aggregate}.${eventObj.aggregateId}`;
        const /** @type {?} */ clientTokens = Object.keys(self.subscriptions);
        // redirect to mapped subscription/token callback
        clientTokens.forEach((clientToken) => {
            const /** @type {?} */ sub = self.subscriptions[clientToken];
            if (sub) {
                const /** @type {?} */ subQueryKey = `${sub.query.context}.${sub.query.aggregate}.${sub.query.aggregateId}`;
                if (subQueryKey === queryKey) {
                    // update next offset (from stream revision) for this subscription, so for reconnecting
                    if (!isNaN(eventObj.streamRevision)) {
                        sub.offset = eventObj.streamRevision + 1;
                    }
                    if (typeof sub.cb === 'function') {
                        sub.cb(undefined, eventObj, sub.owner, clientToken);
                    }
                    // iterate on monitors meta tags
                    const /** @type {?} */ tags = Object.keys(sub.monitorTags);
                    tags.forEach((tag) => {
                        // check for state/eventSource._meta or event._meta
                        if (eventObj._meta && eventObj._meta.tag === tag) {
                            let /** @type {?} */ reason = 'N/A';
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
                            // iterate on the monitors
                            const /** @type {?} */ monitors = sub.monitorTags[tag];
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
        // await this.waitForSocketConnection();
        const /** @type {?} */ pushToken = Helpers.generateToken();
        // map new subscription, then try to subscribe to server asap
        this.subscriptions[pushToken] = {
            query: query,
            offset: offset,
            owner: owner,
            cb: cb,
            monitorTags: {},
        };
        const /** @type {?} */ sub = this.subscriptions[pushToken];
        if (sub && !sub.token) {
            // build up proper subscribe request query
            const /** @type {?} */ subscriptionQuery = Object.assign(sub.query, {
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
        const /** @type {?} */ socketTokens = [];
        pushTokens.forEach((pushToken) => {
            if (this.subscriptions[pushToken]) {
                const /** @type {?} */ clientSubscription = _clone(this.subscriptions[pushToken]);
                delete this.subscriptions[pushToken];
                const /** @type {?} */ sub = clientSubscription;
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
 * @suppress {checkTypes} checked by tsc
 */
class PlaybackService {
    /**
     * @param {?} scriptService
     * @param {?} pushService
     */
    constructor(scriptService, pushService) {
        this.scriptService = scriptService;
        this.pushService = pushService;
        this._playbackRegistry = {};
        this._conditionalSubscriptionRegistry = {};
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
            // unregister from playback registry
            const /** @type {?} */ pushTokens = playbackTokens.map((playbackToken) => {
                return this._playbackRegistry[playbackToken].pushSubscriptionId;
            });
            playbackTokens.forEach((token) => __awaiter(this, void 0, void 0, function* () {
                const /** @type {?} */ rowId = this._playbackRegistry[token].rowId;
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
            const /** @type {?} */ playbackSubscriptionId = Helpers.generateToken();
            let /** @type {?} */ rowData;
            if (rowId) {
                const /** @type {?} */ aggregateId = rowId ? rowId : query.aggregateId;
                rowData = yield new Promise((resolve, reject) => {
                    playbackList.get(aggregateId, (error, item) => {
                        if (error) {
                            reject(error);
                        }
                        resolve(item);
                    });
                });
            }
            let /** @type {?} */ streamRevision;
            let /** @type {?} */ isConditionTrue;
            if (rowData) {
                streamRevision = streamRevisionFunction(rowData);
                isConditionTrue = conditionFunction ? (conditionFunction(rowData) ? true : false) : undefined;
            }
            let /** @type {?} */ pushSubscriptionId;
            if (isConditionTrue === true || conditionFunction === undefined) {
                pushSubscriptionId = yield this.pushService.subscribe(query, streamRevision, this, (err, eventObj, owner2) => __awaiter(this, void 0, void 0, function* () {
                    // owner is playbackservice
                    const /** @type {?} */ self = /** @type {?} */ (owner2);
                    // console.log(self._playbackRegistry);
                    const /** @type {?} */ registration = self._playbackRegistry[playbackSubscriptionId];
                    if (registration) {
                        if (eventObj.aggregate === 'states') {
                            const /** @type {?} */ thisScriptName = registration.scriptName;
                            const /** @type {?} */ fromEvent = eventObj.payload._meta.fromEvent;
                            const /** @type {?} */ eventName = fromEvent.payload.name;
                            const /** @type {?} */ thisPlaybackScript = window[thisScriptName];
                            const /** @type {?} */ playbackFunction = thisPlaybackScript.playbackInterface[eventName];
                            if (playbackFunction) {
                                if (registration.rowId) {
                                    eventObj.aggregateId = registration.rowId;
                                }
                                const /** @type {?} */ state = eventObj.payload;
                                const /** @type {?} */ funcs = {
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
                                const /** @type {?} */ doneCallback = () => {
                                    registration.playbackList.get(eventObj.aggregateId, (error, item) => {
                                        self._updateConditionalSubscriptions(eventObj.aggregateId, item);
                                    });
                                };
                                playbackFunction(state, fromEvent, funcs, doneCallback);
                            }
                        }
                        else {
                            const /** @type {?} */ thisScriptName = registration.scriptName;
                            const /** @type {?} */ thisPlaybackScript = window[thisScriptName];
                            const /** @type {?} */ playbackFunction = thisPlaybackScript.playbackInterface[eventObj.payload.name];
                            if (playbackFunction) {
                                // Override aggregateId to handle other subscriptions
                                if (registration.rowId) {
                                    eventObj.aggregateId = registration.rowId;
                                }
                                const /** @type {?} */ row = stateFunctions.getState(eventObj.aggregateId);
                                const /** @type {?} */ state = row.data;
                                const /** @type {?} */ funcs = {
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
                                const /** @type {?} */ doneCallback = () => {
                                    registration.playbackList.get(eventObj.aggregateId, (error, item) => {
                                        self._updateConditionalSubscriptions(eventObj.aggregateId, item);
                                    });
                                };
                                playbackFunction(state, eventObj, funcs, doneCallback);
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
     * @param {?} rowId
     * @param {?} rowData
     * @return {?}
     */
    _updateConditionalSubscriptions(rowId, rowData) {
        const /** @type {?} */ conditionalSubscriptions = this._conditionalSubscriptionRegistry[rowId] || [];
        conditionalSubscriptions.forEach((conditionalSubscription) => __awaiter(this, void 0, void 0, function* () {
            if (!conditionalSubscription.pushSubscriptionId && conditionalSubscription.conditionFunction(rowData)) {
                const /** @type {?} */ offset = conditionalSubscription.streamRevisionFunction(rowData);
                const /** @type {?} */ query = _clone(conditionalSubscription.query);
                if (conditionalSubscription.rowIdFunction) {
                    query.aggregateId = conditionalSubscription.rowIdFunction(rowData);
                }
                const /** @type {?} */ pushSubscriptionId = this.pushService.subscribe(conditionalSubscription.query, offset, this, (err, eventObj, owner2) => __awaiter(this, void 0, void 0, function* () {
                    // owner is playbackservice
                    const /** @type {?} */ self = /** @type {?} */ (owner2);
                    const /** @type {?} */ registration = self._playbackRegistry[conditionalSubscription.playbackSubscriptionId];
                    if (eventObj.aggregate === 'states') {
                        const /** @type {?} */ thisScriptName = registration.scriptName;
                        const /** @type {?} */ fromEvent = eventObj.payload._meta.fromEvent;
                        const /** @type {?} */ eventName = fromEvent.payload.name;
                        const /** @type {?} */ thisPlaybackScript = window[thisScriptName];
                        const /** @type {?} */ playbackFunction = thisPlaybackScript.playbackInterface[eventName];
                        if (playbackFunction) {
                            const /** @type {?} */ state = eventObj.payload;
                            const /** @type {?} */ funcs = {
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
                            const /** @type {?} */ doneCallback = () => {
                            };
                            playbackFunction(state, fromEvent, funcs, doneCallback);
                        }
                    }
                    else {
                        const /** @type {?} */ thisScriptName = registration.scriptName;
                        const /** @type {?} */ thisPlaybackScript = window[thisScriptName];
                        const /** @type {?} */ playbackFunction = thisPlaybackScript.playbackInterface[eventObj.payload.name];
                        if (playbackFunction) {
                            // Override aggregateId to handle other subscriptions
                            if (registration.rowId) {
                                eventObj.aggregateId = registration.rowId;
                            }
                            const /** @type {?} */ row = conditionalSubscription.stateFunctions.getState(eventObj.aggregateId);
                            const /** @type {?} */ state = row.data;
                            const /** @type {?} */ funcs = {
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
                            const /** @type {?} */ doneCallback = () => {
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
    { type: ScriptService, },
    { type: PushService, },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
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
     * @return {?}
     */
    getPlaybackList(playbackListBaseUrl, playbackListName, startIndex, limit, filters, sort) {
        let /** @type {?} */ url = `${playbackListBaseUrl}/playback-list/${playbackListName}?startIndex=${startIndex}&limit=${limit}`;
        if (filters) {
            url += `&filters=${JSON.stringify(filters)}`;
        }
        if (sort) {
            url += `&sort=${JSON.stringify(sort)}`;
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
        let /** @type {?} */ url = `${playbackListBaseUrl}/playback-list/${playbackListName}/export?startIndex=${startIndex}&limit=${limit}`;
        if (filters) {
            url += `&filters=${JSON.stringify(filters)}`;
        }
        if (sort) {
            url += `&sort=${JSON.stringify(sort)}`;
        }
        if (type) {
            url += `&type=${type}`;
        }
        return this.http.get(url);
    }
}
PlaybackListService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
PlaybackListService.ctorParameters = () => [
    { type: HttpClient, },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class NgEventstoreListingComponent {
    /**
     * @param {?} changeDetectorRef
     * @param {?} scriptService
     * @param {?} playbackService
     * @param {?} playbackListService
     */
    constructor(changeDetectorRef, scriptService, playbackService, playbackListService) {
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
            get: (rowId, callback) => {
                const /** @type {?} */ rowIndex = this._dataList.findIndex((value) => {
                    return value.get('rowId') === rowId;
                });
                if (rowIndex > -1) {
                    const /** @type {?} */ data = this._dataList.get(rowIndex);
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
                // const newEntry = {
                //   rowId: rowId,
                //   revision: revision,
                //   data: data,
                //   meta: meta,
                // };
                // this.dataList = this.dataList.push(Immutable.fromJS(newEntry));
                // this.changeDetectorRef.detectChanges();
                // Do refresh trigger
                const /** @type {?} */ newItem = {
                    rowId,
                    revision,
                    data,
                    meta
                };
                this.newItemNotifyEmitter.emit(newItem);
                callback();
            },
            update: (rowId, revision, oldData, newData, meta, callback) => {
                const /** @type {?} */ rowIndex = this._dataList.findIndex((value) => {
                    return value.get('rowId') === rowId;
                });
                // oldData is Immutable
                const /** @type {?} */ newEntry = fromJS({
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
                const /** @type {?} */ rowIndex = this._dataList.findIndex((value) => {
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
        this._stateFunctions = {
            getState: (id) => {
                const /** @type {?} */ index = this._dataList.findIndex((row) => {
                    return row.get('rowId') === id;
                });
                if (index > 0) {
                    return (/** @type {?} */ (this._dataList.get(index))).toJS();
                }
                return {};
            },
            setState: (id, data) => {
                const /** @type {?} */ index = this._dataList.findIndex((row) => {
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
        const /** @type {?} */ self = this;
        if (!self._initialized) {
            this._initialized = true;
            this._loadScripts().then(() => {
                this._initializeRequests();
                this.playbackService.init(this.socketUrl);
                const /** @type {?} */ changesKeys = Object.keys(changes);
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
            const /** @type {?} */ changesKeys = Object.keys(changes);
            changesKeys.forEach((key) => {
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
        this._getPlaybackListSubscription = this._getPlaybackListSubject
            .pipe(debounceTime(100), switchMap((params) => {
            return this.playbackListService.getPlaybackList(this.playbackListBaseUrl, params.playbackListName, params.startIndex, params.limit, params.filters, params.sort);
        }))
            .subscribe((res) => {
            this._dataList = fromJS(res.rows);
            this._dataCount = res.rows.length;
            this._dataTotalCount = res.count;
            this._resetSubscriptions();
            this._initSubscriptions();
            this.changeDetectorRef.detectChanges();
            this.playbackListLoadedEmitter.emit({
                totalItems: this._dataTotalCount,
                dataCount: this._dataCount,
            });
        });
        this._exportPlaybackListSubscription = this._exportPlaybackListSubject
            .pipe(debounceTime(100), switchMap((params) => {
            return this.playbackListService.getPlaybackListCsv(this.playbackListBaseUrl, params.playbackListName, params.startIndex, params.limit, params.filters, params.sort, params.type);
        }))
            .subscribe((result) => {
            const /** @type {?} */ csv = new Blob([result], { type: 'text/csv' });
            const /** @type {?} */ moment = moment_;
            const /** @type {?} */ now = moment();
            const /** @type {?} */ fileName = `${now.format('YYYY_MM_DD_HH_mm_ss')}_${this.csvFileName || this.playbackListName}.csv`;
            saveAs(csv, fileName);
        });
    }
    /**
     * @param {?} playbackListName
     * @param {?} startIndex
     * @param {?} limit
     * @param {?=} filters
     * @param {?=} sort
     * @return {?}
     */
    _getPlaybackList(playbackListName, startIndex, limit, filters, sort) {
        const /** @type {?} */ playbackListRequestParams = {
            playbackListName: playbackListName,
            startIndex: startIndex,
            limit: limit,
            filters: filters,
            sort: sort,
        };
        this._getPlaybackListSubject.next(playbackListRequestParams);
    }
    /**
     * @return {?}
     */
    requestPlaybackList() {
        const /** @type {?} */ startIndex = this.itemsPerPage * (this.pageIndex - 1);
        this._getPlaybackList(this.playbackListName, startIndex, this.itemsPerPage, this.filters, this.sort);
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
            const /** @type {?} */ self = this;
            // Per row subscriptions
            (self.itemSubscriptionConfigurations || []).forEach((itemSubscriptionConfiguration) => {
                if (itemSubscriptionConfiguration) {
                    self._dataList.forEach((row) => __awaiter(this, void 0, void 0, function* () {
                        const /** @type {?} */ streamRevisionFunction = itemSubscriptionConfiguration.streamRevisionFunction ?
                            itemSubscriptionConfiguration.streamRevisionFunction : () => +row.get('revision') + 1;
                        const /** @type {?} */ aggregateId = itemSubscriptionConfiguration.rowIdFunction ?
                            itemSubscriptionConfiguration.rowIdFunction(row.toJS()) : row.get('rowId');
                        const /** @type {?} */ query = _clone(itemSubscriptionConfiguration.query);
                        query.aggregateId = query.aggregateId.replace(/{{rowId}}/g, aggregateId);
                        const /** @type {?} */ playbackSubscriptionToken = yield self.playbackService.registerForPlayback(self, itemSubscriptionConfiguration.playbackScriptName, query, self._stateFunctions, self._playbackList, streamRevisionFunction, row.get('rowId'), itemSubscriptionConfiguration.condition, itemSubscriptionConfiguration.rowIdFunction);
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
     * @return {?}
     */
    exportCSV(overrideParams) {
        if (overrideParams) {
            this._exportPlaybackListSubject.next(overrideParams);
        }
        else {
            const /** @type {?} */ startIndex = this.itemsPerPage * (this.pageIndex - 1);
            const /** @type {?} */ exportPlaybackListRequestParams = {
                playbackListName: this.playbackListName,
                startIndex: startIndex,
                limit: 1000000,
                filters: this.filters,
                sort: this.sort
            };
            this._exportPlaybackListSubject.next(exportPlaybackListRequestParams);
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

<div class="row" *ngIf="!_dataCount || _dataCount === 0">
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
`,
                styles: [],
                changeDetection: ChangeDetectionStrategy.OnPush,
            },] },
];
/** @nocollapse */
NgEventstoreListingComponent.ctorParameters = () => [
    { type: ChangeDetectorRef, },
    { type: ScriptService, },
    { type: PlaybackService, },
    { type: PlaybackListService, },
];
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
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
    { type: ViewContainerRef, },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
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
        const /** @type {?} */ self = this;
        if (self.componentRef) {
            const /** @type {?} */ changesKeys = Object.keys(changes);
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
        const /** @type {?} */ componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.itemComponentClass);
        const /** @type {?} */ viewContainerRef = this.itemHost.viewContainerRef;
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
    { type: ComponentFactoryResolver, },
];
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
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
 * @suppress {checkTypes} checked by tsc
 */
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
                    SocketIoService
                ]
            },] },
];
/** @nocollapse */
NgEventstoreListingModule.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/** @enum {string} */
const FilterOperator = {
    range: 'range',
    is: 'is',
    any: 'any',
    contains: 'contains',
    endsWith: 'endsWith',
    startsWith: 'startsWith',
    arrayContains: 'arrayContains',
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/** @enum {string} */
const SortDirection = {
    ASC: 'ASC',
    DESC: 'DESC',
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/** @enum {string} */
const GroupBooleanOperator = {
    and: 'and',
    or: 'or',
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
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
            const /** @type {?} */ actionEventEmitterData = {
                propertyName: propertyName,
                id: this.data.get(this.idPropertyName),
                data: actionData,
            };
            this.onUpdateEmitter.emit(actionEventEmitterData);
        };
        this.onGetLookups = (lookupName, callback) => {
            const /** @type {?} */ actionEventEmitterData = {
                lookupName: lookupName,
                callback: callback
            };
            this.onGetLookupsEmitter.emit(actionEventEmitterData);
        };
        this.onShowModal = (modalName, data) => {
            const /** @type {?} */ actionEventEmitterData = {
                modalName: modalName,
                id: this.data.get(this.idPropertyName),
                data: data,
            };
            this.onShowModalEmitter.emit(actionEventEmitterData);
        };
        this.onDelete = (actionData) => {
            const /** @type {?} */ actionEventEmitterData = {
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
        const /** @type {?} */ dataChanges = changes["data"] ? changes["data"].currentValue : null;
        if (dataChanges && !changes["data"].isFirstChange()) {
            const /** @type {?} */ dataObj = (/** @type {?} */ (dataChanges)).toJS();
            this._formGroupKeys.forEach((key) => {
                const /** @type {?} */ newValue = dataObj.data[key];
                const /** @type {?} */ oldValue = this._formGroup.get(key).value;
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
        const /** @type {?} */ formControl = new FormControl(initialValue, validators);
        this._formGroup.addControl(propertyName, formControl);
        this._formGroupKeys.push(propertyName);
        return formControl;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @abstract
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/*
 * Public API Surface of ng-eventstore-listing
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { FilterOperator, SortDirection, GroupBooleanOperator, ItemTemplateComponent, NgEventstoreListingComponent, NgEventstoreListingModule, ItemTemplateHolderComponent as ɵe, TemplateDirective as ɵf, PlaybackListService as ɵd, PlaybackService as ɵb, PushService as ɵc, ScriptService as ɵa, SocketIoService as ɵg };
//# sourceMappingURL=ng-eventstore-listing.js.map
