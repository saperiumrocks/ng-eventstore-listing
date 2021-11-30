import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Helpers } from '../utils/helpers.js';
import _forOwn from 'lodash-es/forOwn';
import _clone from 'lodash-es/clone';
import * as io from 'socket.io-client';
var PushService = /** @class */ (function () {
    function PushService() {
        this.subscriptions = {};
    }
    PushService.prototype.init = function (socketUrl) {
        var _this = this;
        if (!this.ioPush) {
            this.ioPush = io.connect(socketUrl + "/events");
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
    PushService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [])
    ], PushService);
    return PushService;
}());
export { PushService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVzaC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmctZXZlbnRzdG9yZS1saXN0aW5nLyIsInNvdXJjZXMiOlsic2VydmljZXMvcHVzaC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUM5QyxPQUFPLE9BQU8sTUFBTSxrQkFBa0IsQ0FBQztBQUN2QyxPQUFPLE1BQU0sTUFBTSxpQkFBaUIsQ0FBQztBQUNyQyxPQUFPLEtBQUssRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBR3ZDO0lBR0U7UUFEUSxrQkFBYSxHQUFRLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBRWpCLDBCQUFJLEdBQUosVUFBSyxTQUFpQjtRQUF0QixpQkE2QkM7UUE1QkMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDaEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFJLFNBQVMsWUFBUyxDQUFDLENBQUM7WUFFaEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLFVBQUMsUUFBUTtnQkFDakMsS0FBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMvQixDQUFDLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRTtnQkFDMUIsb0NBQW9DO2dCQUNwQywwQ0FBMEM7Z0JBQ3hDLG1DQUFtQztnQkFDbkMsT0FBTyxDQUFDLEtBQUksQ0FBQyxhQUFhLEVBQUUsVUFBQyxHQUFHO29CQUM5QixJQUFNLGlCQUFpQixHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTt3QkFDakQsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNO3FCQUNuQixDQUFDLENBQUM7b0JBRUgsS0FBSSxD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QUFFLENBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7b0JBQ3pDLENBQUMsQ0FBQyxDQUFDO2lCQUNKO1lBQ0gsQ0FBQyxDQUFDLENBQUM7U0FDSjtRQUVELE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFFRCxpQ0FBVyxHQUFYLFVBQVksVUFBb0I7UUFBaEMsaUJBb0JDO1FBbkJDLElBQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQztRQUV4QixVQUFVLENBQUMsT0FBTyxDQUFDLFVBQUMsU0FBUztZQUMzQixJQUFJLEtBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLEVBQUU7Z0JBQ2pDLElBQU0sa0JBQWtCLEdBQUcsTUFBTSxDQUFDLEtBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDakUsT0FBTyxLQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUVyQyxJQUFNLEdBQUcsR0FBRyxrQkFBa0IsQ0FBQztnQkFDL0IsSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRTtvQkFDcEIsWUFBWSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQzlCO2FBQ0Y7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTTtZQUNqQyxLQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsWUFBWSxFQUFFO2dCQUM1QyxPQUFPLEVBQUUsQ0FBQztZQUNaLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBOUlVLFdBQVc7UUFEdkIsVUFBVSxFQUFFOztPQUNBLFdBQVcsQ0ErSXZCO0lBQUQsa0JBQUM7Q0FBQSxBQS9JRCxJQStJQztTQS9JWSxXQUFXIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSGVscGVycyB9IGZyb20gJy4uL3V0aWxzL2hlbHBlcnMuanMnO1xuaW1wb3J0IF9mb3JPd24gZnJvbSAnbG9kYXNoLWVzL2Zvck93bic7XG5pbXBvcnQgX2Nsb25lIGZyb20gJ2xvZGFzaC1lcy9jbG9uZSc7XG5pbXBvcnQgKiBhcyBpbyBmcm9tICdzb2NrZXQuaW8tY2xpZW50JztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFB1c2hTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBpb1B1c2g6IGFueTtcbiAgcHJpdmF0ZSBzdWJzY3JpcHRpb25zOiBhbnkgPSB7fTtcbiAgY29uc3RydWN0b3IoKSB7IH1cblxuICBpbml0KHNvY2tldFVybDogc3RyaW5nKSB7XG4gICAgaWYgKCF0aGlzLmlvUHVzaCkge1xuICAgICAgdGhpcy5pb1B1c2ggPSBpby5jb25uZWN0KGAke3NvY2tldFVybH0vZXZlbnRzYCk7XG5cbiAgICAgIHRoaXMuaW9QdXNoLm9uKCdtZXNzYWdlJywgKGV2ZW50T2JqKSA9PiB7XG4gICAgICAgIHRoaXMuX3Byb2Nlc3NFdmVudChldmVudE9iaik7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5pb1B1c2gub24oJ3JlY29ubmVjdCcsICgpID0+IHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ1RFU1QgUkVDT05ORUNUSU9OJyk7XG4gICAgICAgIC8vIHRoaXMuaW9QdXNoLmVtaXQoJ3Jlc3Vic2NyaWJlJywgKCkgPT4ge1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuc3Vic2NyaXB0aW9ucyk7XG4gICAgICAgICAgX2Zvck93bih0aGlzLnN1YnNjcmlwdGlvbnMsIChzdWIpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHN1YnNjcmlwdGlvblF1ZXJ5ID0gT2JqZWN0LmFzc2lnbihzdWIucXVlcnksIHtcbiAgICAgICAgICAgICAgb2Zmc2V0OiBzdWIub2Zmc2V0LFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuaW9QdXNoLmVtaXQoJ3N1YnNjcmliZScsIHN1YnNjcmlwdGlvblF1ZXJ5LCAodG9rZW46IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnUmVjb25uZWN0ZWQ6JywgdG9rZW4sIHN1YnNjcmlwdGlvblF1ZXJ5KTtcbiAgICAgICAgICAgICAgICBzdWIudG9rZW4gPSB0b2tlbjtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdSZWNvbm5lY3QgZXJyb3IgZm9yIHF1ZXJ5Jywgc3Vic2NyaXB0aW9uUXVlcnkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgLy8gfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBfcHJvY2Vzc0V2ZW50KGV2ZW50T2JqOiBhbnkpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAvLyBjb25zb2xlLmxvZygnZ290IG1lc3NhZ2UgZnJvbSBwdXNoIHNlcnZlcjogJywgZXZlbnRPYmopO1xuICAgIGNvbnN0IHF1ZXJ5S2V5ID0gYCR7ZXZlbnRPYmouY29udGV4dH0uJHtldmVudE9iai5hZ2dyZWdhdGV9LiR7ZXZlbnRPYmouYWdncmVnYXRlSWR9YDtcbiAgICBjb25zdCBjbGllbnRUb2tlbnMgPSBPYmplY3Qua2V5cyhzZWxmLnN1YnNjcmlwdGlvbnMpO1xuICAgIC8vIHJlZGlyZWN0IHRvIG1hcHBlZCBzdWJzY3JpcHRpb24vdG9rZW4gY2FsbGJhY2tcbiAgICBjbGllbnRUb2tlbnMuZm9yRWFjaCgoY2xpZW50VG9rZW4pID0+IHtcbiAgICAgIGNvbnN0IHN1YiA9IHNlbGYuc3Vic2NyaXB0aW9uc1tjbGllbnRUb2tlbl07XG4gICAgICBpZiAoc3ViKSB7XG4gICAgICAgIGNvbnN0IHN1YlF1ZXJ5S2V5ID0gYCR7c3ViLnF1ZXJ5LmNvbnRleHR9LiR7c3ViLnF1ZXJ5LmFnZ3JlZ2F0ZX0uJHtzdWIucXVlcnkuYWdncmVnYXRlSWR9YDtcbiAgICAgICAgaWYgKHN1YlF1ZXJ5S2V5ID09PSBxdWVyeUtleSkge1xuICAgICAgICAgIC8vIHVwZGF0ZSBuZXh0IG9mZnNldCAoZnJvbSBzdHJlYW0gcmV2aXNpb24pIGZvciB0aGlzIHN1YnNjcmlwdGlvbiwgc28gZm9yIHJlY29ubmVjdGluZ1xuICAgICAgICAgIGlmICghaXNOYU4oZXZlbnRPYmouc3RyZWFtUmV2aXNpb24pKSB7XG4gICAgICAgICAgICBzdWIub2Zmc2V0ID0gZXZlbnRPYmouc3RyZWFtUmV2aXNpb24gKyAxO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodHlwZW9mIHN1Yi5jYiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgc3ViLmNiKHVuZGVmaW5lZCwgZXZlbnRPYmosIHN1Yi5vd25lciwgY2xpZW50VG9rZW4pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIGl0ZXJhdGUgb24gbW9uaXRvcnMgbWV0YSB0YWdzXG4gICAgICAgICAgY29uc3QgdGFncyA9IE9iamVjdC5rZXlzKHN1Yi5tb25pdG9yVGFncyk7XG4gICAgICAgICAgdGFncy5mb3JFYWNoKCh0YWcpID0+IHtcbiAgICAgICAgICAgIC8vIGNoZWNrIGZvciBzdGF0ZS9ldmVudFNvdXJjZS5fbWV0YSBvciBldmVudC5fbWV0YVxuICAgICAgICAgICAgaWYgKGV2ZW50T2JqLl9tZXRhICYmIGV2ZW50T2JqLl9tZXRhLnRhZyA9PT0gdGFnKSB7XG4gICAgICAgICAgICAgIGxldCByZWFzb24gPSAnTi9BJztcbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiBldmVudE9iai5ldmVudFR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgcmVhc29uID0gZXZlbnRPYmouZXZlbnRUeXBlO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBldmVudE9iai5zdGF0ZVR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgcmVhc29uID0gZXZlbnRPYmouc3RhdGVUeXBlO1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgIGV2ZW50T2JqLmV2ZW50U291cmNlICYmXG4gICAgICAgICAgICAgICAgICB0eXBlb2YgZXZlbnRPYmouZXZlbnRTb3VyY2UuZXZlbnRUeXBlID09PSAnc3RyaW5nJ1xuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgcmVhc29uICs9IGAgPC0gJHtldmVudE9iai5ldmVudFNvdXJjZS5ldmVudFR5cGV9YDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLy8gaXRlcmF0ZSBvbiB0aGUgbW9uaXRvcnNcbiAgICAgICAgICAgICAgY29uc3QgbW9uaXRvcnMgPSBzdWIubW9uaXRvclRhZ3NbdGFnXTtcbiAgICAgICAgICAgICAgbW9uaXRvcnMuZm9yRWFjaCgobW9uaXRvcikgPT4ge1xuICAgICAgICAgICAgICAgIG1vbml0b3IuY2FsbGJhY2socmVhc29uLCBldmVudE9iai5fbWV0YSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBzdWJzY3JpYmUocXVlcnksIG9mZnNldCwgb3duZXIsIGNiKSB7XG4gICAgLy8gYXdhaXQgdGhpcy53YWl0Rm9yU29ja2V0Q29ubmVjdGlvbigpO1xuICAgIGNvbnN0IHB1c2hUb2tlbiA9IEhlbHBlcnMuZ2VuZXJhdGVUb2tlbigpO1xuICAgIC8vIG1hcCBuZXcgc3Vic2NyaXB0aW9uLCB0aGVuIHRyeSB0byBzdWJzY3JpYmUgdG8gc2VydmVyIGFzYXBcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnNbcHVzaFRva2VuXSA9IHtcbiAgICAgIHF1ZXJ5OiBxdWVyeSxcbiAgICAgIG9mZnNldDogb2Zmc2V0LFxuICAgICAgb3duZXI6IG93bmVyLFxuICAgICAgY2I6IGNiLFxuICAgICAgbW9uaXRvclRhZ3M6IHt9LFxuICAgIH07XG5cbiAgICBjb25zdCBzdWIgPSB0aGlzLnN1YnNjcmlwdGlvbnNbcHVzaFRva2VuXTtcbiAgICBpZiAoc3ViICYmICFzdWIudG9rZW4pIHtcbiAgICAgIC8vIGJ1aWxkIHVwIHByb3BlciBzdWJzY3JpYmUgcmVxdWVzdCBxdWVyeVxuICAgICAgY29uc3Qgc3Vic2NyaXB0aW9uUXVlcnkgPSBPYmplY3QuYXNzaWduKHN1Yi5xdWVyeSwge1xuICAgICAgICBvZmZzZXQ6IHN1Yi5vZmZzZXQsXG4gICAgICB9KTtcblxuICAgICAgdGhpcy5pb1B1c2guZW1pdCgnc3Vic2NyaWJlJywgc3Vic2NyaXB0aW9uUXVlcnksICh7IHN1YnNjcmlwdGlvblRva2VuLCBjYXRjaFVwRXZlbnRzIH0pID0+IHtcbiAgICAgICAgaWYgKHN1YnNjcmlwdGlvblRva2VuKSB7XG4gICAgICAgICAgLy8gY29uc29sZS5sb2coJ1NlcnZlciBTdWJzY3JpYmVkOicsIHRva2VuLCBzdWJzY3JpcHRpb25RdWVyeSk7XG4gICAgICAgICAgc3ViLnRva2VuID0gc3Vic2NyaXB0aW9uVG9rZW47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignU3Vic2NyaWJlIGVycm9yIGZvciBxdWVyeScsIHN1YnNjcmlwdGlvblF1ZXJ5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjYXRjaFVwRXZlbnRzICYmIGNhdGNoVXBFdmVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGNhdGNoVXBFdmVudHMuZm9yRWFjaCgoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGNiKHVuZGVmaW5lZCwgZXZlbnQsIG93bmVyLCBwdXNoVG9rZW4pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcHVzaFRva2VuO1xuICB9XG5cbiAgdW5zdWJzY3JpYmUocHVzaFRva2Vuczogc3RyaW5nW10pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBzb2NrZXRUb2tlbnMgPSBbXTtcblxuICAgIHB1c2hUb2tlbnMuZm9yRWFjaCgocHVzaFRva2VuKSA9PiB7XG4gICAgICBpZiAodGhpcy5zdWJzY3JpcHRpb25zW3B1c2hUb2tlbl0pIHtcbiAgICAgICAgY29uc3QgY2xpZW50U3Vic2NyaXB0aW9uID0gX2Nsb25lKHRoaXMuc3Vic2NyaXB0aW9uc1twdXNoVG9rZW5dKTtcbiAgICAgICAgZGVsZXRlIHRoaXMuc3Vic2NyaXB0aW9uc1twdXNoVG9rZW5dO1xuXG4gICAgICAgIGNvbnN0IHN1YiA9IGNsaWVudFN1YnNjcmlwdGlvbjtcbiAgICAgICAgaWYgKHN1YiAmJiBzdWIudG9rZW4pIHtcbiAgICAgICAgICBzb2NrZXRUb2tlbnMucHVzaChzdWIudG9rZW4pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5pb1B1c2guZW1pdCgndW5zdWJzY3JpYmUnLCBzb2NrZXRUb2tlbnMsICgpID0+IHtcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==