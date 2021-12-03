import * as tslib_1 from "tslib";
import _clone from 'lodash-es/clone';
import { Helpers } from './../utils/helpers';
import { Injectable } from '@angular/core';
import { PushService } from './push.service';
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // unregister from playback registry
            const pushTokens = playbackTokens.map((playbackToken) => {
                return this._playbackRegistry[playbackToken].pushSubscriptionId;
            });
            playbackTokens.forEach((token) => tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
                pushSubscriptionId = yield this.pushService.subscribe(query, streamRevision, this, (err, eventObj, owner2) => tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        conditionalSubscriptions.forEach((conditionalSubscription) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!conditionalSubscription.pushSubscriptionId && conditionalSubscription.conditionFunction(rowData)) {
                const offset = conditionalSubscription.streamRevisionFunction(rowData);
                const subQuery = _clone(conditionalSubscription.query);
                if (conditionalSubscription.rowIdFunction) {
                    subQuery.aggregateId = conditionalSubscription.rowIdFunction(rowData);
                }
                const pushSubscriptionId = this.pushService.subscribe(subQuery, offset, this, (err, eventObj, owner2) => tslib_1.__awaiter(this, void 0, void 0, function* () {
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
PlaybackService.ctorParameters = () => [
    { type: PushService }
];
PlaybackService = tslib_1.__decorate([
    Injectable()
], PlaybackService);
export { PlaybackService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheWJhY2suc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25nLWV2ZW50c3RvcmUtbGlzdGluZy8iLCJzb3VyY2VzIjpbInNlcnZpY2VzL3BsYXliYWNrLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sTUFBTSxNQUFNLGlCQUFpQixDQUFDO0FBQ3JDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUM3QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQVk3QyxJQUFhLGVBQWUsR0FBNUIsTUFBYSxlQUFlO0lBSzFCLFlBQ1UsV0FBd0I7UUFBeEIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFMbEMsc0JBQWlCLEdBQXFCLEVBQUUsQ0FBQztRQUN6QyxxQ0FBZ0MsR0FBb0MsRUFBRSxDQUFDO1FBQ3ZFLDRCQUF1QixHQUEyQixFQUFFLENBQUM7SUFJbEQsQ0FBQztJQUVKLElBQUksQ0FBQyxTQUFpQjtRQUNwQixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRUsscUJBQXFCLENBQUMsY0FBd0I7O1lBQ2xELG9DQUFvQztZQUNwQyxNQUFNLFVBQVUsR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsYUFBYSxFQUFFLEVBQUU7Z0JBQ3RELE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLGFBQWEsQ0FBQyxDQUFDLGtCQUFrQixDQUFDO1lBQ2xFLENBQUMsQ0FBQyxDQUFDO1lBRUgsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFPLEtBQUssRUFBRSxFQUFFO2dCQUNyQyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDO2dCQUVsRCx5QkFBeUI7Z0JBQ3pCLHNEQUFzRDtnQkFFdEQsSUFB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QXVCLENBQUMsWUFBWTtvQkFDbEQsVUFBVSxFQUFFLHVCQUF1QixDQUFDLFVBQVU7b0JBQzlDLEtBQUssRUFBRSxLQUFLO2lCQUNiLENBQUM7Z0JBRUYsdUJBQXVCLENBQUMsa0JBQWtCLEdBQUcsa0JBQWtCLENBQUM7Z0JBRWhFLDhGQUE4RjtnQkFDOUYsT0FBTyxrQkFBa0IsQ0FBQzthQUMzQjtpQkFBTSxJQUFJLENBQUMsdUJBQXVCLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLElBQUksdUJBQXVCLENBQUMsa0JBQWtCLEVBQUU7Z0JBQzVHLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUMsdUJBQXVCLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7b0JBQ25GLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLHVCQUF1QixDQUFDLHNCQUFzQixDQUFDLENBQUM7b0JBQzlFLHVCQUF1QixDQUFDLGtCQUFrQixHQUFHLFNBQVMsQ0FBQztnQkFDekQsQ0FBQyxDQUFDLENBQUM7YUFDSjtRQUNILENBQUMsQ0FBQSxDQUFDLENBQUM7SUFDTCxDQUFDO0NBRUYsQ0FBQTs7WUF4V3dCLFdBQVc7O0FBTnZCLGVBQWU7SUFEM0IsVUFBVSxFQUFFO0dBQ0EsZUFBZSxDQThXM0I7U0E5V1ksZUFBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfY2xvbmUgZnJvbSAnbG9kYXNoLWVzL2Nsb25lJztcbmltcG9ydCB7IEhlbHBlcnMgfSBmcm9tICcuLy4uL3V0aWxzL2hlbHBlcnMnO1xuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUHVzaFNlcnZpY2UgfSBmcm9tICcuL3B1c2guc2VydmljZSc7XG5pbXBvcnQge1xuICBTdGF0ZUZ1bmN0aW9ucyxcbiAgUGxheWJhY2tMaXN0LFxuICBQbGF5YmFja1JlZ2lzdHJ5LFxuICBRdWVyeSxcbiAgQ29uZGl0aW9uYWxTdWJzY3JpcHRpb25SZWdpc3RyeSxcbiAgQ3VzdG9tUGxheWJhY2tDb25maWd1cmF0aW9uXG59IGZyb20gJy4uL21vZGVscyc7XG5pbXBvcnQgeyBDdXN0b21QbGF5YmFja1JlZ2lzdHJ5IH0gZnJvbSAnLi4vbW9kZWxzL2N1c3RvbS1wbGF5YmFjay1yZWdpc3RyeSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBQbGF5YmFja1NlcnZpY2Uge1xuICBfcGxheWJhY2tSZWdpc3RyeTogUGxheWJhY2tSZWdpc3RyeSA9IHt9O1xuICBfY29uZGl0aW9uYWxTdWJzY3JpcHRpb25SZWdpc3RyeTogQ29uZGl0aW9uYWxTdWJzY3JpcHRpb25SZWdpc3RyeSA9IHt9O1xuICBfY3VzdG9tUGxheWJhY2tSZWdpc3RyeTogQ3VzdG9tUGxheWJhY2tSZWdpc3RyeSA9IHt9O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcHVzaFNlcnZpY2U6IFB1c2hTZXJ2aWNlXG4gICkge31cblxuICBpbml0KHNvY2tldFVybDogc3RyaW5nKSB7XG4gICAgdGhpcy5wdXNoU2VydmljZS5pbml0KHNvY2tldFVybCk7XG4gIH1cblxuICBhc3luYyB1bnJlZ2lzdGVyRm9yUGxheWJhY2socGxheWJhY2tUb2tlbnM6IHN0cmluZ1tdKSB7XG4gICAgLy8gdW5yZWdpc3RlciBmcm9tIHBsYXliYWNrIHJlZ2lzdHJ5XG4gICAgY29uc3QgcHVzaFRva2VucyA9IHBsYXliYWNrVG9rZW5zLm1hcCgocGxheWJhY2tUb2tlbikgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuX3BsYXliYWNrUmVnaXN0cnlbcGxheWJhY2tUb2tlbl0ucHVzaFN1YnNjcmlwdGlvbklkO1xuICAgIH0pO1xuXG4gICAgcGxheWJhY2tUb2tlbnMuZm9yRWFjaChhc3luYyAodG9rZW4pID0+IHtcbiAgICAgIGNvbnN0IHJvd0lkID0gdGhpcy5fcGxheWJhY2tSZWdpc3RyeVt0b2tlbl0ucm93SWQ7XG5cbiAgICAgIC8vIGNvbnNvbGUubG9nKCdCRUZPUkUnKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuX2NvbmRpdGlvbmFsU3Vic2NyaXB0aW9uUmVnaXN0cnkpO1xuXG4gICAgICBpZiAocm93SWQpIHtcbiAgICAgICAgZGVsZXRlIHRoaXMuX2NvbmRpdGlvbmFsU3Vic2NyaXB0aW9uUmVnaXN0cnlbcm93SWRdO1xuICAgICAgfVxuXG4gICAgICAvLyBjb25zb2xlLmxvZygnQUZURVInKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuX2NvbmRpdGlvbmFsU3Vic2NyaXB0aW9uUmVnaXN0cnkpO1xuXG4gICAgICAvLyB1bnN1YnNjcmliZSBmcm9tIHB1c2hcbiAgICAgIGRlbGV0ZSB0aGlzLl9wbGF5YmFja1JlZ2lzdHJ5W3Rva2VuXTtcbiAgICB9KTtcblxuICAgIGF3YWl0IHRoaXMucHVzaFNlcnZpY2UudW5zdWJzY3JpYmUocHVzaFRva2Vucyk7XG4gIH1cblxuICBhc3luYyByZWdpc3RlckZvclBsYXliYWNrKFxuICAgIG93bmVyOiBvYmplY3QsXG4gICAgc2NyaXB0TmFtZTogc3RyaW5nLFxuICAgIHF1ZXJ5OiBRdWVyeSxcbiAgICBzdGF0ZUZ1bmN0aW9uczogU3RhdGVGdW5jdGlvbnMsXG4gICAgcGxheWJhY2tMaXN0OiBQbGF5YmFja0xpc3QsXG4gICAgc3RyZWFtUmV2aXNpb25GdW5jdGlvbjogKGl0ZW06IGFueSkgPT4gbnVtYmVyID0gKGl0ZW0pID0+IDAsXG4gICAgcm93SWQ/OiBzdHJpbmcsXG4gICAgY29uZGl0aW9uRnVuY3Rpb24/OiAoaXRlbTogYW55KSA9PiBib29sZWFuLFxuICAgIHJvd0lkRnVuY3Rpb24/OiAoaXRlbTogYW55KSA9PiBzdHJpbmdcbiAgKSB7XG4gICAgY29uc3QgcGxheWJhY2tTdWJzY3JpcHRpb25JZCA9IEhlbHBlcnMuZ2VuZXJhdGVUb2tlbigpO1xuXG4gICAgbGV0IHJvd0RhdGE7XG4gICAgaWYgKHJvd0lkKSB7XG4gICAgICBjb25zdCBhZ2dyZWdhdGVJZCA9IHJvd0lkID8gcm93SWQgOiBxdWVyeS5hZ2dyZWdhdGVJZDtcbiAgICAgIHJvd0RhdGEgPSBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHBsYXliYWNrTGlzdC5nZXQoYWdncmVnYXRlSWQsIChlcnJvciwgaXRlbSkgPT4ge1xuICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzb2x2ZShpdGVtKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBsZXQgc3RyZWFtUmV2aXNpb247XG4gICAgbGV0IGlzQ29uZGl0aW9uVHJ1ZTtcblxuICAgIGlmIChyb3dEYXRhKSB7XG4gICAgICBzdHJlYW1SZXZpc2lvbiA9IHN0cmVhbVJldmlzaW9uRnVuY3Rpb24ocm93RGF0YSk7XG4gICAgICBpc0NvbmRpdGlvblRydWUgPSBjb25kaXRpb25GdW5jdGlvbiA/IChjb25kaXRpb25GdW5jdGlvbihyb3dEYXRhKSA/IHRydWUgOiBmYWxzZSkgOiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgbGV0IHB1c2hTdWJzY3JpcHRpb25JZDtcbiAgICBpZiAoaXNDb25kaXRpb25UcnVlID09PSB0cnVlIHx8IGNvbmRpdGlvbkZ1bmN0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHB1c2hTdWJzY3JpcHRpb25JZCA9IGF3YWl0IHRoaXMucHVzaFNlcnZpY2Uuc3Vic2NyaWJlKFxuICAgICAgICBxdWVyeSxcbiAgICAgICAgc3RyZWFtUmV2aXNpb24sXG4gICAgICAgIHRoaXMsXG4gICAgICAgIGFzeW5jIChlcnIsIGV2ZW50T2JqLCBvd25lcjIpID0+IHtcbiAgICAgICAgICAvLyBvd25lciBpcyBwbGF5YmFja3NlcnZpY2VcbiAgICAgICAgICBjb25zdCBzZWxmID0gb3duZXIyIGFzIFBsYXliYWNrU2VydmljZTtcblxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHNlbGYuX3BsYXliYWNrUmVnaXN0cnkpO1xuXG4gICAgICAgICAgY29uc3QgcmVnaXN0cmF0aW9uID0gc2VsZi5fcGxheWJhY2tSZWdpc3RyeVtwbGF5YmFja1N1YnNjcmlwdGlvbklkXTtcblxuICAgICAgICAgIGlmIChyZWdpc3RyYXRpb24pIHtcbiAgICAgICAgICAgIGlmIChldmVudE9iai5hZ2dyZWdhdGUgPT09ICdzdGF0ZXMnKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHRoaXNTY3JpcHROYW1lID0gcmVnaXN0cmF0aW9uLnNjcmlwdE5hbWU7XG4gICAgICAgICAgICAgIGNvbnN0IGZyb21FdmVudCA9IGV2ZW50T2JqLnBheWxvYWQuX21ldGEuZnJvbUV2ZW50O1xuICAgICAgICAgICAgICBjb25zdCBldmVudE5hbWUgPSBmcm9tRXZlbnQucGF5bG9hZC5uYW1lO1xuICAgICAgICAgICAgICBjb25zdCB0aGlzUGxheWJhY2tTY3JpcHQgPSB3aW5kb3dbdGhpc1NjcmlwdE5hbWVdO1xuICAgICAgICAgICAgICBjb25zdCBwbGF5YmFja0Z1bmN0aW9uID0gdGhpc1BsYXliYWNrU2NyaXB0LnBsYXliYWNrSW50ZXJmYWNlW2V2ZW50TmFtZV07XG5cbiAgICAgICAgICAgICAgaWYgKHBsYXliYWNrRnVuY3Rpb24pIHtcbiAgICAgICAgICAgICAgICBpZiAocmVnaXN0cmF0aW9uLnJvd0lkKSB7XG4gICAgICAgICAgICAgICAgICBldmVudE9iai5hZ2dyZWdhdGVJZCA9IHJlZ2lzdHJhdGlvbi5yb3dJZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RhdGUgPSBldmVudE9iai5wYXlsb2FkO1xuICAgICAgICAgICAgICAgIGNvbnN0IGZ1bmNzID0ge1xuICAgICAgICAgICAgICAgICAgZW1pdDogKHRhcmdldFF1ZXJ5LCBwYXlsb2FkLCBkb25lKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBnZXRQbGF5YmFja0xpc3Q6IChcbiAgICAgICAgICAgICAgICAgICAgcGxheWJhY2tMaXN0TmFtZTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKGVyciwgcGxheWJhY2tMaXN0OiBQbGF5YmFja0xpc3QpID0+IHZvaWRcbiAgICAgICAgICAgICAgICAgICkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVnaXN0cmF0aW9uLnBsYXliYWNrTGlzdCkge1xuICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJlZ2lzdHJhdGlvbi5wbGF5YmFja0xpc3QpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnUGxheWJhY2tMaXN0IGRvZXMgbm90IGV4aXN0IGluIHRoaXMgcmVnaXN0cmF0aW9uJ1xuICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG51bGxcbiAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBjb25zdCBkb25lQ2FsbGJhY2sgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICByZWdpc3RyYXRpb24ucGxheWJhY2tMaXN0LmdldChldmVudE9iai5hZ2dyZWdhdGVJZCwgKGVycm9yLCBpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuX3VwZGF0ZUNvbmRpdGlvbmFsU3Vic2NyaXB0aW9ucyhldmVudE9iai5hZ2dyZWdhdGVJZCwgaXRlbSk7XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgcGxheWJhY2tGdW5jdGlvbihzdGF0ZSwgZnJvbUV2ZW50LCBmdW5jcywgZG9uZUNhbGxiYWNrKTtcblxuICAgICAgICAgICAgICAgIC8vIFJ1biBjdXN0b20gcGxheWJhY2tFdmVudHMgaWYgdGhleSBleGlzdFxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9jdXN0b21QbGF5YmFja1JlZ2lzdHJ5W2V2ZW50TmFtZV0pIHtcbiAgICAgICAgICAgICAgICAgIHRoaXMuX2N1c3RvbVBsYXliYWNrUmVnaXN0cnlbZXZlbnROYW1lXS5mb3JFYWNoKChjdXN0b21QbGF5YmFja0NvbmZpZ3VyYXRpb246IEN1c3RvbVBsYXliYWNrQ29uZmlndXJhdGlvbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjdXN0b21QbGF5YmFja0NvbmZpZ3VyYXRpb24ucGxheWJhY2tGdW5jdGlvbihmcm9tRXZlbnQpO1xuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjb25zdCB0aGlzU2NyaXB0TmFtZSA9IHJlZ2lzdHJhdGlvbi5zY3JpcHROYW1lO1xuICAgICAgICAgICAgICBjb25zdCB0aGlzUGxheWJhY2tTY3JpcHQgPSB3aW5kb3dbdGhpc1NjcmlwdE5hbWVdO1xuICAgICAgICAgICAgICBjb25zdCBwbGF5YmFja0Z1bmN0aW9uID0gdGhpc1BsYXliYWNrU2NyaXB0LnBsYXliYWNrSW50ZXJmYWNlW2V2ZW50T2JqLnBheWxvYWQubmFtZV07XG5cbiAgICAgICAgICAgICAgaWYgKHBsYXliYWNrRnVuY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAvLyBPdmVycmlkZSBhZ2dyZWdhdGVJZCB0byBoYW5kbGUgb3RoZXIgc3Vic2NyaXB0aW9uc1xuICAgICAgICAgICAgICAgIGlmIChyZWdpc3RyYXRpb24ucm93SWQpIHtcbiAgICAgICAgICAgICAgICAgIGV2ZW50T2JqLmFnZ3JlZ2F0ZUlkID0gcmVnaXN0cmF0aW9uLnJvd0lkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCByb3cgPSBzdGF0ZUZ1bmN0aW9ucy5nZXRTdGF0ZShldmVudE9iai5hZ2dyZWdhdGVJZCk7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RhdGUgPSByb3cuZGF0YTtcbiAgICAgICAgICAgICAgICBjb25zdCBmdW5jcyA9IHtcbiAgICAgICAgICAgICAgICAgIGVtaXQ6ICh0YXJnZXRRdWVyeSwgcGF5bG9hZCwgZG9uZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgZ2V0UGxheWJhY2tMaXN0OiAoXG4gICAgICAgICAgICAgICAgICAgIHBsYXliYWNrTGlzdE5hbWU6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IChlcnIsIHBsYXliYWNrTGlzdDogUGxheWJhY2tMaXN0KSA9PiB2b2lkXG4gICAgICAgICAgICAgICAgICApID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlZ2lzdHJhdGlvbi5wbGF5YmFja0xpc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCByZWdpc3RyYXRpb24ucGxheWJhY2tMaXN0KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ1BsYXliYWNrTGlzdCBkb2VzIG5vdCBleGlzdCBpbiB0aGlzIHJlZ2lzdHJhdGlvbidcbiAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgY29uc3QgZG9uZUNhbGxiYWNrID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgcmVnaXN0cmF0aW9uLnBsYXliYWNrTGlzdC5nZXQoZXZlbnRPYmouYWdncmVnYXRlSWQsIChlcnJvciwgaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLl91cGRhdGVDb25kaXRpb25hbFN1YnNjcmlwdGlvbnMoZXZlbnRPYmouYWdncmVnYXRlSWQsIGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHBsYXliYWNrRnVuY3Rpb24oc3RhdGUsIGV2ZW50T2JqLCBmdW5jcywgZG9uZUNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICAvLyBSdW4gY3VzdG9tIHBsYXliYWNrRXZlbnRzIGlmIHRoZXkgZXhpc3RcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fY3VzdG9tUGxheWJhY2tSZWdpc3RyeVtldmVudE9iai5wYXlsb2FkLm5hbWVdKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLl9jdXN0b21QbGF5YmFja1JlZ2lzdHJ5W2V2ZW50T2JqLnBheWxvYWQubmFtZV0uZm9yRWFjaChcbiAgICAgICAgICAgICAgICAgICAgKGN1c3RvbVBsYXliYWNrQ29uZmlndXJhdGlvbjogQ3VzdG9tUGxheWJhY2tDb25maWd1cmF0aW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgY3VzdG9tUGxheWJhY2tDb25maWd1cmF0aW9uLnBsYXliYWNrRnVuY3Rpb24oZXZlbnRPYmopO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gSWYgY29uZGl0aW9uIGV4aXN0cywgcmVnaXN0ZXIgaW4gY29uZGl0aW9uYWwgcmVnaXN0cnlcbiAgICBpZiAoY29uZGl0aW9uRnVuY3Rpb24pIHtcbiAgICAgIGlmICh0aGlzLl9jb25kaXRpb25hbFN1YnNjcmlwdGlvblJlZ2lzdHJ5W3Jvd0lkXSAmJiBBcnJheS5pc0FycmF5KHRoaXMuX2NvbmRpdGlvbmFsU3Vic2NyaXB0aW9uUmVnaXN0cnlbcm93SWRdKSkge1xuICAgICAgICB0aGlzLl9jb25kaXRpb25hbFN1YnNjcmlwdGlvblJlZ2lzdHJ5W3Jvd0lkXS5wdXNoKHtcbiAgICAgICAgICBwbGF5YmFja0xpc3Q6IHBsYXliYWNrTGlzdCxcbiAgICAgICAgICBzY3JpcHROYW1lOiBzY3JpcHROYW1lLFxuICAgICAgICAgIG93bmVyOiBvd25lcixcbiAgICAgICAgICBzdGF0ZUZ1bmN0aW9uczogc3RhdGVGdW5jdGlvbnMsXG4gICAgICAgICAgcXVlcnk6IHF1ZXJ5LFxuICAgICAgICAgIHN0cmVhbVJldmlzaW9uRnVuY3Rpb246IHN0cmVhbVJldmlzaW9uRnVuY3Rpb24sXG4gICAgICAgICAgY29uZGl0aW9uRnVuY3Rpb246IGNvbmRpdGlvbkZ1bmN0aW9uLFxuICAgICAgICAgIHB1c2hTdWJzY3JpcHRpb25JZDogcHVzaFN1YnNjcmlwdGlvbklkLFxuICAgICAgICAgIHBsYXliYWNrU3Vic2NyaXB0aW9uSWQ6IHBsYXliYWNrU3Vic2NyaXB0aW9uSWQsXG4gICAgICAgICAgcm93SWRGdW5jdGlvbjogcm93SWRGdW5jdGlvblxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2NvbmRpdGlvbmFsU3Vic2NyaXB0aW9uUmVnaXN0cnlbcm93SWRdID0gW3tcbiAgICAgICAgICBwbGF5YmFja0xpc3Q6IHBsYXliYWNrTGlzdCxcbiAgICAgICAgICBzY3JpcHROYW1lOiBzY3JpcHROYW1lLFxuICAgICAgICAgIG93bmVyOiBvd25lcixcbiAgICAgICAgICBzdGF0ZUZ1bmN0aW9uczogc3RhdGVGdW5jdGlvbnMsXG4gICAgICAgICAgcXVlcnk6IHF1ZXJ5LFxuICAgICAgICAgIHN0cmVhbVJldmlzaW9uRnVuY3Rpb246IHN0cmVhbVJldmlzaW9uRnVuY3Rpb24sXG4gICAgICAgICAgY29uZGl0aW9uRnVuY3Rpb246IGNvbmRpdGlvbkZ1bmN0aW9uLFxuICAgICAgICAgIHB1c2hTdWJzY3JpcHRpb25JZDogcHVzaFN1YnNjcmlwdGlvbklkLFxuICAgICAgICAgIHBsYXliYWNrU3Vic2NyaXB0aW9uSWQ6IHBsYXliYWNrU3Vic2NyaXB0aW9uSWQsXG4gICAgICAgICAgcm93SWRGdW5jdGlvbjogcm93SWRGdW5jdGlvblxuICAgICAgICB9XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLl9wbGF5YmFja1JlZ2lzdHJ5W3BsYXliYWNrU3Vic2NyaXB0aW9uSWRdID0ge1xuICAgICAgb3duZXI6IG93bmVyLFxuICAgICAgcHVzaFN1YnNjcmlwdGlvbklkOiBwdXNoU3Vic2NyaXB0aW9uSWQsXG4gICAgICBwbGF5YmFja0xpc3Q6IHBsYXliYWNrTGlzdCxcbiAgICAgIHNjcmlwdE5hbWU6IHNjcmlwdE5hbWUsXG4gICAgICByb3dJZDogcm93SWRcbiAgICB9O1xuXG4gICAgcmV0dXJuIHBsYXliYWNrU3Vic2NyaXB0aW9uSWQ7XG4gIH1cblxuICByZWdpc3RlckN1c3RvbVBsYXliYWNrcyhjdXN0b21QbGF5YmFja0NvbmZpZ3VyYXRpb25zOiBDdXN0b21QbGF5YmFja0NvbmZpZ3VyYXRpb25bXSkge1xuICAgIGN1c3RvbVBsYXliYWNrQ29uZmlndXJhdGlvbnMuZm9yRWFjaCgoY3VzdG9tUGxheWJhY2tDb25maWd1cmF0aW9uOiBDdXN0b21QbGF5YmFja0NvbmZpZ3VyYXRpb24pID0+IHtcbiAgICAgIGlmICghdGhpcy5fY3VzdG9tUGxheWJhY2tSZWdpc3RyeVtjdXN0b21QbGF5YmFja0NvbmZpZ3VyYXRpb24uZXZlbnROYW1lXSkge1xuICAgICAgICB0aGlzLl9jdXN0b21QbGF5YmFja1JlZ2lzdHJ5W2N1c3RvbVBsYXliYWNrQ29uZmlndXJhdGlvbi5ldmVudE5hbWVdID0gW107XG4gICAgICB9XG4gICAgICB0aGlzLl9jdXN0b21QbGF5YmFja1JlZ2lzdHJ5W2N1c3RvbVBsYXliYWNrQ29uZmlndXJhdGlvbi5ldmVudE5hbWVdLnB1c2goY3VzdG9tUGxheWJhY2tDb25maWd1cmF0aW9uKTtcbiAgICB9KTtcbiAgfVxuXG4gIHJlc2V0Q3VzdG9tUGxheWJhY2tzKCkge1xuICAgIHRoaXMuX2N1c3RvbVBsYXliYWNrUmVnaXN0cnkgPSB7fTtcbiAgfVxuXG4gIF91cGRhdGVDb25kaXRpb25hbFN1YnNjcmlwdGlvbnMocm93SWQsIHJvd0RhdGEpIHtcbiAgICBjb25zdCBjb25kaXRpb25hbFN1YnNjcmlwdGlvbnMgPSB0aGlzLl9jb25kaXRpb25hbFN1YnNjcmlwdGlvblJlZ2lzdHJ5W3Jvd0lkXSB8fCBbXTtcbiAgICBjb25kaXRpb25hbFN1YnNjcmlwdGlvbnMuZm9yRWFjaChhc3luYyAoY29uZGl0aW9uYWxTdWJzY3JpcHRpb24pID0+IHtcbiAgICAgIGlmICghY29uZGl0aW9uYWxTdWJzY3JpcHRpb24ucHVzaFN1YnNjcmlwdGlvbklkICYmIGNvbmRpdGlvbmFsU3Vic2NyaXB0aW9uLmNvbmRpdGlvbkZ1bmN0aW9uKHJvd0RhdGEpKSB7XG4gICAgICAgIGNvbnN0IG9mZnNldCA9IGNvbmRpdGlvbmFsU3Vic2NyaXB0aW9uLnN0cmVhbVJldmlzaW9uRnVuY3Rpb24ocm93RGF0YSk7XG5cbiAgICAgICAgY29uc3Qgc3ViUXVlcnkgPSBfY2xvbmUoY29uZGl0aW9uYWxTdWJzY3JpcHRpb24ucXVlcnkpO1xuXG4gICAgICAgIGlmIChjb25kaXRpb25hbFN1YnNjcmlwdGlvbi5yb3dJZEZ1bmN0aW9uKSB7XG4gICAgICAgICAgc3ViUXVlcnkuYWdncmVnYXRlSWQgPSBjb25kaXRpb25hbFN1YnNjcmlwdGlvbi5yb3dJZEZ1bmN0aW9uKHJvd0RhdGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcHVzaFN1YnNjcmlwdGlvbklkID0gdGhpcy5wdXNoU2VydmljZS5zdWJzY3JpYmUoXG4gICAgICAgICAgc3ViUXVlcnksXG4gICAgICAgICAgb2Zmc2V0LFxuICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgYXN5bmMgKGVyciwgZXZlbnRPYmosIG93bmVyMikgPT4ge1xuICAgICAgICAgICAgLy8gb3duZXIgaXMgcGxheWJhY2tzZXJ2aWNlXG4gICAgICAgICAgICBjb25zdCBzZWxmID0gb3duZXIyIGFzIFBsYXliYWNrU2VydmljZTtcbiAgICAgICAgICAgIGNvbnN0IHJlZ2lzdHJhdGlvbiA9IHNlbGYuX3BsYXliYWNrUmVnaXN0cnlbY29uZGl0aW9uYWxTdWJzY3JpcHRpb24ucGxheWJhY2tTdWJzY3JpcHRpb25JZF07XG5cbiAgICAgICAgICAgIGlmIChldmVudE9iai5hZ2dyZWdhdGUgPT09ICdzdGF0ZXMnKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHRoaXNTY3JpcHROYW1lID0gcmVnaXN0cmF0aW9uLnNjcmlwdE5hbWU7XG4gICAgICAgICAgICAgIGNvbnN0IGZyb21FdmVudCA9IGV2ZW50T2JqLnBheWxvYWQuX21ldGEuZnJvbUV2ZW50O1xuICAgICAgICAgICAgICBjb25zdCBldmVudE5hbWUgPSBmcm9tRXZlbnQucGF5bG9hZC5uYW1lO1xuICAgICAgICAgICAgICBjb25zdCB0aGlzUGxheWJhY2tTY3JpcHQgPSB3aW5kb3dbdGhpc1NjcmlwdE5hbWVdO1xuICAgICAgICAgICAgICBjb25zdCBwbGF5YmFja0Z1bmN0aW9uID0gdGhpc1BsYXliYWNrU2NyaXB0LnBsYXliYWNrSW50ZXJmYWNlW2V2ZW50TmFtZV07XG5cbiAgICAgICAgICAgICAgaWYgKHBsYXliYWNrRnVuY3Rpb24pIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzdGF0ZSA9IGV2ZW50T2JqLnBheWxvYWQ7XG4gICAgICAgICAgICAgICAgY29uc3QgZnVuY3MgPSB7XG4gICAgICAgICAgICAgICAgICBlbWl0OiAodGFyZ2V0UXVlcnksIHBheWxvYWQsIGRvbmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIGdldFBsYXliYWNrTGlzdDogKFxuICAgICAgICAgICAgICAgICAgICBwbGF5YmFja0xpc3ROYW1lOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoZXJyLCBwbGF5YmFja0xpc3Q6IFBsYXliYWNrTGlzdCkgPT4gdm9pZFxuICAgICAgICAgICAgICAgICAgKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZWdpc3RyYXRpb24ucGxheWJhY2tMaXN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVnaXN0cmF0aW9uLnBsYXliYWNrTGlzdCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdQbGF5YmFja0xpc3QgZG9lcyBub3QgZXhpc3QgaW4gdGhpcyByZWdpc3RyYXRpb24nXG4gICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgICAgbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGRvbmVDYWxsYmFjayA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHBsYXliYWNrRnVuY3Rpb24oc3RhdGUsIGZyb21FdmVudCwgZnVuY3MsIGRvbmVDYWxsYmFjayk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgY29uc3QgdGhpc1NjcmlwdE5hbWUgPSByZWdpc3RyYXRpb24uc2NyaXB0TmFtZTtcbiAgICAgICAgICAgICAgY29uc3QgdGhpc1BsYXliYWNrU2NyaXB0ID0gd2luZG93W3RoaXNTY3JpcHROYW1lXTtcbiAgICAgICAgICAgICAgY29uc3QgcGxheWJhY2tGdW5jdGlvbiA9IHRoaXNQbGF5YmFja1NjcmlwdC5wbGF5YmFja0ludGVyZmFjZVtldmVudE9iai5wYXlsb2FkLm5hbWVdO1xuXG4gICAgICAgICAgICAgIGlmIChwbGF5YmFja0Z1bmN0aW9uKSB7XG4gICAgICAgICAgICAgICAgLy8gT3ZlcnJpZGUgYWdncmVnYXRlSWQgdG8gaGFuZGxlIG90aGVyIHN1YnNjcmlwdGlvbnNcbiAgICAgICAgICAgICAgICBpZiAocmVnaXN0cmF0aW9uLnJvd0lkKSB7XG4gICAgICAgICAgICAgICAgICBldmVudE9iai5hZ2dyZWdhdGVJZCA9IHJlZ2lzdHJhdGlvbi5yb3dJZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3Qgcm93ID0gY29uZGl0aW9uYWxTdWJzY3JpcHRpb24uc3RhdGVGdW5jdGlvbnMuZ2V0U3RhdGUoZXZlbnRPYmouYWdncmVnYXRlSWQpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0YXRlID0gcm93LmRhdGE7XG4gICAgICAgICAgICAgICAgY29uc3QgZnVuY3MgPSB7XG4gICAgICAgICAgICAgICAgICBlbWl0OiAodGFyZ2V0UXVlcnksIHBheWxvYWQsIGRvbmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIGdldFBsYXliYWNrTGlzdDogKFxuICAgICAgICAgICAgICAgICAgICBwbGF5YmFja0xpc3ROYW1lOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoZXJyLCBwbGF5YmFja0xpc3Q6IFBsYXliYWNrTGlzdCkgPT4gdm9pZFxuICAgICAgICAgICAgICAgICAgKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZWdpc3RyYXRpb24ucGxheWJhY2tMaXN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVnaXN0cmF0aW9uLnBsYXliYWNrTGlzdCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdQbGF5YmFja0xpc3QgZG9lcyBub3QgZXhpc3QgaW4gdGhpcyByZWdpc3RyYXRpb24nXG4gICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgICAgbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGRvbmVDYWxsYmFjayA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgIC8vIHN0YXRlRnVuY3Rpb25zLnNldFN0YXRlKHJvdy5yb3dJZCwgcm93KTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgcGxheWJhY2tGdW5jdGlvbihzdGF0ZSwgZXZlbnRPYmosIGZ1bmNzLCBkb25lQ2FsbGJhY2spO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgICAgIC8vIGp1c3QgdXNlIHRoZSBzdWJzY3JpcHRpb25JZCB0byBtYXAgdGhlIHB1c2ggc3Vic2NyaXB0aW9uIHRvIHRoZSBwbGF5YmFja1xuICAgICAgICB0aGlzLl9wbGF5YmFja1JlZ2lzdHJ5W2NvbmRpdGlvbmFsU3Vic2NyaXB0aW9uLnBsYXliYWNrU3Vic2NyaXB0aW9uSWRdID0ge1xuICAgICAgICAgIG93bmVyOiBjb25kaXRpb25hbFN1YnNjcmlwdGlvbi5vd25lcixcbiAgICAgICAgICBwdXNoU3Vic2NyaXB0aW9uSWQ6IHB1c2hTdWJzY3JpcHRpb25JZCxcbiAgICAgICAgICBwbGF5YmFja0xpc3Q6IGNvbmRpdGlvbmFsU3Vic2NyaXB0aW9uLnBsYXliYWNrTGlzdCxcbiAgICAgICAgICBzY3JpcHROYW1lOiBjb25kaXRpb25hbFN1YnNjcmlwdGlvbi5zY3JpcHROYW1lLFxuICAgICAgICAgIHJvd0lkOiByb3dJZFxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbmRpdGlvbmFsU3Vic2NyaXB0aW9uLnB1c2hTdWJzY3JpcHRpb25JZCA9IHB1c2hTdWJzY3JpcHRpb25JZDtcblxuICAgICAgICAvLyBjb25zb2xlLmxvZygnc3Vic2NyaWJlZCB0byBwbGF5YmFjazogJywgcHVzaFN1YnNjcmlwdGlvbklkLCBjb25kaXRpb25hbFN1YnNjcmlwdGlvbi5xdWVyeSk7XG4gICAgICAgIHJldHVybiBwdXNoU3Vic2NyaXB0aW9uSWQ7XG4gICAgICB9IGVsc2UgaWYgKCFjb25kaXRpb25hbFN1YnNjcmlwdGlvbi5jb25kaXRpb25GdW5jdGlvbihyb3dEYXRhKSAmJiBjb25kaXRpb25hbFN1YnNjcmlwdGlvbi5wdXNoU3Vic2NyaXB0aW9uSWQpIHtcbiAgICAgICAgdGhpcy5wdXNoU2VydmljZS51bnN1YnNjcmliZShbY29uZGl0aW9uYWxTdWJzY3JpcHRpb24ucHVzaFN1YnNjcmlwdGlvbklkXSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgZGVsZXRlIHRoaXMuX3BsYXliYWNrUmVnaXN0cnlbY29uZGl0aW9uYWxTdWJzY3JpcHRpb24ucGxheWJhY2tTdWJzY3JpcHRpb25JZF07XG4gICAgICAgICAgY29uZGl0aW9uYWxTdWJzY3JpcHRpb24ucHVzaFN1YnNjcmlwdGlvbklkID0gdW5kZWZpbmVkO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG59XG4iXX0=