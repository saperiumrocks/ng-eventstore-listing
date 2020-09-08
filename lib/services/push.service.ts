import { Injectable, Inject, NgZone } from '@angular/core';
import _forOwn from 'lodash-es/forOwn';
import _clone from 'lodash-es/clone';
import * as io from 'socket.io-client';

// TODO: Make environment pluggable or derivable

@Injectable()
export class PushService {
  private ioPush: any;
  private subscriptions: any = {};
  constructor() { }

  init(socketUrl: string) {
    this.ioPush = io.connect(`${socketUrl}/events`);
    const self = this;
    this.ioPush.on('message', (eventObj, queryKey) => {
      console.log('got message from push server: ', eventObj, queryKey);
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
                } else if (typeof eventObj.stateType === 'string') {
                  reason = eventObj.stateType;
                  if (
                    eventObj.eventSource &&
                    typeof eventObj.eventSource.eventType === 'string'
                  ) {
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
    });

    this.ioPush.on('reconnect', () => {
      // console.log('TEST RECONNECTION');
      // this.ioPush.emit('resubscribe', () => {
        // console.log(this.subscriptions);
        _forOwn(this.subscriptions, (sub) => {
          const subscriptionQuery = Object.assign(sub.query, {
            offset: sub.offset,
          });

          this.ioPush.emit('subscribe', subscriptionQuery, (token: string) => {
            if (token) {
              // console.log('Reconnected:', token, subscriptionQuery);
              sub.token = token;
            } else {
              console.error('Reconnect error for query', subscriptionQuery);
            }
          });
        });
      // });
    });
  }

  subscribe(query, offset, owner, cb) {
    // await this.waitForSocketConnection();
    const clientToken =
      Math.random().toString(36).substr(2, 9) + '-' + Date.now().toString();
    // map new subscription, then try to subscribe to server asap
    this.subscriptions[clientToken] = {
      query: query,
      offset: offset,
      owner: owner,
      cb: cb,
      monitorTags: {},
    };

    const sub = this.subscriptions[clientToken];
    if (sub && !sub.token) {
      // build up proper subscribe request query
      const subscriptionQuery = Object.assign(sub.query, {
        offset: sub.offset,
      });

      this.ioPush.emit('subscribe', subscriptionQuery, (token: string) => {
        if (token) {
          // console.log('Server Subscribed:', token, subscriptionQuery);
          sub.token = token;
        } else {
          console.error('Subscribe error for query', subscriptionQuery);
        }
      });
    }


    return clientToken;
  }

  unsubscribe(clientTokens): Promise<void> {
    const socketTokens = [];

    clientTokens.forEach((clientToken) => {
      if (this.subscriptions[clientToken]) {
        const clientSubscription = _clone(this.subscriptions[clientToken]);
        delete this.subscriptions[clientToken];

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
}
