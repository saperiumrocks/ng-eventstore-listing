import { Injectable, Inject, NgZone } from '@angular/core';
import { IO_TOKEN } from './socket.io.service';

// TODO: Make environment pluggable or derivable

@Injectable()
export class PushService {
  private ioPush: any;
  private subscriptions: any = {};
  constructor(@Inject(IO_TOKEN) private io: any, private ngZone: NgZone) {}

  init(socketUrl: string) {
    this.ioPush = this.io(`${socketUrl}/events`);

    const self = this;
    this.ioPush.on('message', (eventObj, token) => {
      console.log('got message from push server: ', eventObj, token);
      const clientTokens = Object.keys(self.subscriptions);
      // redirect to mapped subscription/token callback
      clientTokens.forEach((clientToken) => {
        const sub = self.subscriptions[clientToken];
        if (sub.token === token) {
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
      });
    });

    console.log('SOCKET INIT');
  }

  async subscribe(query, offset, owner, cb) {
    console.log('SUBSCRIBE!');
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

    // this.subscribeStreams();

    const sub = this.subscriptions[clientToken];
    if (sub && !sub.token) {
      // build up proper subscribe request query
      const query = Object.assign(sub.query, {
        offset: sub.offset,
      });
      console.log('SUBSCRIBE IS CALLED:', query);
      this.ioPush.emit('subscribe', query, (token: string) => {
        console.log('SUBSCRIBE EMIT');
        if (token) {
          console.log('Server Subscribed:', token, query);
          sub.token = token;
        } else {
          console.error('Subscribe error for query', query);
        }
      });
    }


    return clientToken;
  }

  // async subscribeStreams() {
  //   // await this.waitForSocketConnection();
  //   if (this.ioPush.connected) {
  //     // this.ioPush.on('connected', () => {
  //     console.log(this.subscriptions);
  //     const clientTokens = Object.keys(this.subscriptions);
  //     clientTokens.forEach((clientToken) => {
  //       const sub = this.subscriptions[clientToken];
  //       // do server subsribe for those without tokens yet
  //       if (!sub.token) {
  //         // build up proper subscribe request query
  //         const query = Object.assign(sub.query, {
  //           offset: sub.offset,
  //         });
  //         console.log('SUBSCRIBE IS CALLED:', query);
  //         this.ioPush.emit('subscribe', query, (token: string) => {
  //           console.log('SUBSCRIBE EMIT');
  //           if (token) {
  //             console.log('Server Subscribed:', token, query);
  //             sub.token = token;
  //           } else {
  //             console.error('Subscribe error for query', query);
  //           }
  //         });
  //       }
  //     });
  //     // })
  //   }
  // }

  unsubscribe(clientToken): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // just do a force server unsubscribe and removal of subscription entry
        const sub = this.subscriptions[clientToken];
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
      } catch (error) {
        reject(error);
        console.error('error in unsubscribing: ', error);
      }
    });
  }

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
}
