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
        Injectable()
    ], PushService);
    return PushService;
}());
export { PushService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVzaC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmctZXZlbnRzdG9yZS1saXN0aW5nLyIsInNvdXJjZXMiOlsic2VydmljZXMvcHVzaC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUM5QyxPQUFPLE9BQU8sTUFBTSxrQkFBa0IsQ0FBQztBQUN2QyxPQUFPLE1BQU0sTUFBTSxpQkFBaUIsQ0FBQztBQUNyQyxPQUFPLEtBQUssRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBR3ZDO0lBR0U7UUFEUSxrQkFBYSxHQUFRLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBRWpCLDBCQUFJLEdBQUosVUFBSyxTQUFpQjtRQUF0QixpQkE2QkM7UUE1QkMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDaEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFJLFNBQVMsWUFBUyxDQUFDLENBQUM7WUFFaEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLFVBQUMsUUFBUTtnQkFDakMsS0FBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMvQixDQUFDLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRTtnQkFDMUIsb0NBQW9DO2dCQUNwQywwQ0FBMEM7Z0JBQ3hDLG1DQUFtQztnQkFDbkMsT0FBTyxDQUFDLEtBQUksQ0FBQyxhQUFhLEVBQUUsVUFBQyxHQUFHO29CQUM5QixJQUFNLGlCQUFpQixHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTt3QkFDakQsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNO3FCQUNuQixDQUFDLENBQUM7b0JBRUgsS0FBSSxD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QUFFLENBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7b0JBQ3pDLENBQUMsQ0FBQyxDQUFDO2lCQUNKO1lBQ0gsQ0FBQyxDQUFDLENBQUM7U0FDSjtRQUVELE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFFRCxpQ0FBVyxHQUFYLFVBQVksVUFBb0I7UUFBaEMsaUJBb0JDO1FBbkJDLElBQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQztRQUV4QixVQUFVLENBQUMsT0FBTyxDQUFDLFVBQUMsU0FBUztZQUMzQixJQUFJLEtBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLEVBQUU7Z0JBQ2pDLElBQU0sa0JBQWtCLEdBQUcsTUFBTSxDQUFDLEtBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDakUsT0FBTyxLQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUVyQyxJQUFNLEdBQUcsR0FBRyxrQkFBa0IsQ0FBQztnQkFDL0IsSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRTtvQkFDcEIsWUFBWSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQzlCO2FBQ0Y7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTTtZQUNqQyxLQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsWUFBWSxFQUFFO2dCQUM1QyxPQUFPLEVBQUUsQ0FBQztZQUNaLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBOUlVLFdBQVc7UUFEdkIsVUFBVSxFQUFFO09BQ0EsV0FBVyxDQStJdkI7SUFBRCxrQkFBQztDQUFBLEFBL0lELElBK0lDO1NBL0lZLFdBQVciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBIZWxwZXJzIH0gZnJvbSAnLi4vdXRpbHMvaGVscGVycy5qcyc7XG5pbXBvcnQgX2Zvck93biBmcm9tICdsb2Rhc2gtZXMvZm9yT3duJztcbmltcG9ydCBfY2xvbmUgZnJvbSAnbG9kYXNoLWVzL2Nsb25lJztcbmltcG9ydCAqIGFzIGlvIGZyb20gJ3NvY2tldC5pby1jbGllbnQnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgUHVzaFNlcnZpY2Uge1xuICBwcml2YXRlIGlvUHVzaDogYW55O1xuICBwcml2YXRlIHN1YnNjcmlwdGlvbnM6IGFueSA9IHt9O1xuICBjb25zdHJ1Y3RvcigpIHsgfVxuXG4gIGluaXQoc29ja2V0VXJsOiBzdHJpbmcpIHtcbiAgICBpZiAoIXRoaXMuaW9QdXNoKSB7XG4gICAgICB0aGlzLmlvUHVzaCA9IGlvLmNvbm5lY3QoYCR7c29ja2V0VXJsfS9ldmVudHNgKTtcblxuICAgICAgdGhpcy5pb1B1c2gub24oJ21lc3NhZ2UnLCAoZXZlbnRPYmopID0+IHtcbiAgICAgICAgdGhpcy5fcHJvY2Vzc0V2ZW50KGV2ZW50T2JqKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmlvUHVzaC5vbigncmVjb25uZWN0JywgKCkgPT4ge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnVEVTVCBSRUNPTk5FQ1RJT04nKTtcbiAgICAgICAgLy8gdGhpcy5pb1B1c2guZW1pdCgncmVzdWJzY3JpYmUnLCAoKSA9PiB7XG4gICAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy5zdWJzY3JpcHRpb25zKTtcbiAgICAgICAgICBfZm9yT3duKHRoaXMuc3Vic2NyaXB0aW9ucywgKHN1YikgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc3Vic2NyaXB0aW9uUXVlcnkgPSBPYmplY3QuYXNzaWduKHN1Yi5xdWVyeSwge1xuICAgICAgICAgICAgICBvZmZzZXQ6IHN1Yi5vZmZzZXQsXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5pb1B1c2guZW1pdCgnc3Vic2NyaWJlJywgc3Vic2NyaXB0aW9uUXVlcnksICh0b2tlbjogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgIGlmICh0b2tlbikge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdSZWNvbm5lY3RlZDonLCB0b2tlbiwgc3Vic2NyaXB0aW9uUXVlcnkpO1xuICAgICAgICAgICAgICAgIHN1Yi50b2tlbiA9IHRva2VuO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1JlY29ubmVjdCBlcnJvciBmb3IgcXVlcnknLCBzdWJzY3JpcHRpb25RdWVyeSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICAvLyB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIF9wcm9jZXNzRXZlbnQoZXZlbnRPYmo6IGFueSkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIC8vIGNvbnNvbGUubG9nKCdnb3QgbWVzc2FnZSBmcm9tIHB1c2ggc2VydmVyOiAnLCBldmVudE9iaik7XG4gICAgY29uc3QgcXVlcnlLZXkgPSBgJHtldmVudE9iai5jb250ZXh0fS4ke2V2ZW50T2JqLmFnZ3JlZ2F0ZX0uJHtldmVudE9iai5hZ2dyZWdhdGVJZH1gO1xuICAgIGNvbnN0IGNsaWVudFRva2VucyA9IE9iamVjdC5rZXlzKHNlbGYuc3Vic2NyaXB0aW9ucyk7XG4gICAgLy8gcmVkaXJlY3QgdG8gbWFwcGVkIHN1YnNjcmlwdGlvbi90b2tlbiBjYWxsYmFja1xuICAgIGNsaWVudFRva2Vucy5mb3JFYWNoKChjbGllbnRUb2tlbikgPT4ge1xuICAgICAgY29uc3Qgc3ViID0gc2VsZi5zdWJzY3JpcHRpb25zW2NsaWVudFRva2VuXTtcbiAgICAgIGlmIChzdWIpIHtcbiAgICAgICAgY29uc3Qgc3ViUXVlcnlLZXkgPSBgJHtzdWIucXVlcnkuY29udGV4dH0uJHtzdWIucXVlcnkuYWdncmVnYXRlfS4ke3N1Yi5xdWVyeS5hZ2dyZWdhdGVJZH1gO1xuICAgICAgICBpZiAoc3ViUXVlcnlLZXkgPT09IHF1ZXJ5S2V5KSB7XG4gICAgICAgICAgLy8gdXBkYXRlIG5leHQgb2Zmc2V0IChmcm9tIHN0cmVhbSByZXZpc2lvbikgZm9yIHRoaXMgc3Vic2NyaXB0aW9uLCBzbyBmb3IgcmVjb25uZWN0aW5nXG4gICAgICAgICAgaWYgKCFpc05hTihldmVudE9iai5zdHJlYW1SZXZpc2lvbikpIHtcbiAgICAgICAgICAgIHN1Yi5vZmZzZXQgPSBldmVudE9iai5zdHJlYW1SZXZpc2lvbiArIDE7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0eXBlb2Ygc3ViLmNiID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBzdWIuY2IodW5kZWZpbmVkLCBldmVudE9iaiwgc3ViLm93bmVyLCBjbGllbnRUb2tlbik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gaXRlcmF0ZSBvbiBtb25pdG9ycyBtZXRhIHRhZ3NcbiAgICAgICAgICBjb25zdCB0YWdzID0gT2JqZWN0LmtleXMoc3ViLm1vbml0b3JUYWdzKTtcbiAgICAgICAgICB0YWdzLmZvckVhY2goKHRhZykgPT4ge1xuICAgICAgICAgICAgLy8gY2hlY2sgZm9yIHN0YXRlL2V2ZW50U291cmNlLl9tZXRhIG9yIGV2ZW50Ll9tZXRhXG4gICAgICAgICAgICBpZiAoZXZlbnRPYmouX21ldGEgJiYgZXZlbnRPYmouX21ldGEudGFnID09PSB0YWcpIHtcbiAgICAgICAgICAgICAgbGV0IHJlYXNvbiA9ICdOL0EnO1xuICAgICAgICAgICAgICBpZiAodHlwZW9mIGV2ZW50T2JqLmV2ZW50VHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICByZWFzb24gPSBldmVudE9iai5ldmVudFR5cGU7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGV2ZW50T2JqLnN0YXRlVHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICByZWFzb24gPSBldmVudE9iai5zdGF0ZVR5cGU7XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgZXZlbnRPYmouZXZlbnRTb3VyY2UgJiZcbiAgICAgICAgICAgICAgICAgIHR5cGVvZiBldmVudE9iai5ldmVudFNvdXJjZS5ldmVudFR5cGUgPT09ICdzdHJpbmcnXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICByZWFzb24gKz0gYCA8LSAke2V2ZW50T2JqLmV2ZW50U291cmNlLmV2ZW50VHlwZX1gO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAvLyBpdGVyYXRlIG9uIHRoZSBtb25pdG9yc1xuICAgICAgICAgICAgICBjb25zdCBtb25pdG9ycyA9IHN1Yi5tb25pdG9yVGFnc1t0YWddO1xuICAgICAgICAgICAgICBtb25pdG9ycy5mb3JFYWNoKChtb25pdG9yKSA9PiB7XG4gICAgICAgICAgICAgICAgbW9uaXRvci5jYWxsYmFjayhyZWFzb24sIGV2ZW50T2JqLl9tZXRhKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHN1YnNjcmliZShxdWVyeSwgb2Zmc2V0LCBvd25lciwgY2IpIHtcbiAgICAvLyBhd2FpdCB0aGlzLndhaXRGb3JTb2NrZXRDb25uZWN0aW9uKCk7XG4gICAgY29uc3QgcHVzaFRva2VuID0gSGVscGVycy5nZW5lcmF0ZVRva2VuKCk7XG4gICAgLy8gbWFwIG5ldyBzdWJzY3JpcHRpb24sIHRoZW4gdHJ5IHRvIHN1YnNjcmliZSB0byBzZXJ2ZXIgYXNhcFxuICAgIHRoaXMuc3Vic2NyaXB0aW9uc1twdXNoVG9rZW5dID0ge1xuICAgICAgcXVlcnk6IHF1ZXJ5LFxuICAgICAgb2Zmc2V0OiBvZmZzZXQsXG4gICAgICBvd25lcjogb3duZXIsXG4gICAgICBjYjogY2IsXG4gICAgICBtb25pdG9yVGFnczoge30sXG4gICAgfTtcblxuICAgIGNvbnN0IHN1YiA9IHRoaXMuc3Vic2NyaXB0aW9uc1twdXNoVG9rZW5dO1xuICAgIGlmIChzdWIgJiYgIXN1Yi50b2tlbikge1xuICAgICAgLy8gYnVpbGQgdXAgcHJvcGVyIHN1YnNjcmliZSByZXF1ZXN0IHF1ZXJ5XG4gICAgICBjb25zdCBzdWJzY3JpcHRpb25RdWVyeSA9IE9iamVjdC5hc3NpZ24oc3ViLnF1ZXJ5LCB7XG4gICAgICAgIG9mZnNldDogc3ViLm9mZnNldCxcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmlvUHVzaC5lbWl0KCdzdWJzY3JpYmUnLCBzdWJzY3JpcHRpb25RdWVyeSwgKHsgc3Vic2NyaXB0aW9uVG9rZW4sIGNhdGNoVXBFdmVudHMgfSkgPT4ge1xuICAgICAgICBpZiAoc3Vic2NyaXB0aW9uVG9rZW4pIHtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZygnU2VydmVyIFN1YnNjcmliZWQ6JywgdG9rZW4sIHN1YnNjcmlwdGlvblF1ZXJ5KTtcbiAgICAgICAgICBzdWIudG9rZW4gPSBzdWJzY3JpcHRpb25Ub2tlbjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdTdWJzY3JpYmUgZXJyb3IgZm9yIHF1ZXJ5Jywgc3Vic2NyaXB0aW9uUXVlcnkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNhdGNoVXBFdmVudHMgJiYgY2F0Y2hVcEV2ZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgY2F0Y2hVcEV2ZW50cy5mb3JFYWNoKChldmVudCkgPT4ge1xuICAgICAgICAgICAgY2IodW5kZWZpbmVkLCBldmVudCwgb3duZXIsIHB1c2hUb2tlbik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBwdXNoVG9rZW47XG4gIH1cblxuICB1bnN1YnNjcmliZShwdXNoVG9rZW5zOiBzdHJpbmdbXSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHNvY2tldFRva2VucyA9IFtdO1xuXG4gICAgcHVzaFRva2Vucy5mb3JFYWNoKChwdXNoVG9rZW4pID0+IHtcbiAgICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbnNbcHVzaFRva2VuXSkge1xuICAgICAgICBjb25zdCBjbGllbnRTdWJzY3JpcHRpb24gPSBfY2xvbmUodGhpcy5zdWJzY3JpcHRpb25zW3B1c2hUb2tlbl0pO1xuICAgICAgICBkZWxldGUgdGhpcy5zdWJzY3JpcHRpb25zW3B1c2hUb2tlbl07XG5cbiAgICAgICAgY29uc3Qgc3ViID0gY2xpZW50U3Vic2NyaXB0aW9uO1xuICAgICAgICBpZiAoc3ViICYmIHN1Yi50b2tlbikge1xuICAgICAgICAgIHNvY2tldFRva2Vucy5wdXNoKHN1Yi50b2tlbik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLmlvUHVzaC5lbWl0KCd1bnN1YnNjcmliZScsIHNvY2tldFRva2VucywgKCkgPT4ge1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufVxuIl19