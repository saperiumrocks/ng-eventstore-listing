import * as tslib_1 from "tslib";
import _clone from 'lodash-es/clone';
import { Helpers } from './../utils/helpers';
import { Injectable } from '@angular/core';
import { PushService } from './push.service';
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
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var pushTokens;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pushTokens = playbackTokens.map(function (playbackToken) {
                            return _this._playbackRegistry[playbackToken].pushSubscriptionId;
                        });
                        playbackTokens.forEach(function (token) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var rowId;
                            return tslib_1.__generator(this, function (_a) {
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
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var playbackSubscriptionId, rowData, aggregateId_1, streamRevision, isConditionTrue, pushSubscriptionId;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
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
                        return [4 /*yield*/, this.pushService.subscribe(query, streamRevision, this, function (err, eventObj, owner2) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                var self, registration, thisScriptName, fromEvent_1, eventName, thisPlaybackScript, playbackFunction, state, funcs, doneCallback, thisScriptName, thisPlaybackScript, playbackFunction, row, state, funcs, doneCallback;
                                return tslib_1.__generator(this, function (_a) {
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
        conditionalSubscriptions.forEach(function (conditionalSubscription) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var offset, subQuery, pushSubscriptionId;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                if (!conditionalSubscription.pushSubscriptionId && conditionalSubscription.conditionFunction(rowData)) {
                    offset = conditionalSubscription.streamRevisionFunction(rowData);
                    subQuery = _clone(conditionalSubscription.query);
                    if (conditionalSubscription.rowIdFunction) {
                        subQuery.aggregateId = conditionalSubscription.rowIdFunction(rowData);
                    }
                    pushSubscriptionId = this.pushService.subscribe(subQuery, offset, this, function (err, eventObj, owner2) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        var self, registration, thisScriptName, fromEvent, eventName, thisPlaybackScript, playbackFunction, state, funcs, doneCallback, thisScriptName, thisPlaybackScript, playbackFunction, row, state, funcs, doneCallback;
                        return tslib_1.__generator(this, function (_a) {
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
    PlaybackService = tslib_1.__decorate([
        Injectable()
    ], PlaybackService);
    return PlaybackService;
}());
export { PlaybackService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheWJhY2suc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25nLWV2ZW50c3RvcmUtbGlzdGluZy8iLCJzb3VyY2VzIjpbInNlcnZpY2VzL3BsYXliYWNrLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sTUFBTSxNQUFNLGlCQUFpQixDQUFDO0FBQ3JDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUM3QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQVk3QztJQUtFLHlCQUNVLFdBQXdCO1FBQXhCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBTGxDLHNCQUFpQixHQUFxQixFQUFFLENBQUM7UUFDekMscUNBQWdDLEdBQW9DLEVBQUUsQ0FBQztRQUN2RSw0QkFBdUIsR0FBMkIsRUFBRSxDQUFDO0lBSWxELENBQUM7SUFFSiw4QkFBSSxHQUFKLFVBQUssU0FBaUI7UUFDcEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVLLCtDQUFxQixHQUEzQixVQUE0QixjQUF3Qjs7Ozs7Ozt3QkFFNUMsVUFBVSxHQUFHLGNBQWMsQ0FBQyxHQUFHLENBQUMsVUFBQyxhQUFhOzRCQUNsRCxPQUFPLEtBQUksQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQzt3QkFDbEUsQ0FBQyxDQUFDLENBQUM7d0JBRUgsY0FBYyxDQUFDLE9BQU8sQ0FBQyxVQUFPLEtBQUs7OztnQ0FDM0IsS0FBSyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUM7Z0NBRWxELHlCQUF5QjtnQ0FDekIsc0RBQXNEO2dDQUV0RCxJQUFJLEtBQUssRUFBRTtvQ0FDVCxPQUFPLElBQUksQ0FBQyxnQ0FBZ0MsQ0FBQyxL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QUNGLENBQUMsQ0FBQztJQUNMLENBQUM7O2dCQXRXc0IsV0FBVzs7SUFOdkIsZUFBZTtRQUQzQixVQUFVLEVBQUU7T0FDQSxlQUFlLENBOFczQjtJQUFELHNCQUFDO0NBQUEsQUE5V0QsSUE4V0M7U0E5V1ksZUFBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfY2xvbmUgZnJvbSAnbG9kYXNoLWVzL2Nsb25lJztcbmltcG9ydCB7IEhlbHBlcnMgfSBmcm9tICcuLy4uL3V0aWxzL2hlbHBlcnMnO1xuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUHVzaFNlcnZpY2UgfSBmcm9tICcuL3B1c2guc2VydmljZSc7XG5pbXBvcnQge1xuICBTdGF0ZUZ1bmN0aW9ucyxcbiAgUGxheWJhY2tMaXN0LFxuICBQbGF5YmFja1JlZ2lzdHJ5LFxuICBRdWVyeSxcbiAgQ29uZGl0aW9uYWxTdWJzY3JpcHRpb25SZWdpc3RyeSxcbiAgQ3VzdG9tUGxheWJhY2tDb25maWd1cmF0aW9uXG59IGZyb20gJy4uL21vZGVscyc7XG5pbXBvcnQgeyBDdXN0b21QbGF5YmFja1JlZ2lzdHJ5IH0gZnJvbSAnLi4vbW9kZWxzL2N1c3RvbS1wbGF5YmFjay1yZWdpc3RyeSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBQbGF5YmFja1NlcnZpY2Uge1xuICBfcGxheWJhY2tSZWdpc3RyeTogUGxheWJhY2tSZWdpc3RyeSA9IHt9O1xuICBfY29uZGl0aW9uYWxTdWJzY3JpcHRpb25SZWdpc3RyeTogQ29uZGl0aW9uYWxTdWJzY3JpcHRpb25SZWdpc3RyeSA9IHt9O1xuICBfY3VzdG9tUGxheWJhY2tSZWdpc3RyeTogQ3VzdG9tUGxheWJhY2tSZWdpc3RyeSA9IHt9O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcHVzaFNlcnZpY2U6IFB1c2hTZXJ2aWNlXG4gICkge31cblxuICBpbml0KHNvY2tldFVybDogc3RyaW5nKSB7XG4gICAgdGhpcy5wdXNoU2VydmljZS5pbml0KHNvY2tldFVybCk7XG4gIH1cblxuICBhc3luYyB1bnJlZ2lzdGVyRm9yUGxheWJhY2socGxheWJhY2tUb2tlbnM6IHN0cmluZ1tdKSB7XG4gICAgLy8gdW5yZWdpc3RlciBmcm9tIHBsYXliYWNrIHJlZ2lzdHJ5XG4gICAgY29uc3QgcHVzaFRva2VucyA9IHBsYXliYWNrVG9rZW5zLm1hcCgocGxheWJhY2tUb2tlbikgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuX3BsYXliYWNrUmVnaXN0cnlbcGxheWJhY2tUb2tlbl0ucHVzaFN1YnNjcmlwdGlvbklkO1xuICAgIH0pO1xuXG4gICAgcGxheWJhY2tUb2tlbnMuZm9yRWFjaChhc3luYyAodG9rZW4pID0+IHtcbiAgICAgIGNvbnN0IHJvd0lkID0gdGhpcy5fcGxheWJhY2tSZWdpc3RyeVt0b2tlbl0ucm93SWQ7XG5cbiAgICAgIC8vIGNvbnNvbGUubG9nKCdCRUZPUkUnKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuX2NvbmRpdGlvbmFsU3Vic2NyaXB0aW9uUmVnaXN0cnkpO1xuXG4gICAgICBpZiAocm93SWQpIHtcbiAgICAgICAgZGVsZXRlIHRoaXMuX2NvbmRpdGlvbmFsU3Vic2NyaXB0aW9uUmVnaXN0cnlbcm93SWRdO1xuICAgICAgfVxuXG4gICAgICAvLyBjb25zb2xlLmxvZygnQUZURVInKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuX2NvbmRpdGlvbmFsU3Vic2NyaXB0aW9uUmVnaXN0cnkpO1xuXG4gICAgICAvLyB1bnN1YnNjcmliZSBmcm9tIHB1c2hcbiAgICAgIGRlbGV0ZSB0aGlzLl9wbGF5YmFja1JlZ2lzdHJ5W3Rva2VuXTtcbiAgICB9KTtcblxuICAgIGF3YWl0IHRoaXMucHVzaFNlcnZpY2UudW5zdWJzY3JpYmUocHVzaFRva2Vucyk7XG4gIH1cblxuICBhc3luYyByZWdpc3RlckZvclBsYXliYWNrKFxuICAgIG93bmVyOiBvYmplY3QsXG4gICAgc2NyaXB0TmFtZTogc3RyaW5nLFxuICAgIHF1ZXJ5OiBRdWVyeSxcbiAgICBzdGF0ZUZ1bmN0aW9uczogU3RhdGVGdW5jdGlvbnMsXG4gICAgcGxheWJhY2tMaXN0OiBQbGF5YmFja0xpc3QsXG4gICAgc3RyZWFtUmV2aXNpb25GdW5jdGlvbjogKGl0ZW06IGFueSkgPT4gbnVtYmVyID0gKGl0ZW0pID0+IDAsXG4gICAgcm93SWQ/OiBzdHJpbmcsXG4gICAgY29uZGl0aW9uRnVuY3Rpb24/OiAoaXRlbTogYW55KSA9PiBib29sZWFuLFxuICAgIHJvd0lkRnVuY3Rpb24/OiAoaXRlbTogYW55KSA9PiBzdHJpbmdcbiAgKSB7XG4gICAgY29uc3QgcGxheWJhY2tTdWJzY3JpcHRpb25JZCA9IEhlbHBlcnMuZ2VuZXJhdGVUb2tlbigpO1xuXG4gICAgbGV0IHJvd0RhdGE7XG4gICAgaWYgKHJvd0lkKSB7XG4gICAgICBjb25zdCBhZ2dyZWdhdGVJZCA9IHJvd0lkID8gcm93SWQgOiBxdWVyeS5hZ2dyZWdhdGVJZDtcbiAgICAgIHJvd0RhdGEgPSBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHBsYXliYWNrTGlzdC5nZXQoYWdncmVnYXRlSWQsIChlcnJvciwgaXRlbSkgPT4ge1xuICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzb2x2ZShpdGVtKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBsZXQgc3RyZWFtUmV2aXNpb247XG4gICAgbGV0IGlzQ29uZGl0aW9uVHJ1ZTtcblxuICAgIGlmIChyb3dEYXRhKSB7XG4gICAgICBzdHJlYW1SZXZpc2lvbiA9IHN0cmVhbVJldmlzaW9uRnVuY3Rpb24ocm93RGF0YSk7XG4gICAgICBpc0NvbmRpdGlvblRydWUgPSBjb25kaXRpb25GdW5jdGlvbiA/IChjb25kaXRpb25GdW5jdGlvbihyb3dEYXRhKSA/IHRydWUgOiBmYWxzZSkgOiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgbGV0IHB1c2hTdWJzY3JpcHRpb25JZDtcbiAgICBpZiAoaXNDb25kaXRpb25UcnVlID09PSB0cnVlIHx8IGNvbmRpdGlvbkZ1bmN0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHB1c2hTdWJzY3JpcHRpb25JZCA9IGF3YWl0IHRoaXMucHVzaFNlcnZpY2Uuc3Vic2NyaWJlKFxuICAgICAgICBxdWVyeSxcbiAgICAgICAgc3RyZWFtUmV2aXNpb24sXG4gICAgICAgIHRoaXMsXG4gICAgICAgIGFzeW5jIChlcnIsIGV2ZW50T2JqLCBvd25lcjIpID0+IHtcbiAgICAgICAgICAvLyBvd25lciBpcyBwbGF5YmFja3NlcnZpY2VcbiAgICAgICAgICBjb25zdCBzZWxmID0gb3duZXIyIGFzIFBsYXliYWNrU2VydmljZTtcblxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHNlbGYuX3BsYXliYWNrUmVnaXN0cnkpO1xuXG4gICAgICAgICAgY29uc3QgcmVnaXN0cmF0aW9uID0gc2VsZi5fcGxheWJhY2tSZWdpc3RyeVtwbGF5YmFja1N1YnNjcmlwdGlvbklkXTtcblxuICAgICAgICAgIGlmIChyZWdpc3RyYXRpb24pIHtcbiAgICAgICAgICAgIGlmIChldmVudE9iai5hZ2dyZWdhdGUgPT09ICdzdGF0ZXMnKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHRoaXNTY3JpcHROYW1lID0gcmVnaXN0cmF0aW9uLnNjcmlwdE5hbWU7XG4gICAgICAgICAgICAgIGNvbnN0IGZyb21FdmVudCA9IGV2ZW50T2JqLnBheWxvYWQuX21ldGEuZnJvbUV2ZW50O1xuICAgICAgICAgICAgICBjb25zdCBldmVudE5hbWUgPSBmcm9tRXZlbnQucGF5bG9hZC5uYW1lO1xuICAgICAgICAgICAgICBjb25zdCB0aGlzUGxheWJhY2tTY3JpcHQgPSB3aW5kb3dbdGhpc1NjcmlwdE5hbWVdO1xuICAgICAgICAgICAgICBjb25zdCBwbGF5YmFja0Z1bmN0aW9uID0gdGhpc1BsYXliYWNrU2NyaXB0LnBsYXliYWNrSW50ZXJmYWNlW2V2ZW50TmFtZV07XG5cbiAgICAgICAgICAgICAgaWYgKHBsYXliYWNrRnVuY3Rpb24pIHtcbiAgICAgICAgICAgICAgICBpZiAocmVnaXN0cmF0aW9uLnJvd0lkKSB7XG4gICAgICAgICAgICAgICAgICBldmVudE9iai5hZ2dyZWdhdGVJZCA9IHJlZ2lzdHJhdGlvbi5yb3dJZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RhdGUgPSBldmVudE9iai5wYXlsb2FkO1xuICAgICAgICAgICAgICAgIGNvbnN0IGZ1bmNzID0ge1xuICAgICAgICAgICAgICAgICAgZW1pdDogKHRhcmdldFF1ZXJ5LCBwYXlsb2FkLCBkb25lKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBnZXRQbGF5YmFja0xpc3Q6IChcbiAgICAgICAgICAgICAgICAgICAgcGxheWJhY2tMaXN0TmFtZTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKGVyciwgcGxheWJhY2tMaXN0OiBQbGF5YmFja0xpc3QpID0+IHZvaWRcbiAgICAgICAgICAgICAgICAgICkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVnaXN0cmF0aW9uLnBsYXliYWNrTGlzdCkge1xuICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJlZ2lzdHJhdGlvbi5wbGF5YmFja0xpc3QpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnUGxheWJhY2tMaXN0IGRvZXMgbm90IGV4aXN0IGluIHRoaXMgcmVnaXN0cmF0aW9uJ1xuICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG51bGxcbiAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBjb25zdCBkb25lQ2FsbGJhY2sgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICByZWdpc3RyYXRpb24ucGxheWJhY2tMaXN0LmdldChldmVudE9iai5hZ2dyZWdhdGVJZCwgKGVycm9yLCBpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuX3VwZGF0ZUNvbmRpdGlvbmFsU3Vic2NyaXB0aW9ucyhldmVudE9iai5hZ2dyZWdhdGVJZCwgaXRlbSk7XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgcGxheWJhY2tGdW5jdGlvbihzdGF0ZSwgZnJvbUV2ZW50LCBmdW5jcywgZG9uZUNhbGxiYWNrKTtcblxuICAgICAgICAgICAgICAgIC8vIFJ1biBjdXN0b20gcGxheWJhY2tFdmVudHMgaWYgdGhleSBleGlzdFxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9jdXN0b21QbGF5YmFja1JlZ2lzdHJ5W2V2ZW50TmFtZV0pIHtcbiAgICAgICAgICAgICAgICAgIHRoaXMuX2N1c3RvbVBsYXliYWNrUmVnaXN0cnlbZXZlbnROYW1lXS5mb3JFYWNoKChjdXN0b21QbGF5YmFja0NvbmZpZ3VyYXRpb246IEN1c3RvbVBsYXliYWNrQ29uZmlndXJhdGlvbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjdXN0b21QbGF5YmFja0NvbmZpZ3VyYXRpb24ucGxheWJhY2tGdW5jdGlvbihmcm9tRXZlbnQpO1xuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjb25zdCB0aGlzU2NyaXB0TmFtZSA9IHJlZ2lzdHJhdGlvbi5zY3JpcHROYW1lO1xuICAgICAgICAgICAgICBjb25zdCB0aGlzUGxheWJhY2tTY3JpcHQgPSB3aW5kb3dbdGhpc1NjcmlwdE5hbWVdO1xuICAgICAgICAgICAgICBjb25zdCBwbGF5YmFja0Z1bmN0aW9uID0gdGhpc1BsYXliYWNrU2NyaXB0LnBsYXliYWNrSW50ZXJmYWNlW2V2ZW50T2JqLnBheWxvYWQubmFtZV07XG5cbiAgICAgICAgICAgICAgaWYgKHBsYXliYWNrRnVuY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAvLyBPdmVycmlkZSBhZ2dyZWdhdGVJZCB0byBoYW5kbGUgb3RoZXIgc3Vic2NyaXB0aW9uc1xuICAgICAgICAgICAgICAgIGlmIChyZWdpc3RyYXRpb24ucm93SWQpIHtcbiAgICAgICAgICAgICAgICAgIGV2ZW50T2JqLmFnZ3JlZ2F0ZUlkID0gcmVnaXN0cmF0aW9uLnJvd0lkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCByb3cgPSBzdGF0ZUZ1bmN0aW9ucy5nZXRTdGF0ZShldmVudE9iai5hZ2dyZWdhdGVJZCk7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RhdGUgPSByb3cuZGF0YTtcbiAgICAgICAgICAgICAgICBjb25zdCBmdW5jcyA9IHtcbiAgICAgICAgICAgICAgICAgIGVtaXQ6ICh0YXJnZXRRdWVyeSwgcGF5bG9hZCwgZG9uZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgZ2V0UGxheWJhY2tMaXN0OiAoXG4gICAgICAgICAgICAgICAgICAgIHBsYXliYWNrTGlzdE5hbWU6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IChlcnIsIHBsYXliYWNrTGlzdDogUGxheWJhY2tMaXN0KSA9PiB2b2lkXG4gICAgICAgICAgICAgICAgICApID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlZ2lzdHJhdGlvbi5wbGF5YmFja0xpc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCByZWdpc3RyYXRpb24ucGxheWJhY2tMaXN0KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ1BsYXliYWNrTGlzdCBkb2VzIG5vdCBleGlzdCBpbiB0aGlzIHJlZ2lzdHJhdGlvbidcbiAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgY29uc3QgZG9uZUNhbGxiYWNrID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgcmVnaXN0cmF0aW9uLnBsYXliYWNrTGlzdC5nZXQoZXZlbnRPYmouYWdncmVnYXRlSWQsIChlcnJvciwgaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLl91cGRhdGVDb25kaXRpb25hbFN1YnNjcmlwdGlvbnMoZXZlbnRPYmouYWdncmVnYXRlSWQsIGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHBsYXliYWNrRnVuY3Rpb24oc3RhdGUsIGV2ZW50T2JqLCBmdW5jcywgZG9uZUNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICAvLyBSdW4gY3VzdG9tIHBsYXliYWNrRXZlbnRzIGlmIHRoZXkgZXhpc3RcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fY3VzdG9tUGxheWJhY2tSZWdpc3RyeVtldmVudE9iai5wYXlsb2FkLm5hbWVdKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLl9jdXN0b21QbGF5YmFja1JlZ2lzdHJ5W2V2ZW50T2JqLnBheWxvYWQubmFtZV0uZm9yRWFjaChcbiAgICAgICAgICAgICAgICAgICAgKGN1c3RvbVBsYXliYWNrQ29uZmlndXJhdGlvbjogQ3VzdG9tUGxheWJhY2tDb25maWd1cmF0aW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgY3VzdG9tUGxheWJhY2tDb25maWd1cmF0aW9uLnBsYXliYWNrRnVuY3Rpb24oZXZlbnRPYmopO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gSWYgY29uZGl0aW9uIGV4aXN0cywgcmVnaXN0ZXIgaW4gY29uZGl0aW9uYWwgcmVnaXN0cnlcbiAgICBpZiAoY29uZGl0aW9uRnVuY3Rpb24pIHtcbiAgICAgIGlmICh0aGlzLl9jb25kaXRpb25hbFN1YnNjcmlwdGlvblJlZ2lzdHJ5W3Jvd0lkXSAmJiBBcnJheS5pc0FycmF5KHRoaXMuX2NvbmRpdGlvbmFsU3Vic2NyaXB0aW9uUmVnaXN0cnlbcm93SWRdKSkge1xuICAgICAgICB0aGlzLl9jb25kaXRpb25hbFN1YnNjcmlwdGlvblJlZ2lzdHJ5W3Jvd0lkXS5wdXNoKHtcbiAgICAgICAgICBwbGF5YmFja0xpc3Q6IHBsYXliYWNrTGlzdCxcbiAgICAgICAgICBzY3JpcHROYW1lOiBzY3JpcHROYW1lLFxuICAgICAgICAgIG93bmVyOiBvd25lcixcbiAgICAgICAgICBzdGF0ZUZ1bmN0aW9uczogc3RhdGVGdW5jdGlvbnMsXG4gICAgICAgICAgcXVlcnk6IHF1ZXJ5LFxuICAgICAgICAgIHN0cmVhbVJldmlzaW9uRnVuY3Rpb246IHN0cmVhbVJldmlzaW9uRnVuY3Rpb24sXG4gICAgICAgICAgY29uZGl0aW9uRnVuY3Rpb246IGNvbmRpdGlvbkZ1bmN0aW9uLFxuICAgICAgICAgIHB1c2hTdWJzY3JpcHRpb25JZDogcHVzaFN1YnNjcmlwdGlvbklkLFxuICAgICAgICAgIHBsYXliYWNrU3Vic2NyaXB0aW9uSWQ6IHBsYXliYWNrU3Vic2NyaXB0aW9uSWQsXG4gICAgICAgICAgcm93SWRGdW5jdGlvbjogcm93SWRGdW5jdGlvblxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2NvbmRpdGlvbmFsU3Vic2NyaXB0aW9uUmVnaXN0cnlbcm93SWRdID0gW3tcbiAgICAgICAgICBwbGF5YmFja0xpc3Q6IHBsYXliYWNrTGlzdCxcbiAgICAgICAgICBzY3JpcHROYW1lOiBzY3JpcHROYW1lLFxuICAgICAgICAgIG93bmVyOiBvd25lcixcbiAgICAgICAgICBzdGF0ZUZ1bmN0aW9uczogc3RhdGVGdW5jdGlvbnMsXG4gICAgICAgICAgcXVlcnk6IHF1ZXJ5LFxuICAgICAgICAgIHN0cmVhbVJldmlzaW9uRnVuY3Rpb246IHN0cmVhbVJldmlzaW9uRnVuY3Rpb24sXG4gICAgICAgICAgY29uZGl0aW9uRnVuY3Rpb246IGNvbmRpdGlvbkZ1bmN0aW9uLFxuICAgICAgICAgIHB1c2hTdWJzY3JpcHRpb25JZDogcHVzaFN1YnNjcmlwdGlvbklkLFxuICAgICAgICAgIHBsYXliYWNrU3Vic2NyaXB0aW9uSWQ6IHBsYXliYWNrU3Vic2NyaXB0aW9uSWQsXG4gICAgICAgICAgcm93SWRGdW5jdGlvbjogcm93SWRGdW5jdGlvblxuICAgICAgICB9XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLl9wbGF5YmFja1JlZ2lzdHJ5W3BsYXliYWNrU3Vic2NyaXB0aW9uSWRdID0ge1xuICAgICAgb3duZXI6IG93bmVyLFxuICAgICAgcHVzaFN1YnNjcmlwdGlvbklkOiBwdXNoU3Vic2NyaXB0aW9uSWQsXG4gICAgICBwbGF5YmFja0xpc3Q6IHBsYXliYWNrTGlzdCxcbiAgICAgIHNjcmlwdE5hbWU6IHNjcmlwdE5hbWUsXG4gICAgICByb3dJZDogcm93SWRcbiAgICB9O1xuXG4gICAgcmV0dXJuIHBsYXliYWNrU3Vic2NyaXB0aW9uSWQ7XG4gIH1cblxuICByZWdpc3RlckN1c3RvbVBsYXliYWNrcyhjdXN0b21QbGF5YmFja0NvbmZpZ3VyYXRpb25zOiBDdXN0b21QbGF5YmFja0NvbmZpZ3VyYXRpb25bXSkge1xuICAgIGN1c3RvbVBsYXliYWNrQ29uZmlndXJhdGlvbnMuZm9yRWFjaCgoY3VzdG9tUGxheWJhY2tDb25maWd1cmF0aW9uOiBDdXN0b21QbGF5YmFja0NvbmZpZ3VyYXRpb24pID0+IHtcbiAgICAgIGlmICghdGhpcy5fY3VzdG9tUGxheWJhY2tSZWdpc3RyeVtjdXN0b21QbGF5YmFja0NvbmZpZ3VyYXRpb24uZXZlbnROYW1lXSkge1xuICAgICAgICB0aGlzLl9jdXN0b21QbGF5YmFja1JlZ2lzdHJ5W2N1c3RvbVBsYXliYWNrQ29uZmlndXJhdGlvbi5ldmVudE5hbWVdID0gW107XG4gICAgICB9XG4gICAgICB0aGlzLl9jdXN0b21QbGF5YmFja1JlZ2lzdHJ5W2N1c3RvbVBsYXliYWNrQ29uZmlndXJhdGlvbi5ldmVudE5hbWVdLnB1c2goY3VzdG9tUGxheWJhY2tDb25maWd1cmF0aW9uKTtcbiAgICB9KTtcbiAgfVxuXG4gIHJlc2V0Q3VzdG9tUGxheWJhY2tzKCkge1xuICAgIHRoaXMuX2N1c3RvbVBsYXliYWNrUmVnaXN0cnkgPSB7fTtcbiAgfVxuXG4gIF91cGRhdGVDb25kaXRpb25hbFN1YnNjcmlwdGlvbnMocm93SWQsIHJvd0RhdGEpIHtcbiAgICBjb25zdCBjb25kaXRpb25hbFN1YnNjcmlwdGlvbnMgPSB0aGlzLl9jb25kaXRpb25hbFN1YnNjcmlwdGlvblJlZ2lzdHJ5W3Jvd0lkXSB8fCBbXTtcbiAgICBjb25kaXRpb25hbFN1YnNjcmlwdGlvbnMuZm9yRWFjaChhc3luYyAoY29uZGl0aW9uYWxTdWJzY3JpcHRpb24pID0+IHtcbiAgICAgIGlmICghY29uZGl0aW9uYWxTdWJzY3JpcHRpb24ucHVzaFN1YnNjcmlwdGlvbklkICYmIGNvbmRpdGlvbmFsU3Vic2NyaXB0aW9uLmNvbmRpdGlvbkZ1bmN0aW9uKHJvd0RhdGEpKSB7XG4gICAgICAgIGNvbnN0IG9mZnNldCA9IGNvbmRpdGlvbmFsU3Vic2NyaXB0aW9uLnN0cmVhbVJldmlzaW9uRnVuY3Rpb24ocm93RGF0YSk7XG5cbiAgICAgICAgY29uc3Qgc3ViUXVlcnkgPSBfY2xvbmUoY29uZGl0aW9uYWxTdWJzY3JpcHRpb24ucXVlcnkpO1xuXG4gICAgICAgIGlmIChjb25kaXRpb25hbFN1YnNjcmlwdGlvbi5yb3dJZEZ1bmN0aW9uKSB7XG4gICAgICAgICAgc3ViUXVlcnkuYWdncmVnYXRlSWQgPSBjb25kaXRpb25hbFN1YnNjcmlwdGlvbi5yb3dJZEZ1bmN0aW9uKHJvd0RhdGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcHVzaFN1YnNjcmlwdGlvbklkID0gdGhpcy5wdXNoU2VydmljZS5zdWJzY3JpYmUoXG4gICAgICAgICAgc3ViUXVlcnksXG4gICAgICAgICAgb2Zmc2V0LFxuICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgYXN5bmMgKGVyciwgZXZlbnRPYmosIG93bmVyMikgPT4ge1xuICAgICAgICAgICAgLy8gb3duZXIgaXMgcGxheWJhY2tzZXJ2aWNlXG4gICAgICAgICAgICBjb25zdCBzZWxmID0gb3duZXIyIGFzIFBsYXliYWNrU2VydmljZTtcbiAgICAgICAgICAgIGNvbnN0IHJlZ2lzdHJhdGlvbiA9IHNlbGYuX3BsYXliYWNrUmVnaXN0cnlbY29uZGl0aW9uYWxTdWJzY3JpcHRpb24ucGxheWJhY2tTdWJzY3JpcHRpb25JZF07XG5cbiAgICAgICAgICAgIGlmIChldmVudE9iai5hZ2dyZWdhdGUgPT09ICdzdGF0ZXMnKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHRoaXNTY3JpcHROYW1lID0gcmVnaXN0cmF0aW9uLnNjcmlwdE5hbWU7XG4gICAgICAgICAgICAgIGNvbnN0IGZyb21FdmVudCA9IGV2ZW50T2JqLnBheWxvYWQuX21ldGEuZnJvbUV2ZW50O1xuICAgICAgICAgICAgICBjb25zdCBldmVudE5hbWUgPSBmcm9tRXZlbnQucGF5bG9hZC5uYW1lO1xuICAgICAgICAgICAgICBjb25zdCB0aGlzUGxheWJhY2tTY3JpcHQgPSB3aW5kb3dbdGhpc1NjcmlwdE5hbWVdO1xuICAgICAgICAgICAgICBjb25zdCBwbGF5YmFja0Z1bmN0aW9uID0gdGhpc1BsYXliYWNrU2NyaXB0LnBsYXliYWNrSW50ZXJmYWNlW2V2ZW50TmFtZV07XG5cbiAgICAgICAgICAgICAgaWYgKHBsYXliYWNrRnVuY3Rpb24pIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzdGF0ZSA9IGV2ZW50T2JqLnBheWxvYWQ7XG4gICAgICAgICAgICAgICAgY29uc3QgZnVuY3MgPSB7XG4gICAgICAgICAgICAgICAgICBlbWl0OiAodGFyZ2V0UXVlcnksIHBheWxvYWQsIGRvbmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIGdldFBsYXliYWNrTGlzdDogKFxuICAgICAgICAgICAgICAgICAgICBwbGF5YmFja0xpc3ROYW1lOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoZXJyLCBwbGF5YmFja0xpc3Q6IFBsYXliYWNrTGlzdCkgPT4gdm9pZFxuICAgICAgICAgICAgICAgICAgKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZWdpc3RyYXRpb24ucGxheWJhY2tMaXN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVnaXN0cmF0aW9uLnBsYXliYWNrTGlzdCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdQbGF5YmFja0xpc3QgZG9lcyBub3QgZXhpc3QgaW4gdGhpcyByZWdpc3RyYXRpb24nXG4gICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgICAgbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGRvbmVDYWxsYmFjayA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHBsYXliYWNrRnVuY3Rpb24oc3RhdGUsIGZyb21FdmVudCwgZnVuY3MsIGRvbmVDYWxsYmFjayk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgY29uc3QgdGhpc1NjcmlwdE5hbWUgPSByZWdpc3RyYXRpb24uc2NyaXB0TmFtZTtcbiAgICAgICAgICAgICAgY29uc3QgdGhpc1BsYXliYWNrU2NyaXB0ID0gd2luZG93W3RoaXNTY3JpcHROYW1lXTtcbiAgICAgICAgICAgICAgY29uc3QgcGxheWJhY2tGdW5jdGlvbiA9IHRoaXNQbGF5YmFja1NjcmlwdC5wbGF5YmFja0ludGVyZmFjZVtldmVudE9iai5wYXlsb2FkLm5hbWVdO1xuXG4gICAgICAgICAgICAgIGlmIChwbGF5YmFja0Z1bmN0aW9uKSB7XG4gICAgICAgICAgICAgICAgLy8gT3ZlcnJpZGUgYWdncmVnYXRlSWQgdG8gaGFuZGxlIG90aGVyIHN1YnNjcmlwdGlvbnNcbiAgICAgICAgICAgICAgICBpZiAocmVnaXN0cmF0aW9uLnJvd0lkKSB7XG4gICAgICAgICAgICAgICAgICBldmVudE9iai5hZ2dyZWdhdGVJZCA9IHJlZ2lzdHJhdGlvbi5yb3dJZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3Qgcm93ID0gY29uZGl0aW9uYWxTdWJzY3JpcHRpb24uc3RhdGVGdW5jdGlvbnMuZ2V0U3RhdGUoZXZlbnRPYmouYWdncmVnYXRlSWQpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0YXRlID0gcm93LmRhdGE7XG4gICAgICAgICAgICAgICAgY29uc3QgZnVuY3MgPSB7XG4gICAgICAgICAgICAgICAgICBlbWl0OiAodGFyZ2V0UXVlcnksIHBheWxvYWQsIGRvbmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIGdldFBsYXliYWNrTGlzdDogKFxuICAgICAgICAgICAgICAgICAgICBwbGF5YmFja0xpc3ROYW1lOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoZXJyLCBwbGF5YmFja0xpc3Q6IFBsYXliYWNrTGlzdCkgPT4gdm9pZFxuICAgICAgICAgICAgICAgICAgKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZWdpc3RyYXRpb24ucGxheWJhY2tMaXN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVnaXN0cmF0aW9uLnBsYXliYWNrTGlzdCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdQbGF5YmFja0xpc3QgZG9lcyBub3QgZXhpc3QgaW4gdGhpcyByZWdpc3RyYXRpb24nXG4gICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgICAgbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGRvbmVDYWxsYmFjayA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgIC8vIHN0YXRlRnVuY3Rpb25zLnNldFN0YXRlKHJvdy5yb3dJZCwgcm93KTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgcGxheWJhY2tGdW5jdGlvbihzdGF0ZSwgZXZlbnRPYmosIGZ1bmNzLCBkb25lQ2FsbGJhY2spO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgICAgIC8vIGp1c3QgdXNlIHRoZSBzdWJzY3JpcHRpb25JZCB0byBtYXAgdGhlIHB1c2ggc3Vic2NyaXB0aW9uIHRvIHRoZSBwbGF5YmFja1xuICAgICAgICB0aGlzLl9wbGF5YmFja1JlZ2lzdHJ5W2NvbmRpdGlvbmFsU3Vic2NyaXB0aW9uLnBsYXliYWNrU3Vic2NyaXB0aW9uSWRdID0ge1xuICAgICAgICAgIG93bmVyOiBjb25kaXRpb25hbFN1YnNjcmlwdGlvbi5vd25lcixcbiAgICAgICAgICBwdXNoU3Vic2NyaXB0aW9uSWQ6IHB1c2hTdWJzY3JpcHRpb25JZCxcbiAgICAgICAgICBwbGF5YmFja0xpc3Q6IGNvbmRpdGlvbmFsU3Vic2NyaXB0aW9uLnBsYXliYWNrTGlzdCxcbiAgICAgICAgICBzY3JpcHROYW1lOiBjb25kaXRpb25hbFN1YnNjcmlwdGlvbi5zY3JpcHROYW1lLFxuICAgICAgICAgIHJvd0lkOiByb3dJZFxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbmRpdGlvbmFsU3Vic2NyaXB0aW9uLnB1c2hTdWJzY3JpcHRpb25JZCA9IHB1c2hTdWJzY3JpcHRpb25JZDtcblxuICAgICAgICAvLyBjb25zb2xlLmxvZygnc3Vic2NyaWJlZCB0byBwbGF5YmFjazogJywgcHVzaFN1YnNjcmlwdGlvbklkLCBjb25kaXRpb25hbFN1YnNjcmlwdGlvbi5xdWVyeSk7XG4gICAgICAgIHJldHVybiBwdXNoU3Vic2NyaXB0aW9uSWQ7XG4gICAgICB9IGVsc2UgaWYgKCFjb25kaXRpb25hbFN1YnNjcmlwdGlvbi5jb25kaXRpb25GdW5jdGlvbihyb3dEYXRhKSAmJiBjb25kaXRpb25hbFN1YnNjcmlwdGlvbi5wdXNoU3Vic2NyaXB0aW9uSWQpIHtcbiAgICAgICAgdGhpcy5wdXNoU2VydmljZS51bnN1YnNjcmliZShbY29uZGl0aW9uYWxTdWJzY3JpcHRpb24ucHVzaFN1YnNjcmlwdGlvbklkXSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgZGVsZXRlIHRoaXMuX3BsYXliYWNrUmVnaXN0cnlbY29uZGl0aW9uYWxTdWJzY3JpcHRpb24ucGxheWJhY2tTdWJzY3JpcHRpb25JZF07XG4gICAgICAgICAgY29uZGl0aW9uYWxTdWJzY3JpcHRpb24ucHVzaFN1YnNjcmlwdGlvbklkID0gdW5kZWZpbmVkO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG59XG4iXX0=