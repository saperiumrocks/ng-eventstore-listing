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
    Injectable(),
    tslib_1.__metadata("design:paramtypes", [])
], PushService);
export { PushService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVzaC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmctZXZlbnRzdG9yZS1saXN0aW5nLyIsInNvdXJjZXMiOlsic2VydmljZXMvcHVzaC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUM5QyxPQUFPLE9BQU8sTUFBTSxrQkFBa0IsQ0FBQztBQUN2QyxPQUFPLE1BQU0sTUFBTSxpQkFBaUIsQ0FBQztBQUNyQyxPQUFPLEtBQUssRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBR3ZDLElBQWEsV0FBVyxHQUF4QixNQUFhLFdBQVc7SUFHdEI7UUFEUSxrQkFBYSxHQUFRLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBRWpCLElBQUksQ0FBQyxTQUFpQjtRQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNoQixJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxTQUFTLFNBQVMsQ0FBQyxDQUFDO1lBRWhELElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLFFBQVEsRUFBRSxFQUFFO2dCQUNyQyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQy9CLENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRTtnQkFDL0Isb0NBQW9DO2dCQUNwQywwQ0FBMEM7Z0JBQ3hDLG1DQUFtQztnQkFDbkMsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtvQkFDbEMsTUFBTSxpQkFBaUIsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7d0JBQ2pELE1BQU0sRUFBRSxH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LEVBQUU7O0dBQ0EsV0FBVyxDQStJdkI7U0EvSVksV0FBVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEhlbHBlcnMgfSBmcm9tICcuLi91dGlscy9oZWxwZXJzLmpzJztcbmltcG9ydCBfZm9yT3duIGZyb20gJ2xvZGFzaC1lcy9mb3JPd24nO1xuaW1wb3J0IF9jbG9uZSBmcm9tICdsb2Rhc2gtZXMvY2xvbmUnO1xuaW1wb3J0ICogYXMgaW8gZnJvbSAnc29ja2V0LmlvLWNsaWVudCc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBQdXNoU2VydmljZSB7XG4gIHByaXZhdGUgaW9QdXNoOiBhbnk7XG4gIHByaXZhdGUgc3Vic2NyaXB0aW9uczogYW55ID0ge307XG4gIGNvbnN0cnVjdG9yKCkgeyB9XG5cbiAgaW5pdChzb2NrZXRVcmw6IHN0cmluZykge1xuICAgIGlmICghdGhpcy5pb1B1c2gpIHtcbiAgICAgIHRoaXMuaW9QdXNoID0gaW8uY29ubmVjdChgJHtzb2NrZXRVcmx9L2V2ZW50c2ApO1xuXG4gICAgICB0aGlzLmlvUHVzaC5vbignbWVzc2FnZScsIChldmVudE9iaikgPT4ge1xuICAgICAgICB0aGlzLl9wcm9jZXNzRXZlbnQoZXZlbnRPYmopO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuaW9QdXNoLm9uKCdyZWNvbm5lY3QnLCAoKSA9PiB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdURVNUIFJFQ09OTkVDVElPTicpO1xuICAgICAgICAvLyB0aGlzLmlvUHVzaC5lbWl0KCdyZXN1YnNjcmliZScsICgpID0+IHtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnN1YnNjcmlwdGlvbnMpO1xuICAgICAgICAgIF9mb3JPd24odGhpcy5zdWJzY3JpcHRpb25zLCAoc3ViKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzdWJzY3JpcHRpb25RdWVyeSA9IE9iamVjdC5hc3NpZ24oc3ViLnF1ZXJ5LCB7XG4gICAgICAgICAgICAgIG9mZnNldDogc3ViLm9mZnNldCxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLmlvUHVzaC5lbWl0KCdzdWJzY3JpYmUnLCBzdWJzY3JpcHRpb25RdWVyeSwgKHRva2VuOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgaWYgKHRva2VuKSB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ1JlY29ubmVjdGVkOicsIHRva2VuLCBzdWJzY3JpcHRpb25RdWVyeSk7XG4gICAgICAgICAgICAgICAgc3ViLnRva2VuID0gdG9rZW47XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignUmVjb25uZWN0IGVycm9yIGZvciBxdWVyeScsIHN1YnNjcmlwdGlvblF1ZXJ5KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIC8vIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgX3Byb2Nlc3NFdmVudChldmVudE9iajogYW55KSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgLy8gY29uc29sZS5sb2coJ2dvdCBtZXNzYWdlIGZyb20gcHVzaCBzZXJ2ZXI6ICcsIGV2ZW50T2JqKTtcbiAgICBjb25zdCBxdWVyeUtleSA9IGAke2V2ZW50T2JqLmNvbnRleHR9LiR7ZXZlbnRPYmouYWdncmVnYXRlfS4ke2V2ZW50T2JqLmFnZ3JlZ2F0ZUlkfWA7XG4gICAgY29uc3QgY2xpZW50VG9rZW5zID0gT2JqZWN0LmtleXMoc2VsZi5zdWJzY3JpcHRpb25zKTtcbiAgICAvLyByZWRpcmVjdCB0byBtYXBwZWQgc3Vic2NyaXB0aW9uL3Rva2VuIGNhbGxiYWNrXG4gICAgY2xpZW50VG9rZW5zLmZvckVhY2goKGNsaWVudFRva2VuKSA9PiB7XG4gICAgICBjb25zdCBzdWIgPSBzZWxmLnN1YnNjcmlwdGlvbnNbY2xpZW50VG9rZW5dO1xuICAgICAgaWYgKHN1Yikge1xuICAgICAgICBjb25zdCBzdWJRdWVyeUtleSA9IGAke3N1Yi5xdWVyeS5jb250ZXh0fS4ke3N1Yi5xdWVyeS5hZ2dyZWdhdGV9LiR7c3ViLnF1ZXJ5LmFnZ3JlZ2F0ZUlkfWA7XG4gICAgICAgIGlmIChzdWJRdWVyeUtleSA9PT0gcXVlcnlLZXkpIHtcbiAgICAgICAgICAvLyB1cGRhdGUgbmV4dCBvZmZzZXQgKGZyb20gc3RyZWFtIHJldmlzaW9uKSBmb3IgdGhpcyBzdWJzY3JpcHRpb24sIHNvIGZvciByZWNvbm5lY3RpbmdcbiAgICAgICAgICBpZiAoIWlzTmFOKGV2ZW50T2JqLnN0cmVhbVJldmlzaW9uKSkge1xuICAgICAgICAgICAgc3ViLm9mZnNldCA9IGV2ZW50T2JqLnN0cmVhbVJldmlzaW9uICsgMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHR5cGVvZiBzdWIuY2IgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHN1Yi5jYih1bmRlZmluZWQsIGV2ZW50T2JqLCBzdWIub3duZXIsIGNsaWVudFRva2VuKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBpdGVyYXRlIG9uIG1vbml0b3JzIG1ldGEgdGFnc1xuICAgICAgICAgIGNvbnN0IHRhZ3MgPSBPYmplY3Qua2V5cyhzdWIubW9uaXRvclRhZ3MpO1xuICAgICAgICAgIHRhZ3MuZm9yRWFjaCgodGFnKSA9PiB7XG4gICAgICAgICAgICAvLyBjaGVjayBmb3Igc3RhdGUvZXZlbnRTb3VyY2UuX21ldGEgb3IgZXZlbnQuX21ldGFcbiAgICAgICAgICAgIGlmIChldmVudE9iai5fbWV0YSAmJiBldmVudE9iai5fbWV0YS50YWcgPT09IHRhZykge1xuICAgICAgICAgICAgICBsZXQgcmVhc29uID0gJ04vQSc7XG4gICAgICAgICAgICAgIGlmICh0eXBlb2YgZXZlbnRPYmouZXZlbnRUeXBlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIHJlYXNvbiA9IGV2ZW50T2JqLmV2ZW50VHlwZTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZXZlbnRPYmouc3RhdGVUeXBlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIHJlYXNvbiA9IGV2ZW50T2JqLnN0YXRlVHlwZTtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICBldmVudE9iai5ldmVudFNvdXJjZSAmJlxuICAgICAgICAgICAgICAgICAgdHlwZW9mIGV2ZW50T2JqLmV2ZW50U291cmNlLmV2ZW50VHlwZSA9PT0gJ3N0cmluZydcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgIHJlYXNvbiArPSBgIDwtICR7ZXZlbnRPYmouZXZlbnRTb3VyY2UuZXZlbnRUeXBlfWA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIC8vIGl0ZXJhdGUgb24gdGhlIG1vbml0b3JzXG4gICAgICAgICAgICAgIGNvbnN0IG1vbml0b3JzID0gc3ViLm1vbml0b3JUYWdzW3RhZ107XG4gICAgICAgICAgICAgIG1vbml0b3JzLmZvckVhY2goKG1vbml0b3IpID0+IHtcbiAgICAgICAgICAgICAgICBtb25pdG9yLmNhbGxiYWNrKHJlYXNvbiwgZXZlbnRPYmouX21ldGEpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc3Vic2NyaWJlKHF1ZXJ5LCBvZmZzZXQsIG93bmVyLCBjYikge1xuICAgIC8vIGF3YWl0IHRoaXMud2FpdEZvclNvY2tldENvbm5lY3Rpb24oKTtcbiAgICBjb25zdCBwdXNoVG9rZW4gPSBIZWxwZXJzLmdlbmVyYXRlVG9rZW4oKTtcbiAgICAvLyBtYXAgbmV3IHN1YnNjcmlwdGlvbiwgdGhlbiB0cnkgdG8gc3Vic2NyaWJlIHRvIHNlcnZlciBhc2FwXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zW3B1c2hUb2tlbl0gPSB7XG4gICAgICBxdWVyeTogcXVlcnksXG4gICAgICBvZmZzZXQ6IG9mZnNldCxcbiAgICAgIG93bmVyOiBvd25lcixcbiAgICAgIGNiOiBjYixcbiAgICAgIG1vbml0b3JUYWdzOiB7fSxcbiAgICB9O1xuXG4gICAgY29uc3Qgc3ViID0gdGhpcy5zdWJzY3JpcHRpb25zW3B1c2hUb2tlbl07XG4gICAgaWYgKHN1YiAmJiAhc3ViLnRva2VuKSB7XG4gICAgICAvLyBidWlsZCB1cCBwcm9wZXIgc3Vic2NyaWJlIHJlcXVlc3QgcXVlcnlcbiAgICAgIGNvbnN0IHN1YnNjcmlwdGlvblF1ZXJ5ID0gT2JqZWN0LmFzc2lnbihzdWIucXVlcnksIHtcbiAgICAgICAgb2Zmc2V0OiBzdWIub2Zmc2V0LFxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuaW9QdXNoLmVtaXQoJ3N1YnNjcmliZScsIHN1YnNjcmlwdGlvblF1ZXJ5LCAoeyBzdWJzY3JpcHRpb25Ub2tlbiwgY2F0Y2hVcEV2ZW50cyB9KSA9PiB7XG4gICAgICAgIGlmIChzdWJzY3JpcHRpb25Ub2tlbikge1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdTZXJ2ZXIgU3Vic2NyaWJlZDonLCB0b2tlbiwgc3Vic2NyaXB0aW9uUXVlcnkpO1xuICAgICAgICAgIHN1Yi50b2tlbiA9IHN1YnNjcmlwdGlvblRva2VuO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1N1YnNjcmliZSBlcnJvciBmb3IgcXVlcnknLCBzdWJzY3JpcHRpb25RdWVyeSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2F0Y2hVcEV2ZW50cyAmJiBjYXRjaFVwRXZlbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBjYXRjaFVwRXZlbnRzLmZvckVhY2goKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBjYih1bmRlZmluZWQsIGV2ZW50LCBvd25lciwgcHVzaFRva2VuKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHB1c2hUb2tlbjtcbiAgfVxuXG4gIHVuc3Vic2NyaWJlKHB1c2hUb2tlbnM6IHN0cmluZ1tdKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3Qgc29ja2V0VG9rZW5zID0gW107XG5cbiAgICBwdXNoVG9rZW5zLmZvckVhY2goKHB1c2hUb2tlbikgPT4ge1xuICAgICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9uc1twdXNoVG9rZW5dKSB7XG4gICAgICAgIGNvbnN0IGNsaWVudFN1YnNjcmlwdGlvbiA9IF9jbG9uZSh0aGlzLnN1YnNjcmlwdGlvbnNbcHVzaFRva2VuXSk7XG4gICAgICAgIGRlbGV0ZSB0aGlzLnN1YnNjcmlwdGlvbnNbcHVzaFRva2VuXTtcblxuICAgICAgICBjb25zdCBzdWIgPSBjbGllbnRTdWJzY3JpcHRpb247XG4gICAgICAgIGlmIChzdWIgJiYgc3ViLnRva2VuKSB7XG4gICAgICAgICAgc29ja2V0VG9rZW5zLnB1c2goc3ViLnRva2VuKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMuaW9QdXNoLmVtaXQoJ3Vuc3Vic2NyaWJlJywgc29ja2V0VG9rZW5zLCAoKSA9PiB7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59XG4iXX0=