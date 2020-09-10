import { Injectable } from '@angular/core';
import { Helpers } from '../utils/helpers.js';
import _forOwn from 'lodash-es/forOwn';
import _clone from 'lodash-es/clone';
import * as io from 'socket.io-client';

@Injectable()
export class PushService {
  private ioPush: any;
  private subscriptions: any = {};
  constructor() { }

  init(socketUrl: string) {
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
  }

  _processEvent(eventObj: any) {
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
        } else {
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

  unsubscribe(pushTokens: string[]): Promise<void> {
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
}
