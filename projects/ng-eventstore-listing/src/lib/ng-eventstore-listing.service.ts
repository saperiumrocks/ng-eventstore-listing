import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { SubscriptionOptions } from './models/subscription-options';

import _find from 'lodash-es/find';
import _findIndex from 'lodash-es/findIndex';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NgEventstoreListingService {
  socket: any;
  observers: any[] = [];
  streamsSubscribed: any = {};

  constructor() {
    this.socket = io('http://localhost:3000/events');

    this.socket.on('connection', (socket) => {
      console.log('a user connected');
      socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    });

    this.socket.on('events', (data) => {
      console.log('message: ' + data);
    });
  }

  _addSubscription(observer: any, subscriptionOptions: SubscriptionOptions[], subscribeCallback?: () => void, unsubscribeCallback?: (topicsToUnsubscribe) => void) {
    const self = this;
    this.socket.emit('add-subscriptions', JSON.stringify(subscriptionOptions), (error, subscriptionTokens) => {
       // Associate an observer count per subscribed topic
       console.log(subscriptionTokens);
       if (subscriptionTokens) {
        subscriptionTokens.forEach((token) => {
          if (self.streamsSubscribed[token]) {
            self.streamsSubscribed[token]++;
          } else {
            self.streamsSubscribed[token] = 1;
          }
        });
       }


      // add the observer to our list of observers
      // these observers will get the topics when an event comes in from the server

       const found = _find(self.observers, (item) => item.observer === observer);
       if (!found) {
        // if found, then this is not a retry
        // then add to the list of observers and subscribe to unsubscriptions
        self.observers.push({
          observer: observer,
          streams: subscriptionTokens
        });

        observer.add(() => { // when observer unsubscribes
          const indexOfObserver = _findIndex(self.observers, (item) => {
            return item.observer === observer;
          });
          // remove from our list of observers
          self.observers.splice(indexOfObserver, 1);
          if (self.socket) {
            // Unsubscribe only the topics that have no other observers
            const streamsToUnsubscribe = [];
            subscriptionTokens.forEach((subscriptionToken) => {
              // Decrement the observer count, then add to list of topics to unsubscribe if count is 0
              if (self.streamsSubscribed[subscriptionToken]) {
                self.streamsSubscribed[subscriptionToken]--;
                if (self.streamsSubscribed[subscriptionToken] === 0) {
                  delete self.streamsSubscribed[subscriptionToken];
                  streamsToUnsubscribe.push(subscriptionToken);
                }
              }
            });

            // If there are topics to unsubscribe, then emit remove-subscriptions
            console.log('STREAMS TO UNSUBSCRIBE:', streamsToUnsubscribe);
            if (streamsToUnsubscribe.length > 0) {
              // remove our subscription from the server
              self.socket.emit('remove-subscriptions', JSON.stringify(streamsToUnsubscribe), () => {
                // if (!environment.production) {
                //   console.log('_removeSubscriptions: done unsubscribing to topics');
                //   console.log(topicsToUnsubscribe);
                // }
                if (unsubscribeCallback) {
                  unsubscribeCallback(streamsToUnsubscribe);
                }
              });
            } else {
              // if (!environment.production) {
              //   console.log('_removeSubscriptions: no topics to unsubscribe');
              // }
              if (unsubscribeCallback) {
                unsubscribeCallback(streamsToUnsubscribe);
              }
            }
          }
        });
      }

       if (subscribeCallback) {
        subscribeCallback();
      }
    });
  }

  subscribeToStreams(subscriptionOptions: SubscriptionOptions[], subscribeCallback?: any, unsubscribeCallback?: any): Observable<any> {
    const self = this;
    return new Observable(observer => {
        if (subscriptionOptions.length > 0) {
          self._addSubscription(observer, subscriptionOptions, subscribeCallback, unsubscribeCallback);
        }
    });
  }
}
