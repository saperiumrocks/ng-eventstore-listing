import { Injectable, InjectionToken, Inject, NgZone, Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, Directive, ViewContainerRef, ViewChild, ComponentFactoryResolver, NgModule } from '@angular/core';
import { __awaiter } from 'tslib';
import { HttpClient } from '@angular/common/http';
import { switchMap, debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { fromJS } from 'immutable';
import _clone from 'lodash-es/clone';
import * as moment_ from 'moment-mini-ts';
import saveAs from 'file-saver';
import { CommonModule } from '@angular/common';
import * as io from 'socket.io-client';

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
        return Promise.all(promises);
    }
    /**
     * @param {...?} scripts
     * @return {?}
     */
    load(...scripts) {
        const /** @type {?} */ promises = [];
        scripts.forEach((script) => promises.push(this.loadScript(script)));
        return Promise.all(promises);
    }
    /**
     * @param {?} name
     * @return {?}
     */
    loadScript(name) {
        return new Promise((resolve, reject) => {
            // resolve if already loaded
            if (this.scripts[name].loaded) {
                resolve({
                    script: name,
                    loaded: true,
                    status: 'Already Loaded',
                    meta: this.scripts[name].meta,
                });
            }
            else {
                // load script
                const /** @type {?} */ script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = this.scripts[name].src;
                if (script.readyState) {
                    // IE
                    script.onreadystatechange = () => {
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
                script.onerror = (error) => resolve({
                    script: name,
                    loaded: false,
                    status: 'Loaded',
                    meta: this.scripts[name].meta,
                });
                document.getElementsByTagName('head')[0].appendChild(script);
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
let IO_TOKEN = new InjectionToken('io');

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class PushService {
    /**
     * @param {?} io
     * @param {?} ngZone
     */
    constructor(io$$1, ngZone) {
        this.io = io$$1;
        this.ngZone = ngZone;
        this.subscriptions = {};
    }
    /**
     * @param {?} socketUrl
     * @return {?}
     */
    init(socketUrl) {
        this.ioPush = this.io(`${socketUrl}/events`);
        const /** @type {?} */ self = this;
        this.ioPush.on('message', (eventObj, token) => {
            console.log('got message from push server: ', eventObj, token);
            const /** @type {?} */ clientTokens = Object.keys(self.subscriptions);
            // redirect to mapped subscription/token callback
            clientTokens.forEach((clientToken) => {
                const /** @type {?} */ sub = self.subscriptions[clientToken];
                if (sub.token === token) {
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
            });
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
        return __awaiter(this, void 0, void 0, function* () {
            // await this.waitForSocketConnection();
            const /** @type {?} */ clientToken = Math.random().toString(36).substr(2, 9) + '-' + Date.now().toString();
            // map new subscription, then try to subscribe to server asap
            this.subscriptions[clientToken] = {
                query: query,
                offset: offset,
                owner: owner,
                cb: cb,
                monitorTags: {},
            };
            const /** @type {?} */ sub = this.subscriptions[clientToken];
            if (sub && !sub.token) {
                // build up proper subscribe request query
                const /** @type {?} */ subscriptionQuery = Object.assign(sub.query, {
                    offset: sub.offset,
                });
                this.ioPush.emit('subscribe', subscriptionQuery, (token) => {
                    if (token) {
                        console.log('Server Subscribed:', token, subscriptionQuery);
                        sub.token = token;
                    }
                    else {
                        console.error('Subscribe error for query', subscriptionQuery);
                    }
                });
            }
            return clientToken;
        });
    }
    /**
     * @param {?} clientToken
     * @return {?}
     */
    unsubscribe(clientToken) {
        return new Promise((resolve, reject) => {
            try {
                // just do a force server unsubscribe and removal of subscription entry
                const /** @type {?} */ sub = this.subscriptions[clientToken];
                if (sub) {
                    if (sub.token && this.ioPush.connected) {
                        //  NOTE: need to handle unsubscribe/emit errors
                        this.ioPush.emit('unsubscribe', sub.token, () => {
                            resolve();
                        });
                    }
                    delete this.subscriptions[clientToken];
                    resolve();
                    // console.log('Unsubscribed:', clientToken, subscriptions);
                }
                // no subscription
                resolve();
            }
            catch (/** @type {?} */ error) {
                reject(error);
                console.error('error in unsubscribing: ', error);
            }
        });
    }
}
PushService.decorators = [
    { type: Injectable },
];
// async waitForSocketConnection(): Promise<any> {
//   return new Promise((resolve, reject) => {
//     let timeout;
//     this.ngZone.runOutsideAngular(() => {
//       timeout = setTimeout(() => {
//         this.ngZone.run(() => {
//           console.error('IO Connectioned timedout');
//           reject();
//         });
//       }, 10000)
//     })
//     while(!this.ioPush.connected) {
//       console.log(this.ioPush);
//     }
//     clearTimeout(timeout);
//     return resolve();
//   })
// }
// monitorMeta(clientToken, tag, timeout, cb) {
//   const self = this;
//   const sub = self.subscriptions[clientToken];
//   if (sub && typeof tag === 'string' && typeof cb === 'function') {
//     const monitorToken =
//       Math.random().toString(36).substr(2, 9) + '-' + Date.now().toString();
//     // setup monitor token/filter/callback mapping
//     if (!sub.monitorTags[tag]) { sub.monitorTags[tag] = []; }
//     sub.monitorTags[tag].push({
//       token: monitorToken,
//       callback: cb,
//     });
//     setTimeout(() => {
//       const sub = self.subscriptions[clientToken];
//       if (sub && Array.isArray(sub.monitorTags[tag])) {
//         const idx = sub.monitorTags[tag].findIndex(
//           (x) => x.token === monitorToken
//         );
//         if (idx != -1) { sub.monitorTags[tag].splice(idx, 1); }
//         if (sub.monitorTags[tag].length <= 0) { delete sub.monitorTags[tag]; }
//         // console.log('TAGS:', clientToken, sub.monitorTags);
//       }
//     }, timeout);
//   }
// }
/** @nocollapse */
PushService.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [IO_TOKEN,] },] },
    { type: NgZone, },
];

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
        this.playbackRegistry = {};
    }
    /**
     * @param {?} socketUrl
     * @return {?}
     */
    init(socketUrl) {
        this.pushService.init(socketUrl);
    }
    /**
     * @param {?} token
     * @return {?}
     */
    unRegisterForPlayback(token) {
        return __awaiter(this, void 0, void 0, function* () {
            // unsubscribe from push
            yield this.pushService.unsubscribe(token);
            // unregister from playback registry
            delete this.playbackRegistry[token];
        });
    }
    /**
     * @param {?} scriptName
     * @param {?} owner
     * @param {?} query
     * @param {?} stateFunctions
     * @param {?=} offset
     * @param {?=} playbackList
     * @return {?}
     */
    registerForPlayback(scriptName, owner, query, stateFunctions, offset, playbackList) {
        return __awaiter(this, void 0, void 0, function* () {
            const /** @type {?} */ script = yield this.scriptService.getScript(scriptName);
            const /** @type {?} */ playbackScript = window[script.meta.objectName];
            const /** @type {?} */ subscriptionId = yield this.pushService.subscribe(query, offset, this, (err, eventObj, owner2, token) => {
                // owner is playbackservice
                const /** @type {?} */ self = /** @type {?} */ (owner2);
                const /** @type {?} */ registration = self.playbackRegistry[token];
                // call the function
                // const playbackList = self.createPlaybacklist(registration)
                // if (typeof eventObj.stateType !== 'undefined' && eventObj.eventSource)
                //   eventObj = eventObj.eventSource;
                if (eventObj.context === 'states') {
                    //
                }
                else {
                    const /** @type {?} */ playbackFunction = registration.playbackScript.playbackInterface[eventObj.payload.name];
                    if (playbackFunction) {
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
                            // stateFunctions.setState(row.rowId, row);
                        };
                        playbackFunction(state, eventObj, funcs, doneCallback);
                    }
                }
            });
            // just use the subscriptionId to map the push subscription to the playback
            this.playbackRegistry[subscriptionId] = {
                playbackScript: playbackScript,
                owner: owner,
                registrationId: subscriptionId,
                playbackList: playbackList,
            };
            console.log('subscribed to playback: ', subscriptionId, query);
            return subscriptionId;
        });
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
     * @return {?}
     */
    getPlaybackListCsv(playbackListBaseUrl, playbackListName, startIndex, limit, filters, sort) {
        let /** @type {?} */ url = `${playbackListBaseUrl}/playback-list/${playbackListName}/export?startIndex=${startIndex}&limit=${limit}`;
        if (filters) {
            url += `&filters=${JSON.stringify(filters)}`;
        }
        if (sort) {
            url += `&sort=${JSON.stringify(sort)}`;
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
        this.updateLookupsEmitter = new EventEmitter();
        this.showModalEmitter = new EventEmitter();
        this.deleteEmitter = new EventEmitter();
        this.playbackListLoadedEmitter = new EventEmitter();
        this.newItemNotifyEmitter = new EventEmitter();
        this.lookups = {};
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
        this._subscriptionTokens = [];
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
                    this._dataList = this._dataList.remove(rowIndex);
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
                return (/** @type {?} */ (this._dataList.get(index))).toJS();
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
            this._initializeRequests();
            this._loadScripts();
            this.playbackService.init(this.socketUrl);
            this._initialized = true;
        }
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
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._resetSubscriptions();
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
            return this.playbackListService.getPlaybackListCsv(this.playbackListBaseUrl, params.playbackListName, params.startIndex, params.limit, params.filters, params.sort);
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
    getPlaybackList(playbackListName, startIndex, limit, filters, sort) {
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
        this.getPlaybackList(this.playbackListName, startIndex, this.itemsPerPage, this.filters, this.sort);
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
            self._dataList.forEach((row) => __awaiter(this, void 0, void 0, function* () {
                const /** @type {?} */ query = _clone(self.itemSubscriptionConfiguration.query);
                query.aggregateId = query.aggregateId.replace(/{{rowId}}/g, row.get('rowId'));
                this._subscriptionTokens.push(yield self.playbackService.registerForPlayback(self.itemSubscriptionConfiguration.playbackScriptName, self, query, self._stateFunctions, row.get('revision') + 1, self._playbackList));
            }));
            // List subscription
            this._subscriptionTokens.push(yield self.playbackService.registerForPlayback(self.listSubscriptionConfiguration.playbackScriptName, self, self.listSubscriptionConfiguration.query, self._stateFunctions, 0, self._playbackList));
        });
    }
    /**
     * @return {?}
     */
    _resetSubscriptions() {
        this._subscriptionTokens.forEach((subscriptionToken) => {
            this.playbackService.unRegisterForPlayback(subscriptionToken);
        });
        this._subscriptionTokens = [];
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
    _onUpdateLookups(payload) {
        this.updateLookupsEmitter.emit(payload);
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
     * @return {?}
     */
    exportCSV() {
        const /** @type {?} */ startIndex = this.itemsPerPage * (this.pageIndex - 1);
        const /** @type {?} */ exportPlaybackListRequestParams = {
            playbackListName: this.playbackListName,
            startIndex: startIndex,
            limit: 1000000,
            filters: this.filters,
            sort: this.sort,
        };
        this._exportPlaybackListSubject.next(exportPlaybackListRequestParams);
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
      (updateLookupsEmitter)="_onUpdateLookups($event)"
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
    "updateLookupsEmitter": [{ type: Output },],
    "showModalEmitter": [{ type: Output },],
    "deleteEmitter": [{ type: Output },],
    "playbackListLoadedEmitter": [{ type: Output },],
    "newItemNotifyEmitter": [{ type: Output },],
    "itemComponentClass": [{ type: Input },],
    "lookups": [{ type: Input },],
    "socketUrl": [{ type: Input },],
    "playbackListBaseUrl": [{ type: Input },],
    "scriptStore": [{ type: Input },],
    "itemSubscriptionConfiguration": [{ type: Input },],
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
        this.updateLookupsEmitter = new EventEmitter();
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
            .instance)).onUpdateLookupsEmitter = this.updateLookupsEmitter;
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
    "updateLookupsEmitter": [{ type: Output },],
    "showModalEmitter": [{ type: Output },],
    "deleteEmitter": [{ type: Output },],
    "itemHost": [{ type: ViewChild, args: [TemplateDirective,] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
const ɵ0 = io;
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
                    { provide: IO_TOKEN, useValue: ɵ0 }
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
        this.onUpdateLookupsEmitter = new EventEmitter();
        this.onShowModalEmitter = new EventEmitter();
        this.onDeleteEmitter = new EventEmitter();
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
        this.onUpdateLookups = (lookup) => {
            const /** @type {?} */ actionEventEmitterData = {
                lookup: lookup,
            };
            this.onUpdateLookupsEmitter.emit(actionEventEmitterData);
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
        if (this.changeDetectorRef) {
            this.changeDetectorRef.detectChanges();
        }
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

export { FilterOperator, SortDirection, GroupBooleanOperator, ItemTemplateComponent, NgEventstoreListingComponent, NgEventstoreListingModule, ItemTemplateHolderComponent as ɵf, TemplateDirective as ɵg, PlaybackListService as ɵe, PlaybackService as ɵb, PushService as ɵc, ScriptService as ɵa, IO_TOKEN as ɵd };
//# sourceMappingURL=ng-eventstore-listing.js.map
