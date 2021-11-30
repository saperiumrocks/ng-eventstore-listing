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
PlaybackService = tslib_1.__decorate([
    Injectable(),
    tslib_1.__metadata("design:paramtypes", [PushService])
], PlaybackService);
export { PlaybackService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheWJhY2suc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25nLWV2ZW50c3RvcmUtbGlzdGluZy8iLCJzb3VyY2VzIjpbInNlcnZpY2VzL3BsYXliYWNrLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sTUFBTSxNQUFNLGlCQUFpQixDQUFDO0FBQ3JDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUM3QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQVk3QyxJQUFhLGVBQWUsR0FBNUIsTUFBYSxlQUFlO0lBSzFCLFlBQ1UsV0FBd0I7UUFBeEIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFMbEMsc0JBQWlCLEdBQXFCLEVBQUUsQ0FBQztRQUN6QyxxQ0FBZ0MsR0FBb0MsRUFBRSxDQUFDO1FBQ3ZFLDRCQUF1QixHQUEyQixFQUFFLENBQUM7SUFJbEQsQ0FBQztJQUVKLElBQUksQ0FBQyxTQUFpQjtRQUNwQixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRUsscUJBQXFCLENBQUMsY0FBd0I7O1lBQ2xELG9DQUFvQztZQUNwQyxNQUFNLFVBQVUsR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsYUFBYSxFQUFFLEVBQUU7Z0JBQ3RELE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLGFBQWEsQ0FBQyxDQUFDLGtCQUFrQixDQUFDO1lBQ2xFLENBQUMsQ0FBQyxDQUFDO1lBRUgsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFPLEtBQUssRUFBRSxFQUFFO2dCQUNyQyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDO2dCQUVsRCx5QkFBeUI7Z0JBQ3pCLHNEQUFzRDtnQkFFdEQsSUFB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QXVCLENBQUMsWUFBWTtvQkFDbEQsVUFBVSxFQUFFLHVCQUF1QixDQUFDLFVBQVU7b0JBQzlDLEtBQUssRUFBRSxLQUFLO2lCQUNiLENBQUM7Z0JBRUYsdUJBQXVCLENBQUMsa0JBQWtCLEdBQUcsa0JBQWtCLENBQUM7Z0JBRWhFLDhGQUE4RjtnQkFDOUYsT0FBTyxrQkFBa0IsQ0FBQzthQUMzQjtpQkFBTSxJQUFJLENBQUMsdUJBQXVCLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLElBQUksdUJBQXVCLENBQUMsa0JBQWtCLEVBQUU7Z0JBQzVHLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUMsdUJBQXVCLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7b0JBQ25GLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLHVCQUF1QixDQUFDLHNCQUFzQixDQUFDLENBQUM7b0JBQzlFLHVCQUF1QixDQUFDLGtCQUFrQixHQUFHLFNBQVMsQ0FBQztnQkFDekQsQ0FBQyxDQUFDLENBQUM7YUFDSjtRQUNILENBQUMsQ0FBQSxDQUFDLENBQUM7SUFDTCxDQUFDO0NBRUYsQ0FBQTtBQTlXWSxlQUFlO0lBRDNCLFVBQVUsRUFBRTs2Q0FPWSxXQUFXO0dBTnZCLGVBQWUsQ0E4VzNCO1NBOVdZLGVBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgX2Nsb25lIGZyb20gJ2xvZGFzaC1lcy9jbG9uZSc7XG5pbXBvcnQgeyBIZWxwZXJzIH0gZnJvbSAnLi8uLi91dGlscy9oZWxwZXJzJztcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFB1c2hTZXJ2aWNlIH0gZnJvbSAnLi9wdXNoLnNlcnZpY2UnO1xuaW1wb3J0IHtcbiAgU3RhdGVGdW5jdGlvbnMsXG4gIFBsYXliYWNrTGlzdCxcbiAgUGxheWJhY2tSZWdpc3RyeSxcbiAgUXVlcnksXG4gIENvbmRpdGlvbmFsU3Vic2NyaXB0aW9uUmVnaXN0cnksXG4gIEN1c3RvbVBsYXliYWNrQ29uZmlndXJhdGlvblxufSBmcm9tICcuLi9tb2RlbHMnO1xuaW1wb3J0IHsgQ3VzdG9tUGxheWJhY2tSZWdpc3RyeSB9IGZyb20gJy4uL21vZGVscy9jdXN0b20tcGxheWJhY2stcmVnaXN0cnknO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgUGxheWJhY2tTZXJ2aWNlIHtcbiAgX3BsYXliYWNrUmVnaXN0cnk6IFBsYXliYWNrUmVnaXN0cnkgPSB7fTtcbiAgX2NvbmRpdGlvbmFsU3Vic2NyaXB0aW9uUmVnaXN0cnk6IENvbmRpdGlvbmFsU3Vic2NyaXB0aW9uUmVnaXN0cnkgPSB7fTtcbiAgX2N1c3RvbVBsYXliYWNrUmVnaXN0cnk6IEN1c3RvbVBsYXliYWNrUmVnaXN0cnkgPSB7fTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHB1c2hTZXJ2aWNlOiBQdXNoU2VydmljZVxuICApIHt9XG5cbiAgaW5pdChzb2NrZXRVcmw6IHN0cmluZykge1xuICAgIHRoaXMucHVzaFNlcnZpY2UuaW5pdChzb2NrZXRVcmwpO1xuICB9XG5cbiAgYXN5bmMgdW5yZWdpc3RlckZvclBsYXliYWNrKHBsYXliYWNrVG9rZW5zOiBzdHJpbmdbXSkge1xuICAgIC8vIHVucmVnaXN0ZXIgZnJvbSBwbGF5YmFjayByZWdpc3RyeVxuICAgIGNvbnN0IHB1c2hUb2tlbnMgPSBwbGF5YmFja1Rva2Vucy5tYXAoKHBsYXliYWNrVG9rZW4pID0+IHtcbiAgICAgIHJldHVybiB0aGlzLl9wbGF5YmFja1JlZ2lzdHJ5W3BsYXliYWNrVG9rZW5dLnB1c2hTdWJzY3JpcHRpb25JZDtcbiAgICB9KTtcblxuICAgIHBsYXliYWNrVG9rZW5zLmZvckVhY2goYXN5bmMgKHRva2VuKSA9PiB7XG4gICAgICBjb25zdCByb3dJZCA9IHRoaXMuX3BsYXliYWNrUmVnaXN0cnlbdG9rZW5dLnJvd0lkO1xuXG4gICAgICAvLyBjb25zb2xlLmxvZygnQkVGT1JFJyk7XG4gICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLl9jb25kaXRpb25hbFN1YnNjcmlwdGlvblJlZ2lzdHJ5KTtcblxuICAgICAgaWYgKHJvd0lkKSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLl9jb25kaXRpb25hbFN1YnNjcmlwdGlvblJlZ2lzdHJ5W3Jvd0lkXTtcbiAgICAgIH1cblxuICAgICAgLy8gY29uc29sZS5sb2coJ0FGVEVSJyk7XG4gICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLl9jb25kaXRpb25hbFN1YnNjcmlwdGlvblJlZ2lzdHJ5KTtcblxuICAgICAgLy8gdW5zdWJzY3JpYmUgZnJvbSBwdXNoXG4gICAgICBkZWxldGUgdGhpcy5fcGxheWJhY2tSZWdpc3RyeVt0b2tlbl07XG4gICAgfSk7XG5cbiAgICBhd2FpdCB0aGlzLnB1c2hTZXJ2aWNlLnVuc3Vic2NyaWJlKHB1c2hUb2tlbnMpO1xuICB9XG5cbiAgYXN5bmMgcmVnaXN0ZXJGb3JQbGF5YmFjayhcbiAgICBvd25lcjogb2JqZWN0LFxuICAgIHNjcmlwdE5hbWU6IHN0cmluZyxcbiAgICBxdWVyeTogUXVlcnksXG4gICAgc3RhdGVGdW5jdGlvbnM6IFN0YXRlRnVuY3Rpb25zLFxuICAgIHBsYXliYWNrTGlzdDogUGxheWJhY2tMaXN0LFxuICAgIHN0cmVhbVJldmlzaW9uRnVuY3Rpb246IChpdGVtOiBhbnkpID0+IG51bWJlciA9IChpdGVtKSA9PiAwLFxuICAgIHJvd0lkPzogc3RyaW5nLFxuICAgIGNvbmRpdGlvbkZ1bmN0aW9uPzogKGl0ZW06IGFueSkgPT4gYm9vbGVhbixcbiAgICByb3dJZEZ1bmN0aW9uPzogKGl0ZW06IGFueSkgPT4gc3RyaW5nXG4gICkge1xuICAgIGNvbnN0IHBsYXliYWNrU3Vic2NyaXB0aW9uSWQgPSBIZWxwZXJzLmdlbmVyYXRlVG9rZW4oKTtcblxuICAgIGxldCByb3dEYXRhO1xuICAgIGlmIChyb3dJZCkge1xuICAgICAgY29uc3QgYWdncmVnYXRlSWQgPSByb3dJZCA/IHJvd0lkIDogcXVlcnkuYWdncmVnYXRlSWQ7XG4gICAgICByb3dEYXRhID0gYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBwbGF5YmFja0xpc3QuZ2V0KGFnZ3JlZ2F0ZUlkLCAoZXJyb3IsIGl0ZW0pID0+IHtcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlc29sdmUoaXRlbSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgbGV0IHN0cmVhbVJldmlzaW9uO1xuICAgIGxldCBpc0NvbmRpdGlvblRydWU7XG5cbiAgICBpZiAocm93RGF0YSkge1xuICAgICAgc3RyZWFtUmV2aXNpb24gPSBzdHJlYW1SZXZpc2lvbkZ1bmN0aW9uKHJvd0RhdGEpO1xuICAgICAgaXNDb25kaXRpb25UcnVlID0gY29uZGl0aW9uRnVuY3Rpb24gPyAoY29uZGl0aW9uRnVuY3Rpb24ocm93RGF0YSkgPyB0cnVlIDogZmFsc2UpIDogdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGxldCBwdXNoU3Vic2NyaXB0aW9uSWQ7XG4gICAgaWYgKGlzQ29uZGl0aW9uVHJ1ZSA9PT0gdHJ1ZSB8fCBjb25kaXRpb25GdW5jdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBwdXNoU3Vic2NyaXB0aW9uSWQgPSBhd2FpdCB0aGlzLnB1c2hTZXJ2aWNlLnN1YnNjcmliZShcbiAgICAgICAgcXVlcnksXG4gICAgICAgIHN0cmVhbVJldmlzaW9uLFxuICAgICAgICB0aGlzLFxuICAgICAgICBhc3luYyAoZXJyLCBldmVudE9iaiwgb3duZXIyKSA9PiB7XG4gICAgICAgICAgLy8gb3duZXIgaXMgcGxheWJhY2tzZXJ2aWNlXG4gICAgICAgICAgY29uc3Qgc2VsZiA9IG93bmVyMiBhcyBQbGF5YmFja1NlcnZpY2U7XG5cbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhzZWxmLl9wbGF5YmFja1JlZ2lzdHJ5KTtcblxuICAgICAgICAgIGNvbnN0IHJlZ2lzdHJhdGlvbiA9IHNlbGYuX3BsYXliYWNrUmVnaXN0cnlbcGxheWJhY2tTdWJzY3JpcHRpb25JZF07XG5cbiAgICAgICAgICBpZiAocmVnaXN0cmF0aW9uKSB7XG4gICAgICAgICAgICBpZiAoZXZlbnRPYmouYWdncmVnYXRlID09PSAnc3RhdGVzJykge1xuICAgICAgICAgICAgICBjb25zdCB0aGlzU2NyaXB0TmFtZSA9IHJlZ2lzdHJhdGlvbi5zY3JpcHROYW1lO1xuICAgICAgICAgICAgICBjb25zdCBmcm9tRXZlbnQgPSBldmVudE9iai5wYXlsb2FkLl9tZXRhLmZyb21FdmVudDtcbiAgICAgICAgICAgICAgY29uc3QgZXZlbnROYW1lID0gZnJvbUV2ZW50LnBheWxvYWQubmFtZTtcbiAgICAgICAgICAgICAgY29uc3QgdGhpc1BsYXliYWNrU2NyaXB0ID0gd2luZG93W3RoaXNTY3JpcHROYW1lXTtcbiAgICAgICAgICAgICAgY29uc3QgcGxheWJhY2tGdW5jdGlvbiA9IHRoaXNQbGF5YmFja1NjcmlwdC5wbGF5YmFja0ludGVyZmFjZVtldmVudE5hbWVdO1xuXG4gICAgICAgICAgICAgIGlmIChwbGF5YmFja0Z1bmN0aW9uKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlZ2lzdHJhdGlvbi5yb3dJZCkge1xuICAgICAgICAgICAgICAgICAgZXZlbnRPYmouYWdncmVnYXRlSWQgPSByZWdpc3RyYXRpb24ucm93SWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHN0YXRlID0gZXZlbnRPYmoucGF5bG9hZDtcbiAgICAgICAgICAgICAgICBjb25zdCBmdW5jcyA9IHtcbiAgICAgICAgICAgICAgICAgIGVtaXQ6ICh0YXJnZXRRdWVyeSwgcGF5bG9hZCwgZG9uZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgZ2V0UGxheWJhY2tMaXN0OiAoXG4gICAgICAgICAgICAgICAgICAgIHBsYXliYWNrTGlzdE5hbWU6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IChlcnIsIHBsYXliYWNrTGlzdDogUGxheWJhY2tMaXN0KSA9PiB2b2lkXG4gICAgICAgICAgICAgICAgICApID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlZ2lzdHJhdGlvbi5wbGF5YmFja0xpc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCByZWdpc3RyYXRpb24ucGxheWJhY2tMaXN0KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ1BsYXliYWNrTGlzdCBkb2VzIG5vdCBleGlzdCBpbiB0aGlzIHJlZ2lzdHJhdGlvbidcbiAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgY29uc3QgZG9uZUNhbGxiYWNrID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgcmVnaXN0cmF0aW9uLnBsYXliYWNrTGlzdC5nZXQoZXZlbnRPYmouYWdncmVnYXRlSWQsIChlcnJvciwgaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLl91cGRhdGVDb25kaXRpb25hbFN1YnNjcmlwdGlvbnMoZXZlbnRPYmouYWdncmVnYXRlSWQsIGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHBsYXliYWNrRnVuY3Rpb24oc3RhdGUsIGZyb21FdmVudCwgZnVuY3MsIGRvbmVDYWxsYmFjayk7XG5cbiAgICAgICAgICAgICAgICAvLyBSdW4gY3VzdG9tIHBsYXliYWNrRXZlbnRzIGlmIHRoZXkgZXhpc3RcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fY3VzdG9tUGxheWJhY2tSZWdpc3RyeVtldmVudE5hbWVdKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLl9jdXN0b21QbGF5YmFja1JlZ2lzdHJ5W2V2ZW50TmFtZV0uZm9yRWFjaCgoY3VzdG9tUGxheWJhY2tDb25maWd1cmF0aW9uOiBDdXN0b21QbGF5YmFja0NvbmZpZ3VyYXRpb24pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY3VzdG9tUGxheWJhY2tDb25maWd1cmF0aW9uLnBsYXliYWNrRnVuY3Rpb24oZnJvbUV2ZW50KTtcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY29uc3QgdGhpc1NjcmlwdE5hbWUgPSByZWdpc3RyYXRpb24uc2NyaXB0TmFtZTtcbiAgICAgICAgICAgICAgY29uc3QgdGhpc1BsYXliYWNrU2NyaXB0ID0gd2luZG93W3RoaXNTY3JpcHROYW1lXTtcbiAgICAgICAgICAgICAgY29uc3QgcGxheWJhY2tGdW5jdGlvbiA9IHRoaXNQbGF5YmFja1NjcmlwdC5wbGF5YmFja0ludGVyZmFjZVtldmVudE9iai5wYXlsb2FkLm5hbWVdO1xuXG4gICAgICAgICAgICAgIGlmIChwbGF5YmFja0Z1bmN0aW9uKSB7XG4gICAgICAgICAgICAgICAgLy8gT3ZlcnJpZGUgYWdncmVnYXRlSWQgdG8gaGFuZGxlIG90aGVyIHN1YnNjcmlwdGlvbnNcbiAgICAgICAgICAgICAgICBpZiAocmVnaXN0cmF0aW9uLnJvd0lkKSB7XG4gICAgICAgICAgICAgICAgICBldmVudE9iai5hZ2dyZWdhdGVJZCA9IHJlZ2lzdHJhdGlvbi5yb3dJZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3Qgcm93ID0gc3RhdGVGdW5jdGlvbnMuZ2V0U3RhdGUoZXZlbnRPYmouYWdncmVnYXRlSWQpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0YXRlID0gcm93LmRhdGE7XG4gICAgICAgICAgICAgICAgY29uc3QgZnVuY3MgPSB7XG4gICAgICAgICAgICAgICAgICBlbWl0OiAodGFyZ2V0UXVlcnksIHBheWxvYWQsIGRvbmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIGdldFBsYXliYWNrTGlzdDogKFxuICAgICAgICAgICAgICAgICAgICBwbGF5YmFja0xpc3ROYW1lOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoZXJyLCBwbGF5YmFja0xpc3Q6IFBsYXliYWNrTGlzdCkgPT4gdm9pZFxuICAgICAgICAgICAgICAgICAgKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZWdpc3RyYXRpb24ucGxheWJhY2tMaXN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVnaXN0cmF0aW9uLnBsYXliYWNrTGlzdCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdQbGF5YmFja0xpc3QgZG9lcyBub3QgZXhpc3QgaW4gdGhpcyByZWdpc3RyYXRpb24nXG4gICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgICAgbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGRvbmVDYWxsYmFjayA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgIHJlZ2lzdHJhdGlvbi5wbGF5YmFja0xpc3QuZ2V0KGV2ZW50T2JqLmFnZ3JlZ2F0ZUlkLCAoZXJyb3IsIGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5fdXBkYXRlQ29uZGl0aW9uYWxTdWJzY3JpcHRpb25zKGV2ZW50T2JqLmFnZ3JlZ2F0ZUlkLCBpdGVtKTtcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBwbGF5YmFja0Z1bmN0aW9uKHN0YXRlLCBldmVudE9iaiwgZnVuY3MsIGRvbmVDYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgLy8gUnVuIGN1c3RvbSBwbGF5YmFja0V2ZW50cyBpZiB0aGV5IGV4aXN0XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2N1c3RvbVBsYXliYWNrUmVnaXN0cnlbZXZlbnRPYmoucGF5bG9hZC5uYW1lXSkge1xuICAgICAgICAgICAgICAgICAgdGhpcy5fY3VzdG9tUGxheWJhY2tSZWdpc3RyeVtldmVudE9iai5wYXlsb2FkLm5hbWVdLmZvckVhY2goXG4gICAgICAgICAgICAgICAgICAgIChjdXN0b21QbGF5YmFja0NvbmZpZ3VyYXRpb246IEN1c3RvbVBsYXliYWNrQ29uZmlndXJhdGlvbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgIGN1c3RvbVBsYXliYWNrQ29uZmlndXJhdGlvbi5wbGF5YmFja0Z1bmN0aW9uKGV2ZW50T2JqKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIElmIGNvbmRpdGlvbiBleGlzdHMsIHJlZ2lzdGVyIGluIGNvbmRpdGlvbmFsIHJlZ2lzdHJ5XG4gICAgaWYgKGNvbmRpdGlvbkZ1bmN0aW9uKSB7XG4gICAgICBpZiAodGhpcy5fY29uZGl0aW9uYWxTdWJzY3JpcHRpb25SZWdpc3RyeVtyb3dJZF0gJiYgQXJyYXkuaXNBcnJheSh0aGlzLl9jb25kaXRpb25hbFN1YnNjcmlwdGlvblJlZ2lzdHJ5W3Jvd0lkXSkpIHtcbiAgICAgICAgdGhpcy5fY29uZGl0aW9uYWxTdWJzY3JpcHRpb25SZWdpc3RyeVtyb3dJZF0ucHVzaCh7XG4gICAgICAgICAgcGxheWJhY2tMaXN0OiBwbGF5YmFja0xpc3QsXG4gICAgICAgICAgc2NyaXB0TmFtZTogc2NyaXB0TmFtZSxcbiAgICAgICAgICBvd25lcjogb3duZXIsXG4gICAgICAgICAgc3RhdGVGdW5jdGlvbnM6IHN0YXRlRnVuY3Rpb25zLFxuICAgICAgICAgIHF1ZXJ5OiBxdWVyeSxcbiAgICAgICAgICBzdHJlYW1SZXZpc2lvbkZ1bmN0aW9uOiBzdHJlYW1SZXZpc2lvbkZ1bmN0aW9uLFxuICAgICAgICAgIGNvbmRpdGlvbkZ1bmN0aW9uOiBjb25kaXRpb25GdW5jdGlvbixcbiAgICAgICAgICBwdXNoU3Vic2NyaXB0aW9uSWQ6IHB1c2hTdWJzY3JpcHRpb25JZCxcbiAgICAgICAgICBwbGF5YmFja1N1YnNjcmlwdGlvbklkOiBwbGF5YmFja1N1YnNjcmlwdGlvbklkLFxuICAgICAgICAgIHJvd0lkRnVuY3Rpb246IHJvd0lkRnVuY3Rpb25cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9jb25kaXRpb25hbFN1YnNjcmlwdGlvblJlZ2lzdHJ5W3Jvd0lkXSA9IFt7XG4gICAgICAgICAgcGxheWJhY2tMaXN0OiBwbGF5YmFja0xpc3QsXG4gICAgICAgICAgc2NyaXB0TmFtZTogc2NyaXB0TmFtZSxcbiAgICAgICAgICBvd25lcjogb3duZXIsXG4gICAgICAgICAgc3RhdGVGdW5jdGlvbnM6IHN0YXRlRnVuY3Rpb25zLFxuICAgICAgICAgIHF1ZXJ5OiBxdWVyeSxcbiAgICAgICAgICBzdHJlYW1SZXZpc2lvbkZ1bmN0aW9uOiBzdHJlYW1SZXZpc2lvbkZ1bmN0aW9uLFxuICAgICAgICAgIGNvbmRpdGlvbkZ1bmN0aW9uOiBjb25kaXRpb25GdW5jdGlvbixcbiAgICAgICAgICBwdXNoU3Vic2NyaXB0aW9uSWQ6IHB1c2hTdWJzY3JpcHRpb25JZCxcbiAgICAgICAgICBwbGF5YmFja1N1YnNjcmlwdGlvbklkOiBwbGF5YmFja1N1YnNjcmlwdGlvbklkLFxuICAgICAgICAgIHJvd0lkRnVuY3Rpb246IHJvd0lkRnVuY3Rpb25cbiAgICAgICAgfV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fcGxheWJhY2tSZWdpc3RyeVtwbGF5YmFja1N1YnNjcmlwdGlvbklkXSA9IHtcbiAgICAgIG93bmVyOiBvd25lcixcbiAgICAgIHB1c2hTdWJzY3JpcHRpb25JZDogcHVzaFN1YnNjcmlwdGlvbklkLFxuICAgICAgcGxheWJhY2tMaXN0OiBwbGF5YmFja0xpc3QsXG4gICAgICBzY3JpcHROYW1lOiBzY3JpcHROYW1lLFxuICAgICAgcm93SWQ6IHJvd0lkXG4gICAgfTtcblxuICAgIHJldHVybiBwbGF5YmFja1N1YnNjcmlwdGlvbklkO1xuICB9XG5cbiAgcmVnaXN0ZXJDdXN0b21QbGF5YmFja3MoY3VzdG9tUGxheWJhY2tDb25maWd1cmF0aW9uczogQ3VzdG9tUGxheWJhY2tDb25maWd1cmF0aW9uW10pIHtcbiAgICBjdXN0b21QbGF5YmFja0NvbmZpZ3VyYXRpb25zLmZvckVhY2goKGN1c3RvbVBsYXliYWNrQ29uZmlndXJhdGlvbjogQ3VzdG9tUGxheWJhY2tDb25maWd1cmF0aW9uKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuX2N1c3RvbVBsYXliYWNrUmVnaXN0cnlbY3VzdG9tUGxheWJhY2tDb25maWd1cmF0aW9uLmV2ZW50TmFtZV0pIHtcbiAgICAgICAgdGhpcy5fY3VzdG9tUGxheWJhY2tSZWdpc3RyeVtjdXN0b21QbGF5YmFja0NvbmZpZ3VyYXRpb24uZXZlbnROYW1lXSA9IFtdO1xuICAgICAgfVxuICAgICAgdGhpcy5fY3VzdG9tUGxheWJhY2tSZWdpc3RyeVtjdXN0b21QbGF5YmFja0NvbmZpZ3VyYXRpb24uZXZlbnROYW1lXS5wdXNoKGN1c3RvbVBsYXliYWNrQ29uZmlndXJhdGlvbik7XG4gICAgfSk7XG4gIH1cblxuICByZXNldEN1c3RvbVBsYXliYWNrcygpIHtcbiAgICB0aGlzLl9jdXN0b21QbGF5YmFja1JlZ2lzdHJ5ID0ge307XG4gIH1cblxuICBfdXBkYXRlQ29uZGl0aW9uYWxTdWJzY3JpcHRpb25zKHJvd0lkLCByb3dEYXRhKSB7XG4gICAgY29uc3QgY29uZGl0aW9uYWxTdWJzY3JpcHRpb25zID0gdGhpcy5fY29uZGl0aW9uYWxTdWJzY3JpcHRpb25SZWdpc3RyeVtyb3dJZF0gfHwgW107XG4gICAgY29uZGl0aW9uYWxTdWJzY3JpcHRpb25zLmZvckVhY2goYXN5bmMgKGNvbmRpdGlvbmFsU3Vic2NyaXB0aW9uKSA9PiB7XG4gICAgICBpZiAoIWNvbmRpdGlvbmFsU3Vic2NyaXB0aW9uLnB1c2hTdWJzY3JpcHRpb25JZCAmJiBjb25kaXRpb25hbFN1YnNjcmlwdGlvbi5jb25kaXRpb25GdW5jdGlvbihyb3dEYXRhKSkge1xuICAgICAgICBjb25zdCBvZmZzZXQgPSBjb25kaXRpb25hbFN1YnNjcmlwdGlvbi5zdHJlYW1SZXZpc2lvbkZ1bmN0aW9uKHJvd0RhdGEpO1xuXG4gICAgICAgIGNvbnN0IHN1YlF1ZXJ5ID0gX2Nsb25lKGNvbmRpdGlvbmFsU3Vic2NyaXB0aW9uLnF1ZXJ5KTtcblxuICAgICAgICBpZiAoY29uZGl0aW9uYWxTdWJzY3JpcHRpb24ucm93SWRGdW5jdGlvbikge1xuICAgICAgICAgIHN1YlF1ZXJ5LmFnZ3JlZ2F0ZUlkID0gY29uZGl0aW9uYWxTdWJzY3JpcHRpb24ucm93SWRGdW5jdGlvbihyb3dEYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHB1c2hTdWJzY3JpcHRpb25JZCA9IHRoaXMucHVzaFNlcnZpY2Uuc3Vic2NyaWJlKFxuICAgICAgICAgIHN1YlF1ZXJ5LFxuICAgICAgICAgIG9mZnNldCxcbiAgICAgICAgICB0aGlzLFxuICAgICAgICAgIGFzeW5jIChlcnIsIGV2ZW50T2JqLCBvd25lcjIpID0+IHtcbiAgICAgICAgICAgIC8vIG93bmVyIGlzIHBsYXliYWNrc2VydmljZVxuICAgICAgICAgICAgY29uc3Qgc2VsZiA9IG93bmVyMiBhcyBQbGF5YmFja1NlcnZpY2U7XG4gICAgICAgICAgICBjb25zdCByZWdpc3RyYXRpb24gPSBzZWxmLl9wbGF5YmFja1JlZ2lzdHJ5W2NvbmRpdGlvbmFsU3Vic2NyaXB0aW9uLnBsYXliYWNrU3Vic2NyaXB0aW9uSWRdO1xuXG4gICAgICAgICAgICBpZiAoZXZlbnRPYmouYWdncmVnYXRlID09PSAnc3RhdGVzJykge1xuICAgICAgICAgICAgICBjb25zdCB0aGlzU2NyaXB0TmFtZSA9IHJlZ2lzdHJhdGlvbi5zY3JpcHROYW1lO1xuICAgICAgICAgICAgICBjb25zdCBmcm9tRXZlbnQgPSBldmVudE9iai5wYXlsb2FkLl9tZXRhLmZyb21FdmVudDtcbiAgICAgICAgICAgICAgY29uc3QgZXZlbnROYW1lID0gZnJvbUV2ZW50LnBheWxvYWQubmFtZTtcbiAgICAgICAgICAgICAgY29uc3QgdGhpc1BsYXliYWNrU2NyaXB0ID0gd2luZG93W3RoaXNTY3JpcHROYW1lXTtcbiAgICAgICAgICAgICAgY29uc3QgcGxheWJhY2tGdW5jdGlvbiA9IHRoaXNQbGF5YmFja1NjcmlwdC5wbGF5YmFja0ludGVyZmFjZVtldmVudE5hbWVdO1xuXG4gICAgICAgICAgICAgIGlmIChwbGF5YmFja0Z1bmN0aW9uKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RhdGUgPSBldmVudE9iai5wYXlsb2FkO1xuICAgICAgICAgICAgICAgIGNvbnN0IGZ1bmNzID0ge1xuICAgICAgICAgICAgICAgICAgZW1pdDogKHRhcmdldFF1ZXJ5LCBwYXlsb2FkLCBkb25lKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBnZXRQbGF5YmFja0xpc3Q6IChcbiAgICAgICAgICAgICAgICAgICAgcGxheWJhY2tMaXN0TmFtZTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKGVyciwgcGxheWJhY2tMaXN0OiBQbGF5YmFja0xpc3QpID0+IHZvaWRcbiAgICAgICAgICAgICAgICAgICkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVnaXN0cmF0aW9uLnBsYXliYWNrTGlzdCkge1xuICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJlZ2lzdHJhdGlvbi5wbGF5YmFja0xpc3QpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnUGxheWJhY2tMaXN0IGRvZXMgbm90IGV4aXN0IGluIHRoaXMgcmVnaXN0cmF0aW9uJ1xuICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG51bGxcbiAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBjb25zdCBkb25lQ2FsbGJhY2sgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBwbGF5YmFja0Z1bmN0aW9uKHN0YXRlLCBmcm9tRXZlbnQsIGZ1bmNzLCBkb25lQ2FsbGJhY2spO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgIGNvbnN0IHRoaXNTY3JpcHROYW1lID0gcmVnaXN0cmF0aW9uLnNjcmlwdE5hbWU7XG4gICAgICAgICAgICAgIGNvbnN0IHRoaXNQbGF5YmFja1NjcmlwdCA9IHdpbmRvd1t0aGlzU2NyaXB0TmFtZV07XG4gICAgICAgICAgICAgIGNvbnN0IHBsYXliYWNrRnVuY3Rpb24gPSB0aGlzUGxheWJhY2tTY3JpcHQucGxheWJhY2tJbnRlcmZhY2VbZXZlbnRPYmoucGF5bG9hZC5uYW1lXTtcblxuICAgICAgICAgICAgICBpZiAocGxheWJhY2tGdW5jdGlvbikge1xuICAgICAgICAgICAgICAgIC8vIE92ZXJyaWRlIGFnZ3JlZ2F0ZUlkIHRvIGhhbmRsZSBvdGhlciBzdWJzY3JpcHRpb25zXG4gICAgICAgICAgICAgICAgaWYgKHJlZ2lzdHJhdGlvbi5yb3dJZCkge1xuICAgICAgICAgICAgICAgICAgZXZlbnRPYmouYWdncmVnYXRlSWQgPSByZWdpc3RyYXRpb24ucm93SWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHJvdyA9IGNvbmRpdGlvbmFsU3Vic2NyaXB0aW9uLnN0YXRlRnVuY3Rpb25zLmdldFN0YXRlKGV2ZW50T2JqLmFnZ3JlZ2F0ZUlkKTtcbiAgICAgICAgICAgICAgICBjb25zdCBzdGF0ZSA9IHJvdy5kYXRhO1xuICAgICAgICAgICAgICAgIGNvbnN0IGZ1bmNzID0ge1xuICAgICAgICAgICAgICAgICAgZW1pdDogKHRhcmdldFF1ZXJ5LCBwYXlsb2FkLCBkb25lKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBnZXRQbGF5YmFja0xpc3Q6IChcbiAgICAgICAgICAgICAgICAgICAgcGxheWJhY2tMaXN0TmFtZTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKGVyciwgcGxheWJhY2tMaXN0OiBQbGF5YmFja0xpc3QpID0+IHZvaWRcbiAgICAgICAgICAgICAgICAgICkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVnaXN0cmF0aW9uLnBsYXliYWNrTGlzdCkge1xuICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJlZ2lzdHJhdGlvbi5wbGF5YmFja0xpc3QpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnUGxheWJhY2tMaXN0IGRvZXMgbm90IGV4aXN0IGluIHRoaXMgcmVnaXN0cmF0aW9uJ1xuICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG51bGxcbiAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBjb25zdCBkb25lQ2FsbGJhY2sgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAvLyBzdGF0ZUZ1bmN0aW9ucy5zZXRTdGF0ZShyb3cucm93SWQsIHJvdyk7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHBsYXliYWNrRnVuY3Rpb24oc3RhdGUsIGV2ZW50T2JqLCBmdW5jcywgZG9uZUNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgKTtcblxuICAgICAgICAvLyBqdXN0IHVzZSB0aGUgc3Vic2NyaXB0aW9uSWQgdG8gbWFwIHRoZSBwdXNoIHN1YnNjcmlwdGlvbiB0byB0aGUgcGxheWJhY2tcbiAgICAgICAgdGhpcy5fcGxheWJhY2tSZWdpc3RyeVtjb25kaXRpb25hbFN1YnNjcmlwdGlvbi5wbGF5YmFja1N1YnNjcmlwdGlvbklkXSA9IHtcbiAgICAgICAgICBvd25lcjogY29uZGl0aW9uYWxTdWJzY3JpcHRpb24ub3duZXIsXG4gICAgICAgICAgcHVzaFN1YnNjcmlwdGlvbklkOiBwdXNoU3Vic2NyaXB0aW9uSWQsXG4gICAgICAgICAgcGxheWJhY2tMaXN0OiBjb25kaXRpb25hbFN1YnNjcmlwdGlvbi5wbGF5YmFja0xpc3QsXG4gICAgICAgICAgc2NyaXB0TmFtZTogY29uZGl0aW9uYWxTdWJzY3JpcHRpb24uc2NyaXB0TmFtZSxcbiAgICAgICAgICByb3dJZDogcm93SWRcbiAgICAgICAgfTtcblxuICAgICAgICBjb25kaXRpb25hbFN1YnNjcmlwdGlvbi5wdXNoU3Vic2NyaXB0aW9uSWQgPSBwdXNoU3Vic2NyaXB0aW9uSWQ7XG5cbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3N1YnNjcmliZWQgdG8gcGxheWJhY2s6ICcsIHB1c2hTdWJzY3JpcHRpb25JZCwgY29uZGl0aW9uYWxTdWJzY3JpcHRpb24ucXVlcnkpO1xuICAgICAgICByZXR1cm4gcHVzaFN1YnNjcmlwdGlvbklkO1xuICAgICAgfSBlbHNlIGlmICghY29uZGl0aW9uYWxTdWJzY3JpcHRpb24uY29uZGl0aW9uRnVuY3Rpb24ocm93RGF0YSkgJiYgY29uZGl0aW9uYWxTdWJzY3JpcHRpb24ucHVzaFN1YnNjcmlwdGlvbklkKSB7XG4gICAgICAgIHRoaXMucHVzaFNlcnZpY2UudW5zdWJzY3JpYmUoW2NvbmRpdGlvbmFsU3Vic2NyaXB0aW9uLnB1c2hTdWJzY3JpcHRpb25JZF0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIGRlbGV0ZSB0aGlzLl9wbGF5YmFja1JlZ2lzdHJ5W2NvbmRpdGlvbmFsU3Vic2NyaXB0aW9uLnBsYXliYWNrU3Vic2NyaXB0aW9uSWRdO1xuICAgICAgICAgIGNvbmRpdGlvbmFsU3Vic2NyaXB0aW9uLnB1c2hTdWJzY3JpcHRpb25JZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxufVxuIl19