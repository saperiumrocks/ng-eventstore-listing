import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

import _find from 'lodash-es/find';
import _findIndex from 'lodash-es/findIndex';
import { Observable, Subscriber } from 'rxjs';

import * as shortid from 'shortid';

@Injectable({
  providedIn: 'root',
})
export class PushService {
  socket: any;
  observers: any[] = [];
  streamsSubscribed: any = {};

  subscriptions = {};

  constructor() {}

  startListeningToEvents(url: string) {
    const self = this;
    self.socket = io(url);

    self.socket.on('connection', (socket) => {
      console.log('a user connected');
      socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    });

    self.socket.on('reconnect', () => {
      // readd all observers' subscriptions on reconnect
      self.observers.forEach((item) => {
        // readd subscription
        self._addSubscription(item.observer, item.query, item.offset);
      });
    });

    this.socket.on('events', (data) => {
      // Handle playbacks here
      console.log('message: ' + data);
    });
  }

  // _subscribeToStreams() {
  //   if (this.socket.connected) {
  //     const clientTokens = Object.keys(this.subscriptions);
  //     clientTokens.forEach((clientToken) => {

  //     });
  //   }
  // };

  // TODO: Add interface for query
  // _addSubscription(observer: Subscriber<any>, query: any, subscribeCallback?: () => void, unsubscribeCallback?: any) {
  // TODO: Add handling of socket connection

  // }

  _addSubscription(
    observer: Subscriber<any>,
    query: any,
    offset: Number,
    subscribeCallback?: () => void,
    unsubscribeCallback?: (topicsToUnsubscribe) => void
  ) {
    const self = this;

    const payload = Object.assign(query, {
      offset: offset,
    });

    this.socket.emit(
      'add-subscription',
      JSON.stringify(payload),
      (error, subscriptionToken: string) => {
        if (subscriptionToken) {
          this.streamsSubscribed[subscriptionToken] = observer;
        }

        // add the observer to our list of observers
        // these observers will get the topics when an event comes in from the server
        const found = _find(
          self.observers,
          (item) => item.observer === observer
        );
        if (!found) {
          // if found, then this is not a retry
          // then add to the list of observers and subscribe to unsubscriptions
          self.observers.push({
            observer: observer,
            query: query,
            offset: offset,
            subscriptionToken: subscriptionToken,
          });

          observer.add(() => {
            // when observer unsubscribes
            const indexOfObserver = _findIndex(self.observers, (item) => {
              return item.observer === observer;
            });
            // remove from our list of observers
            self.observers.splice(indexOfObserver, 1);
            if (self.socket) {
              // Unsubscribe only the topics that have no other observers
              // const streamsToUnsubscribe = [];
              delete self.streamsSubscribed[subscriptionToken];
              // subscriptionTokens.forEach((subscriptionToken) => {
              //   // Decrement the observer count, then add to list of topics to unsubscribe if count is 0
              //   if (self.streamsSubscribed[subscriptionToken]) {
              //     self.streamsSubscribed[subscriptionToken]--;
              //     if (self.streamsSubscribed[subscriptionToken] === 0) {
              //       delete self.streamsSubscribed[subscriptionToken];
              //       streamsToUnsubscribe.push(subscriptionToken);
              //     }
              //   }
              // });

              // If there are topics to unsubscribe, then emit remove-subscriptions
              // console.log('STREAMS TO UNSUBSCRIBE:', streamsToUnsubscribe);
              // if (streamsToUnsubscribe.length > 0) {
              // remove our subscription from the server
              self.socket.emit(
                'remove-subscription',
                JSON.stringify(subscriptionToken),
                () => {
                  // if (!environment.production) {
                  //   console.log('_removeSubscriptions: done unsubscribing to topics');
                  //   console.log(topicsToUnsubscribe);
                  // }
                  if (unsubscribeCallback) {
                    unsubscribeCallback(subscriptionToken);
                  }
                }
              );
              // } else {
              //   // if (!environment.production) {
              //   //   console.log('_removeSubscriptions: no topics to unsubscribe');
              //   // }
              //   if (unsubscribeCallback) {
              //     unsubscribeCallback(streamsToUnsubscribe);
              //   }
              // }
            }
          });
        }

        if (subscribeCallback) {
          subscribeCallback();
        }
      }
    );
  }

  async subscribe(
    query: any,
    offset: Number,
    owner: any,
    callback: (err: any, eventObj: any, owner: any, token: string) => void
  ) {
    const self = this;
    return new Promise((resolve, reject) => {
      new Observable((observer) => {
        self._addSubscription(observer, query, offset);
      });
    });
  }

  unsubscribe(token: string) {
    const subscriptionToUnsubscribeFrom = this.subscriptions[token];
    if (subscriptionToUnsubscribeFrom) {
      subscriptionToUnsubscribeFrom.unsubscribe();
    }
  }

  // subscribe(query: any, offset: Number, cb: () => void) {
  //   const self = this;
  //   return new Observable(observer => {
  //     // if (subscriptionOptions.length > 0) {
  //       self._addSubscription(observer, subscriptionOptions, subscribeCallback, unsubscribeCallback);
  //     // }
  //   });
  // }

  // subscribeToTopics(topics: any[], subscribeCallback?: () => void, unsubscribeCallback?: () => void): Observable<any> {
  //   const self = this;
  //   return new Observable(observer => {
  //     if (subscriptionOptions.length > 0) {
  //       self._addSubscription(observer, subscriptionOptions, subscribeCallback, unsubscribeCallback);
  //     }
  //   });
  // }
}
