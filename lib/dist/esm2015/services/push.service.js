import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Helpers } from '../utils/helpers.js';
import _forOwn from 'lodash-es/forOwn';
import _clone from 'lodash-es/clone';
import * as io from 'socket.io-client';
let PushService = class PushService {
    constructor() {
        this.subscriptions = {};
    }
    init(socketUrl) {
        if (!this.ioPush) {
            this.ioPush = io.connect(`${socketUrl}/events`);
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
PushService = tslib_1.__decorate([
    Injectable()
], PushService);
export { PushService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVzaC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmctZXZlbnRzdG9yZS1saXN0aW5nLyIsInNvdXJjZXMiOlsic2VydmljZXMvcHVzaC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUM5QyxPQUFPLE9BQU8sTUFBTSxrQkFBa0IsQ0FBQztBQUN2QyxPQUFPLE1BQU0sTUFBTSxpQkFBaUIsQ0FBQztBQUNyQyxPQUFPLEtBQUssRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBR3ZDLElBQWEsV0FBVyxHQUF4QixNQUFhLFdBQVc7SUFHdEI7UUFEUSxrQkFBYSxHQUFRLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBRWpCLElBQUksQ0FBQyxTQUFpQjtRQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNoQixJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxTQUFTLFNBQVMsQ0FBQyxDQUFDO1lBRWhELElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLFFBQVEsRUFBRSxFQUFFO2dCQUNyQyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQy9CLENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRTtnQkFDL0Isb0NBQW9DO2dCQUNwQywwQ0FBMEM7Z0JBQ3hDLG1DQUFtQztnQkFDbkMsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtvQkFDbEMsTUFBTSxpQkFBaUIsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7d0JBQ2pELE1BQU0sRUFBRSxH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LEVBQUU7R0FDQSxXQUFXLENBK0l2QjtTQS9JWSxXQUFXIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSGVscGVycyB9IGZyb20gJy4uL3V0aWxzL2hlbHBlcnMuanMnO1xuaW1wb3J0IF9mb3JPd24gZnJvbSAnbG9kYXNoLWVzL2Zvck93bic7XG5pbXBvcnQgX2Nsb25lIGZyb20gJ2xvZGFzaC1lcy9jbG9uZSc7XG5pbXBvcnQgKiBhcyBpbyBmcm9tICdzb2NrZXQuaW8tY2xpZW50JztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFB1c2hTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBpb1B1c2g6IGFueTtcbiAgcHJpdmF0ZSBzdWJzY3JpcHRpb25zOiBhbnkgPSB7fTtcbiAgY29uc3RydWN0b3IoKSB7IH1cblxuICBpbml0KHNvY2tldFVybDogc3RyaW5nKSB7XG4gICAgaWYgKCF0aGlzLmlvUHVzaCkge1xuICAgICAgdGhpcy5pb1B1c2ggPSBpby5jb25uZWN0KGAke3NvY2tldFVybH0vZXZlbnRzYCk7XG5cbiAgICAgIHRoaXMuaW9QdXNoLm9uKCdtZXNzYWdlJywgKGV2ZW50T2JqKSA9PiB7XG4gICAgICAgIHRoaXMuX3Byb2Nlc3NFdmVudChldmVudE9iaik7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5pb1B1c2gub24oJ3JlY29ubmVjdCcsICgpID0+IHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ1RFU1QgUkVDT05ORUNUSU9OJyk7XG4gICAgICAgIC8vIHRoaXMuaW9QdXNoLmVtaXQoJ3Jlc3Vic2NyaWJlJywgKCkgPT4ge1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuc3Vic2NyaXB0aW9ucyk7XG4gICAgICAgICAgX2Zvck93bih0aGlzLnN1YnNjcmlwdGlvbnMsIChzdWIpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHN1YnNjcmlwdGlvblF1ZXJ5ID0gT2JqZWN0LmFzc2lnbihzdWIucXVlcnksIHtcbiAgICAgICAgICAgICAgb2Zmc2V0OiBzdWIub2Zmc2V0LFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuaW9QdXNoLmVtaXQoJ3N1YnNjcmliZScsIHN1YnNjcmlwdGlvblF1ZXJ5LCAodG9rZW46IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnUmVjb25uZWN0ZWQ6JywgdG9rZW4sIHN1YnNjcmlwdGlvblF1ZXJ5KTtcbiAgICAgICAgICAgICAgICBzdWIudG9rZW4gPSB0b2tlbjtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdSZWNvbm5lY3QgZXJyb3IgZm9yIHF1ZXJ5Jywgc3Vic2NyaXB0aW9uUXVlcnkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgLy8gfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBfcHJvY2Vzc0V2ZW50KGV2ZW50T2JqOiBhbnkpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAvLyBjb25zb2xlLmxvZygnZ290IG1lc3NhZ2UgZnJvbSBwdXNoIHNlcnZlcjogJywgZXZlbnRPYmopO1xuICAgIGNvbnN0IHF1ZXJ5S2V5ID0gYCR7ZXZlbnRPYmouY29udGV4dH0uJHtldmVudE9iai5hZ2dyZWdhdGV9LiR7ZXZlbnRPYmouYWdncmVnYXRlSWR9YDtcbiAgICBjb25zdCBjbGllbnRUb2tlbnMgPSBPYmplY3Qua2V5cyhzZWxmLnN1YnNjcmlwdGlvbnMpO1xuICAgIC8vIHJlZGlyZWN0IHRvIG1hcHBlZCBzdWJzY3JpcHRpb24vdG9rZW4gY2FsbGJhY2tcbiAgICBjbGllbnRUb2tlbnMuZm9yRWFjaCgoY2xpZW50VG9rZW4pID0+IHtcbiAgICAgIGNvbnN0IHN1YiA9IHNlbGYuc3Vic2NyaXB0aW9uc1tjbGllbnRUb2tlbl07XG4gICAgICBpZiAoc3ViKSB7XG4gICAgICAgIGNvbnN0IHN1YlF1ZXJ5S2V5ID0gYCR7c3ViLnF1ZXJ5LmNvbnRleHR9LiR7c3ViLnF1ZXJ5LmFnZ3JlZ2F0ZX0uJHtzdWIucXVlcnkuYWdncmVnYXRlSWR9YDtcbiAgICAgICAgaWYgKHN1YlF1ZXJ5S2V5ID09PSBxdWVyeUtleSkge1xuICAgICAgICAgIC8vIHVwZGF0ZSBuZXh0IG9mZnNldCAoZnJvbSBzdHJlYW0gcmV2aXNpb24pIGZvciB0aGlzIHN1YnNjcmlwdGlvbiwgc28gZm9yIHJlY29ubmVjdGluZ1xuICAgICAgICAgIGlmICghaXNOYU4oZXZlbnRPYmouc3RyZWFtUmV2aXNpb24pKSB7XG4gICAgICAgICAgICBzdWIub2Zmc2V0ID0gZXZlbnRPYmouc3RyZWFtUmV2aXNpb24gKyAxO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodHlwZW9mIHN1Yi5jYiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgc3ViLmNiKHVuZGVmaW5lZCwgZXZlbnRPYmosIHN1Yi5vd25lciwgY2xpZW50VG9rZW4pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIGl0ZXJhdGUgb24gbW9uaXRvcnMgbWV0YSB0YWdzXG4gICAgICAgICAgY29uc3QgdGFncyA9IE9iamVjdC5rZXlzKHN1Yi5tb25pdG9yVGFncyk7XG4gICAgICAgICAgdGFncy5mb3JFYWNoKCh0YWcpID0+IHtcbiAgICAgICAgICAgIC8vIGNoZWNrIGZvciBzdGF0ZS9ldmVudFNvdXJjZS5fbWV0YSBvciBldmVudC5fbWV0YVxuICAgICAgICAgICAgaWYgKGV2ZW50T2JqLl9tZXRhICYmIGV2ZW50T2JqLl9tZXRhLnRhZyA9PT0gdGFnKSB7XG4gICAgICAgICAgICAgIGxldCByZWFzb24gPSAnTi9BJztcbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiBldmVudE9iai5ldmVudFR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgcmVhc29uID0gZXZlbnRPYmouZXZlbnRUeXBlO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBldmVudE9iai5zdGF0ZVR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgcmVhc29uID0gZXZlbnRPYmouc3RhdGVUeXBlO1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgIGV2ZW50T2JqLmV2ZW50U291cmNlICYmXG4gICAgICAgICAgICAgICAgICB0eXBlb2YgZXZlbnRPYmouZXZlbnRTb3VyY2UuZXZlbnRUeXBlID09PSAnc3RyaW5nJ1xuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgcmVhc29uICs9IGAgPC0gJHtldmVudE9iai5ldmVudFNvdXJjZS5ldmVudFR5cGV9YDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLy8gaXRlcmF0ZSBvbiB0aGUgbW9uaXRvcnNcbiAgICAgICAgICAgICAgY29uc3QgbW9uaXRvcnMgPSBzdWIubW9uaXRvclRhZ3NbdGFnXTtcbiAgICAgICAgICAgICAgbW9uaXRvcnMuZm9yRWFjaCgobW9uaXRvcikgPT4ge1xuICAgICAgICAgICAgICAgIG1vbml0b3IuY2FsbGJhY2socmVhc29uLCBldmVudE9iai5fbWV0YSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBzdWJzY3JpYmUocXVlcnksIG9mZnNldCwgb3duZXIsIGNiKSB7XG4gICAgLy8gYXdhaXQgdGhpcy53YWl0Rm9yU29ja2V0Q29ubmVjdGlvbigpO1xuICAgIGNvbnN0IHB1c2hUb2tlbiA9IEhlbHBlcnMuZ2VuZXJhdGVUb2tlbigpO1xuICAgIC8vIG1hcCBuZXcgc3Vic2NyaXB0aW9uLCB0aGVuIHRyeSB0byBzdWJzY3JpYmUgdG8gc2VydmVyIGFzYXBcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnNbcHVzaFRva2VuXSA9IHtcbiAgICAgIHF1ZXJ5OiBxdWVyeSxcbiAgICAgIG9mZnNldDogb2Zmc2V0LFxuICAgICAgb3duZXI6IG93bmVyLFxuICAgICAgY2I6IGNiLFxuICAgICAgbW9uaXRvclRhZ3M6IHt9LFxuICAgIH07XG5cbiAgICBjb25zdCBzdWIgPSB0aGlzLnN1YnNjcmlwdGlvbnNbcHVzaFRva2VuXTtcbiAgICBpZiAoc3ViICYmICFzdWIudG9rZW4pIHtcbiAgICAgIC8vIGJ1aWxkIHVwIHByb3BlciBzdWJzY3JpYmUgcmVxdWVzdCBxdWVyeVxuICAgICAgY29uc3Qgc3Vic2NyaXB0aW9uUXVlcnkgPSBPYmplY3QuYXNzaWduKHN1Yi5xdWVyeSwge1xuICAgICAgICBvZmZzZXQ6IHN1Yi5vZmZzZXQsXG4gICAgICB9KTtcblxuICAgICAgdGhpcy5pb1B1c2guZW1pdCgnc3Vic2NyaWJlJywgc3Vic2NyaXB0aW9uUXVlcnksICh7IHN1YnNjcmlwdGlvblRva2VuLCBjYXRjaFVwRXZlbnRzIH0pID0+IHtcbiAgICAgICAgaWYgKHN1YnNjcmlwdGlvblRva2VuKSB7XG4gICAgICAgICAgLy8gY29uc29sZS5sb2coJ1NlcnZlciBTdWJzY3JpYmVkOicsIHRva2VuLCBzdWJzY3JpcHRpb25RdWVyeSk7XG4gICAgICAgICAgc3ViLnRva2VuID0gc3Vic2NyaXB0aW9uVG9rZW47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignU3Vic2NyaWJlIGVycm9yIGZvciBxdWVyeScsIHN1YnNjcmlwdGlvblF1ZXJ5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjYXRjaFVwRXZlbnRzICYmIGNhdGNoVXBFdmVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGNhdGNoVXBFdmVudHMuZm9yRWFjaCgoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGNiKHVuZGVmaW5lZCwgZXZlbnQsIG93bmVyLCBwdXNoVG9rZW4pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcHVzaFRva2VuO1xuICB9XG5cbiAgdW5zdWJzY3JpYmUocHVzaFRva2Vuczogc3RyaW5nW10pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBzb2NrZXRUb2tlbnMgPSBbXTtcblxuICAgIHB1c2hUb2tlbnMuZm9yRWFjaCgocHVzaFRva2VuKSA9PiB7XG4gICAgICBpZiAodGhpcy5zdWJzY3JpcHRpb25zW3B1c2hUb2tlbl0pIHtcbiAgICAgICAgY29uc3QgY2xpZW50U3Vic2NyaXB0aW9uID0gX2Nsb25lKHRoaXMuc3Vic2NyaXB0aW9uc1twdXNoVG9rZW5dKTtcbiAgICAgICAgZGVsZXRlIHRoaXMuc3Vic2NyaXB0aW9uc1twdXNoVG9rZW5dO1xuXG4gICAgICAgIGNvbnN0IHN1YiA9IGNsaWVudFN1YnNjcmlwdGlvbjtcbiAgICAgICAgaWYgKHN1YiAmJiBzdWIudG9rZW4pIHtcbiAgICAgICAgICBzb2NrZXRUb2tlbnMucHVzaChzdWIudG9rZW4pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5pb1B1c2guZW1pdCgndW5zdWJzY3JpYmUnLCBzb2NrZXRUb2tlbnMsICgpID0+IHtcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==