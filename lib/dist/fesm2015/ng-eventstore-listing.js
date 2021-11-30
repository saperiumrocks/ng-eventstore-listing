import { __awaiter, __decorate, __metadata, __param } from 'tslib';
import { InjectionToken, Injectable, EventEmitter, Output, Input, Component, ChangeDetectionStrategy, Inject, ChangeDetectorRef, Directive, ViewContainerRef, ViewChild, ComponentFactoryResolver, NgModule } from '@angular/core';
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

const Helpers = {
    generateToken: () => {
        return Math.random().toString(36).substr(2, 9) + '-' + Date.now().toString();
    }
};

let JQ_TOKEN = new InjectionToken('jQuery');
function jQueryFactory() {
    return jQuery;
}

let ScriptService = class ScriptService {
    constructor() {
        this.scripts = {};
    }
    init(scriptStore) {
        return __awaiter(this, void 0, void 0, function* () {
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
    load(...scripts) {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = [];
            scripts.forEach((script) => promises.push(this.loadScript(script)));
            return yield Promise.all(promises);
        });
    }
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
                const existingScript = document.querySelectorAll(`head script[src="${this.scripts[name].src}"]`);
                if (existingScript.length === 0) {
                    // load script
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
    getScript(scriptName) {
        return this.scripts[scriptName];
    }
};
ScriptService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], ScriptService);

let PushService = class PushService {
    constructor() {
        this.subscriptions = {};
    }
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
    _processEvent(eventObj) {
        const self = this;
        // console.log('got message from push server: ', eventObj);
        const queryKey = `${eventObj.context}.${eventObj.aggregate}.${eventObj.aggregateId}`;
        const clientTokens = Object.keys(self.subscriptions);
        // redirect to mapped subscription/token callback
        clientTokens.forEach((clientToken) => {
            const sub = self.subscriptions[clientToken];
            if (sub) {
                const subQueryKey = `${sub.query.context}.${sub.query.aggregate}.${sub.query.aggregateId}`;
                if (subQueryKey === queryKey) {
                    // update next offset (from stream revision) for this subscription, so for reconnecting
                    if (!isNaN(eventObj.streamRevision)) {
                        sub.offset = eventObj.streamRevision + 1;
                    }
                    if (typeof sub.cb === 'function') {
                        sub.cb(undefined, eventObj, sub.owner, clientToken);
                    }
                    // iterate on monitors meta tags
                    const tags = Object.keys(sub.monitorTags);
                    tags.forEach((tag) => {
                        // check for state/eventSource._meta or event._meta
                        if (eventObj._meta && eventObj._meta.tag === tag) {
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
                            // iterate on the monitors
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
    subscribe(query, offset, owner, cb) {
        // await this.waitForSocketConnection();
        const pushToken = Helpers.generateToken();
        // map new subscription, then try to subscribe to server asap
        this.subscriptions[pushToken] = {
            query: query,
            offset: offset,
            owner: owner,
            cb: cb,
            monitorTags: {},
        };
        const sub = this.subscriptions[pushToken];
        if (sub && !sub.token) {
            // build up proper subscribe request query
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
    unsubscribe(pushTokens) {
        const socketTokens = [];
        pushTokens.forEach((pushToken) => {
            if (this.subscriptions[pushToken]) {
                const clientSubscription = _clone(this.subscriptions[pushToken]);
                delete this.subscriptions[pushToken];
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
};
PushService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], PushService);

let PlaybackService = class PlaybackService {
    constructor(pushService) {
        this.pushService = pushService;
        this._playbackRegistry = {};
        this._conditionalSubscriptionRegistry = {};
        this._customPlaybackRegistry = {};
    }
    init(socketUrl) {
        this.pushService.init(socketUrl);
    }
    unregisterForPlayback(playbackTokens) {
        return __awaiter(this, void 0, void 0, function* () {
            // unregister from playback registry
            const pushTokens = playbackTokens.map((playbackToken) => {
                return this._playbackRegistry[playbackToken].pushSubscriptionId;
            });
            playbackTokens.forEach((token) => __awaiter(this, void 0, void 0, function* () {
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
    registerForPlayback(owner, scriptName, query, stateFunctions, playbackList, streamRevisionFunction = (item) => 0, rowId, conditionFunction, rowIdFunction) {
        return __awaiter(this, void 0, void 0, function* () {
            const playbackSubscriptionId = Helpers.generateToken();
            let rowData;
            if (rowId) {
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
            let streamRevision;
            let isConditionTrue;
            if (rowData) {
                streamRevision = streamRevisionFunction(rowData);
                isConditionTrue = conditionFunction ? (conditionFunction(rowData) ? true : false) : undefined;
            }
            let pushSubscriptionId;
            if (isConditionTrue === true || conditionFunction === undefined) {
                pushSubscriptionId = yield this.pushService.subscribe(query, streamRevision, this, (err, eventObj, owner2) => __awaiter(this, void 0, void 0, function* () {
                    // owner is playbackservice
                    const self = owner2;
                    // console.log(self._playbackRegistry);
                    const registration = self._playbackRegistry[playbackSubscriptionId];
                    if (registration) {
                        if (eventObj.aggregate === 'states') {
                            const thisScriptName = registration.scriptName;
                            const fromEvent = eventObj.payload._meta.fromEvent;
                            const eventName = fromEvent.payload.name;
                            const thisPlaybackScript = window[thisScriptName];
                            const playbackFunction = thisPlaybackScript.playbackInterface[eventName];
                            if (playbackFunction) {
                                if (registration.rowId) {
                                    eventObj.aggregateId = registration.rowId;
                                }
                                const state = eventObj.payload;
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
                            const thisScriptName = registration.scriptName;
                            const thisPlaybackScript = window[thisScriptName];
                            const playbackFunction = thisPlaybackScript.playbackInterface[eventObj.payload.name];
                            if (playbackFunction) {
                                // Override aggregateId to handle other subscriptions
                                if (registration.rowId) {
                                    eventObj.aggregateId = registration.rowId;
                                }
                                const row = stateFunctions.getState(eventObj.aggregateId);
                                const state = row.data;
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
    registerCustomPlaybacks(customPlaybackConfigurations) {
        customPlaybackConfigurations.forEach((customPlaybackConfiguration) => {
            if (!this._customPlaybackRegistry[customPlaybackConfiguration.eventName]) {
                this._customPlaybackRegistry[customPlaybackConfiguration.eventName] = [];
            }
            this._customPlaybackRegistry[customPlaybackConfiguration.eventName].push(customPlaybackConfiguration);
        });
    }
    resetCustomPlaybacks() {
        this._customPlaybackRegistry = {};
    }
    _updateConditionalSubscriptions(rowId, rowData) {
        const conditionalSubscriptions = this._conditionalSubscriptionRegistry[rowId] || [];
        conditionalSubscriptions.forEach((conditionalSubscription) => __awaiter(this, void 0, void 0, function* () {
            if (!conditionalSubscription.pushSubscriptionId && conditionalSubscription.conditionFunction(rowData)) {
                const offset = conditionalSubscription.streamRevisionFunction(rowData);
                const subQuery = _clone(conditionalSubscription.query);
                if (conditionalSubscription.rowIdFunction) {
                    subQuery.aggregateId = conditionalSubscription.rowIdFunction(rowData);
                }
                const pushSubscriptionId = this.pushService.subscribe(subQuery, offset, this, (err, eventObj, owner2) => __awaiter(this, void 0, void 0, function* () {
                    // owner is playbackservice
                    const self = owner2;
                    const registration = self._playbackRegistry[conditionalSubscription.playbackSubscriptionId];
                    if (eventObj.aggregate === 'states') {
                        const thisScriptName = registration.scriptName;
                        const fromEvent = eventObj.payload._meta.fromEvent;
                        const eventName = fromEvent.payload.name;
                        const thisPlaybackScript = window[thisScriptName];
                        const playbackFunction = thisPlaybackScript.playbackInterface[eventName];
                        if (playbackFunction) {
                            const state = eventObj.payload;
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
                            const doneCallback = () => {
                            };
                            playbackFunction(state, fromEvent, funcs, doneCallback);
                        }
                    }
                    else {
                        const thisScriptName = registration.scriptName;
                        const thisPlaybackScript = window[thisScriptName];
                        const playbackFunction = thisPlaybackScript.playbackInterface[eventObj.payload.name];
                        if (playbackFunction) {
                            // Override aggregateId to handle other subscriptions
                            if (registration.rowId) {
                                eventObj.aggregateId = registration.rowId;
                            }
                            const row = conditionalSubscription.stateFunctions.getState(eventObj.aggregateId);
                            const state = row.data;
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
};
PlaybackService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PushService])
], PlaybackService);

let PlaybackListService = class PlaybackListService {
    constructor(http) {
        this.http = http;
    }
    getPlaybackList(playbackListBaseUrl, playbackListName, startIndex, limit, filters, sort, previousKey, nextKey) {
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
    getPlaybackListCsv(playbackListBaseUrl, playbackListName, startIndex, limit, filters, sort, type) {
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
        return this.http.get(url, { responseType: 'text/csv' });
    }
};
PlaybackListService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [HttpClient])
], PlaybackListService);

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
                this._dataList = this._dataList.set(index, fromJS(data));
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
            const playbackListRequest = params.playbackListRequest;
            return self.playbackListService.getPlaybackListCsv(self.playbackListBaseUrl, playbackListRequest.playbackListName, playbackListRequest.startIndex, playbackListRequest.limit, playbackListRequest.filters, playbackListRequest.sort, playbackListRequest.type).pipe(map((response) => {
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
        else if (this._previousPageIndex) {
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
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], NgEventstoreListingComponent.prototype, "updateEmitter", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], NgEventstoreListingComponent.prototype, "getLookupsEmitter", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], NgEventstoreListingComponent.prototype, "showModalEmitter", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], NgEventstoreListingComponent.prototype, "deleteEmitter", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], NgEventstoreListingComponent.prototype, "playbackListLoadedEmitter", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], NgEventstoreListingComponent.prototype, "newItemNotifyEmitter", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], NgEventstoreListingComponent.prototype, "removedItemNotifyEmitter", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], NgEventstoreListingComponent.prototype, "getPlaybackLIstErrorEmitter", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], NgEventstoreListingComponent.prototype, "itemComponentClass", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], NgEventstoreListingComponent.prototype, "lookups", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], NgEventstoreListingComponent.prototype, "socketUrl", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], NgEventstoreListingComponent.prototype, "playbackListBaseUrl", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], NgEventstoreListingComponent.prototype, "scriptStore", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], NgEventstoreListingComponent.prototype, "itemSubscriptionConfigurations", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], NgEventstoreListingComponent.prototype, "listSubscriptionConfiguration", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], NgEventstoreListingComponent.prototype, "playbackListName", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], NgEventstoreListingComponent.prototype, "filters", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], NgEventstoreListingComponent.prototype, "sort", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], NgEventstoreListingComponent.prototype, "pageIndex", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], NgEventstoreListingComponent.prototype, "itemsPerPage", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], NgEventstoreListingComponent.prototype, "responseBasePath", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], NgEventstoreListingComponent.prototype, "emptyListDisplayText", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], NgEventstoreListingComponent.prototype, "csvFileName", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], NgEventstoreListingComponent.prototype, "customPlaybackConfigurations", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], NgEventstoreListingComponent.prototype, "enableLoadingOverlay", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], NgEventstoreListingComponent.prototype, "loadingTopBoundSelector", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], NgEventstoreListingComponent.prototype, "minHeightCss", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], NgEventstoreListingComponent.prototype, "loadingOffset", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], NgEventstoreListingComponent.prototype, "debugging", void 0);
NgEventstoreListingComponent = __decorate([
    Component({
        selector: 'lib-ng-eventstore-listing',
        template: "<!-- <div *ngIf=\"listHeaderGroups && listHeaderGroups.groups && listHeaderGroups.groups.length > 0\"  [class]=\"'row ' + (listHeaderGroups && listHeaderGroups.generalRowClassName ? listHeaderGroups.generalRowClassName : '')\">\n  <div class=\"col-12\">\n    <div class=\"header bg-white p-2\">\n      <div [class]=\"'row ' + listHeaderGroups.generalRowClassName\">\n        <div *ngFor=\"let listHeaderGroup of listHeaderGroups.groups\" [class]=\"listHeaderGroup.className\">\n          <div [class]=\"'row ' + listHeaderGroups.generalRowClassName\">\n            <div *ngFor=\"let listHeader of listHeaderGroup.listHeaders\" [class]=\"listHeader.className\">\n              <span (click)=\"onSort(listHeader.sortProperty)\" [ngClass]=\"{ 'sort-header': listHeader.sortProperty }\">{{ listHeader.displayName }} <i *ngIf=\"sortFields[listHeader.sortProperty] && sortFields[listHeader.sortProperty].icon\" [class]=\"'sort-icon ' + sortFields[listHeader.sortProperty].icon\"></i></span>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div> -->\n<!-- <div [class]=\"'row ' + (listHeaderGroups && listHeaderGroups.generalRowClassName) ? listHeaderGroups.generalRowClassName : ''\" *ngFor=\"let item of dataList; trackBy: trackByFn\"> -->\n<div class=\"row\" *ngFor=\"let item of _dataList; trackBy: trackByFn\">\n  <div class=\"col-12\">\n    <lib-item-template-holder\n      [data]=\"item\"\n      [itemComponentClass]=\"itemComponentClass\"\n      [lookups]=\"lookups\"\n      (updateEmitter)=\"_onUpdate($event)\"\n      (getLookupsEmitter)=\"_onGetLookups($event)\"\n      (showModalEmitter)=\"_onShowModal($event)\"\n      (deleteEmitter)=\"_onDelete($event)\">\n    </lib-item-template-holder>\n  </div>\n</div>\n<div class=\"row\" *ngIf=\"(!_dataCount || _dataCount === 0) && !_isLoading\">\n  <div class=\"col-12\">\n    <div class=\"row\">\n      <div class=\"col-12 no-results-container\">\n        <div class=\"text-center text-secondary\">\n          <span class=\"italic\">{{ emptyListDisplayText }}</span>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n\n<div [id]=\"'ng-eventstore-listing-overlay-' + _id\" class=\"ng-eventstore-listing-overlay\">\n  <div [id]=\"'ng-eventstore-listing-overlay-subject-' + _id\" class=\"ng-eventstore-listing-overlay-subject\" [ngStyle]=\"{ top:  loadingOffset }\">\n      <div class=\"ng-eventstore-listing-cssload-container\">\n        <div class=\"ng-eventstore-listing-cssload-speeding-wheel\"></div>\n      </div>\n  </div>\n</div>\n",
        changeDetection: ChangeDetectionStrategy.OnPush,
        styles: [".ng-eventstore-listing-overlay{position:absolute;width:100%;height:100%;top:0;left:0;right:0;bottom:0;background-color:#efefef;opacity:.7;z-index:10;display:none}.ng-eventstore-listing-overlay-subject{position:absolute;left:50%;font-size:50px;color:transparent;transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);text-align:center}.ng-eventstore-listing-cssload-container{width:100%;height:49px;text-align:center}.ng-eventstore-listing-cssload-speeding-wheel{width:49px;height:49px;margin:0 auto;border:3px solid #3b356e;border-radius:50%;border-left-color:transparent;border-right-color:transparent;animation:475ms linear infinite cssload-spin;-o-animation:475ms linear infinite cssload-spin;-ms-animation:cssload-spin 475ms infinite linear;-webkit-animation:475ms linear infinite cssload-spin;-moz-animation:475ms linear infinite cssload-spin}@keyframes cssload-spin{100%{transform:rotate(360deg)}}@-webkit-keyframes cssload-spin{100%{transform:rotate(360deg)}}"]
    }),
    __param(0, Inject(JQ_TOKEN)),
    __metadata("design:paramtypes", [Object, ChangeDetectorRef,
        ScriptService,
        PlaybackService,
        PlaybackListService])
], NgEventstoreListingComponent);

let TemplateDirective = class TemplateDirective {
    constructor(viewContainerRef) {
        this.viewContainerRef = viewContainerRef;
    }
};
TemplateDirective = __decorate([
    Directive({
        selector: '[libTemplateDirective]'
    }),
    __metadata("design:paramtypes", [ViewContainerRef])
], TemplateDirective);

let ItemTemplateHolderComponent = class ItemTemplateHolderComponent {
    constructor(componentFactoryResolver) {
        this.componentFactoryResolver = componentFactoryResolver;
        this.data = {};
        this.lookups = {};
        this.updateEmitter = new EventEmitter();
        this.getLookupsEmitter = new EventEmitter();
        this.showModalEmitter = new EventEmitter();
        this.deleteEmitter = new EventEmitter();
    }
    ngOnInit() {
        // this.loadComponent();
    }
    ngAfterViewInit() {
        this.loadComponent();
        if (this.initialChanges) {
            this.ngOnChanges(this.initialChanges);
            this.initialChanges = undefined;
        }
    }
    ngOnChanges(changes) {
        const self = this;
        if (self.componentRef) {
            const changesKeys = Object.keys(changes);
            changesKeys.forEach((key) => {
                self.componentRef.instance[key] =
                    changes[key].currentValue;
            });
            self.componentRef.instance.ngOnChanges(changes);
        }
        else {
            this.initialChanges = changes;
        }
    }
    loadComponent() {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.itemComponentClass);
        const viewContainerRef = this.itemHost.viewContainerRef;
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
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], ItemTemplateHolderComponent.prototype, "itemComponentClass", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ItemTemplateHolderComponent.prototype, "data", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ItemTemplateHolderComponent.prototype, "lookups", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], ItemTemplateHolderComponent.prototype, "updateEmitter", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], ItemTemplateHolderComponent.prototype, "getLookupsEmitter", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], ItemTemplateHolderComponent.prototype, "showModalEmitter", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], ItemTemplateHolderComponent.prototype, "deleteEmitter", void 0);
__decorate([
    ViewChild(TemplateDirective),
    __metadata("design:type", TemplateDirective)
], ItemTemplateHolderComponent.prototype, "itemHost", void 0);
ItemTemplateHolderComponent = __decorate([
    Component({
        selector: 'lib-item-template-holder',
        template: "<div class=\"row no-gutters\">\n  <div class=\"col-12\">\n    <ng-template libTemplateDirective></ng-template>\n  </div>\n</div>\n",
        changeDetection: ChangeDetectionStrategy.OnPush,
        styles: [""]
    }),
    __metadata("design:paramtypes", [ComponentFactoryResolver])
], ItemTemplateHolderComponent);

let SocketIoService = class SocketIoService {
    // sockets = {};
    constructor() { }
    getSocketInstance(socketUrl) {
        return connect(`${socketUrl}/events`);
        //   if (!this.sockets[socketUrl]) {
        //     this.sockets[socketUrl] = io.connect(`${socketUrl}/events`);
        //   }
        //   return this.sockets[socketUrl];
    }
};
SocketIoService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], SocketIoService);

const ɵ0 = jQueryFactory;
let NgEventstoreListingModule = class NgEventstoreListingModule {
};
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
            { provide: JQ_TOKEN, useFactory: ɵ0 }
            // ,
            // { provide: IO_TOKEN, useValue: io }
        ]
    })
], NgEventstoreListingModule);

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

class ItemTemplateComponent {
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
            const actionEventEmitterData = {
                propertyName: propertyName,
                id: this.data.get(this.idPropertyName),
                data: actionData,
            };
            this.onUpdateEmitter.emit(actionEventEmitterData);
        };
        this.onGetLookups = (lookupName, callback) => {
            const actionEventEmitterData = {
                lookupName: lookupName,
                callback: callback
            };
            this.onGetLookupsEmitter.emit(actionEventEmitterData);
        };
        this.onShowModal = (modalName, data) => {
            const actionEventEmitterData = {
                modalName: modalName,
                id: this.data.get(this.idPropertyName),
                data: data,
            };
            this.onShowModalEmitter.emit(actionEventEmitterData);
        };
        this.onDelete = (actionData) => {
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
    ngOnInit() { }
    ngOnChanges(changes) {
        if (this._changeFn) {
            this._changeFn(changes);
        }
        const dataChanges = changes.data ? changes.data.currentValue : null;
        if (dataChanges && !changes.data.isFirstChange()) {
            const dataObj = dataChanges.toJS();
            this._formGroupKeys.forEach((key) => {
                const newValue = dataObj.data[key];
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
    createFormControl(propertyName, initialValue, validators) {
        const formControl = new FormControl(initialValue, validators);
        this._formGroup.addControl(propertyName, formControl);
        this._formGroupKeys.push(propertyName);
        return formControl;
    }
}

export { FilterOperator, GroupBooleanOperator, ItemTemplateComponent, NgEventstoreListingComponent, NgEventstoreListingModule, SortDirection, ɵ0, JQ_TOKEN as ɵa, jQueryFactory as ɵb, ScriptService as ɵc, PlaybackService as ɵd, PushService as ɵe, PlaybackListService as ɵf, ItemTemplateHolderComponent as ɵg, TemplateDirective as ɵh, SocketIoService as ɵi };
//# sourceMappingURL=ng-eventstore-listing.js.map
