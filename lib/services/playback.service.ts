import { Helpers } from './../utils/helpers';
import { Injectable } from '@angular/core';
import { ScriptService } from './script.service';
import { PushService } from './push.service';
import {
  StateFunctions,
  PlaybackList,
  PlaybackRegistry,
  Query,
  ConditionalSubscriptionRegistry,
} from '../models';

@Injectable()
export class PlaybackService {
  _playbackRegistry: PlaybackRegistry = {};
  _conditionalSubscriptionRegistry: ConditionalSubscriptionRegistry = {};

  constructor(
    private scriptService: ScriptService,
    private pushService: PushService
  ) {}

  init(socketUrl: string) {
    this.pushService.init(socketUrl);
  }

  async unregisterForPlayback(playbackTokens: string[]) {
    // unregister from playback registry
    const pushTokens = playbackTokens.map((playbackToken) => {
      return this._playbackRegistry[playbackToken].pushSubscriptionId;
    });

    playbackTokens.forEach(async (token) => {
      const rowId = this._playbackRegistry[token].rowId;

      // console.log('BEFORE');
      // console.log(this._conditionalSubscriptionRegistry);

      if (rowId) {
        delete this._conditionalSubscriptionRegistry[rowId];
      }

      // console.log('AFTER');
      // console.log(this._conditionalSubscriptionRegistry);

      // unsubscribe from push
      delete this._playbackRegistry[token];
    });

    await this.pushService.unsubscribe(pushTokens);
  }

  async registerForPlayback(
    owner: object,
    scriptName: string,
    query: Query,
    stateFunctions: StateFunctions,
    playbackList: PlaybackList,
    streamRevisionFunction: (item: any) => number = (item) => 0,
    rowId?: string,
    conditionFunction?: (item: any) => boolean
  ) {
    const playbackSubscriptionId = Helpers.generateToken();

    let rowData;
    if (rowId) {
      const aggregateId = rowId ? rowId : query.aggregateId;
      rowData = await new Promise((resolve, reject) => {
        playbackList.get(aggregateId, (error, item) => {
          if (error) {
            reject(error);
          }
          resolve(item);
        });
      });
    }

    let streamRevision;
    let isConditionTrue;

    if (rowData) {
      streamRevision = streamRevisionFunction(rowData);
      isConditionTrue = conditionFunction ? conditionFunction(rowData) : undefined;
    }

    let pushSubscriptionId;
    if (isConditionTrue === true || conditionFunction === undefined) {
      pushSubscriptionId = await this.pushService.subscribe(
        query,
        streamRevision,
        this,
        async (err, eventObj, owner2) => {
          // owner is playbackservice
          const self = owner2 as PlaybackService;

          // console.log(self._playbackRegistry);

          const registration = self._playbackRegistry[playbackSubscriptionId];

          if (registration) {
            if (eventObj.aggregate === 'states') {
              const thisScriptName = registration.scriptName;
              const fromEvent = eventObj.payload._meta.fromEvent;
              const eventName = fromEvent.payload.name;
              const thisPlaybackScript = window[thisScriptName];
              const playbackFunction = thisPlaybackScript.playbackInterface[eventName];

            if (playbackFunction) {
              if (registration.rowId) {
                eventObj.aggregateId = registration.rowId;
              }
              const state = eventObj.payload;
              const funcs = {
                emit: (targetQuery, payload, done) => {
                  done();
                },
                getPlaybackList: (
                  playbackListName: string,
                  callback: (err, playbackList: PlaybackList) => void
                ) => {
                  if (registration.playbackList) {
                    callback(null, registration.playbackList);
                  } else {
                    callback(
                      new Error(
                        'PlaybackList does not exist in this registration'
                      ),
                      null
                    );
                  }
                },
              };

              const doneCallback = () => {
                registration.playbackList.get(eventObj.aggregateId, (error, item) => {
                  self._updateConditionalSubscriptions(eventObj.aggregateId, item);
                });
              };

              playbackFunction(state, fromEvent, funcs, doneCallback);
            }
            } else {
              const thisScriptName = registration.scriptName;
              const thisPlaybackScript = window[thisScriptName];
              const playbackFunction = thisPlaybackScript.playbackInterface[eventObj.payload.name];

              if (playbackFunction) {
                // Override aggregateId to handle other subscriptions
                if (registration.rowId) {
                  eventObj.aggregateId = registration.rowId;
                }
                const row = stateFunctions.getState(eventObj.aggregateId);
                const state = row.data;
                const funcs = {
                  emit: (targetQuery, payload, done) => {
                    done();
                  },
                  getPlaybackList: (
                    playbackListName: string,
                    callback: (err, playbackList: PlaybackList) => void
                  ) => {
                    if (registration.playbackList) {
                      callback(null, registration.playbackList);
                    } else {
                      callback(
                        new Error(
                          'PlaybackList does not exist in this registration'
                        ),
                        null
                      );
                    }
                  },
                };

                const doneCallback = () => {
                  registration.playbackList.get(eventObj.aggregateId, (error, item) => {
                    self._updateConditionalSubscriptions(eventObj.aggregateId, item);
                  });
                };

                playbackFunction(state, eventObj, funcs, doneCallback);
              }
            }
          }
        }
      );
    }

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
          playbackSubscriptionId: playbackSubscriptionId
        });
      } else {
        this._conditionalSubscriptionRegistry[rowId] = [{
          playbackList: playbackList,
          scriptName: scriptName,
          owner: owner,
          stateFunctions: stateFunctions,
          query: query,
          streamRevisionFunction: streamRevisionFunction,
          conditionFunction: conditionFunction,
          pushSubscriptionId: pushSubscriptionId,
          playbackSubscriptionId: playbackSubscriptionId
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

    return playbackSubscriptionId;
  }

  _updateConditionalSubscriptions(rowId, rowData) {
    const conditionalSubscriptions = this._conditionalSubscriptionRegistry[rowId] || [];
    conditionalSubscriptions.forEach(async (conditionalSubscription) => {
      if (!conditionalSubscription.pushSubscriptionId && conditionalSubscription.conditionFunction(rowData)) {
        const offset = conditionalSubscription.streamRevisionFunction(rowData);
        const pushSubscriptionId = this.pushService.subscribe(
          conditionalSubscription.query,
          offset,
          this,
          async (err, eventObj, owner2) => {
            // owner is playbackservice
            const self = owner2 as PlaybackService;
            const registration = self._playbackRegistry[conditionalSubscription.playbackSubscriptionId];

            if (eventObj.aggregate === 'states') {
              const thisScriptName = registration.scriptName;
              const fromEvent = eventObj.payload._meta.fromEvent;
              const eventName = fromEvent.payload.name;
              const thisPlaybackScript = window[thisScriptName];
              const playbackFunction = thisPlaybackScript.playbackInterface[eventName];

              if (playbackFunction) {
                const state = eventObj.payload;
                const funcs = {
                  emit: (targetQuery, payload, done) => {
                    done();
                  },
                  getPlaybackList: (
                    playbackListName: string,
                    callback: (err, playbackList: PlaybackList) => void
                  ) => {
                    if (registration.playbackList) {
                      callback(null, registration.playbackList);
                    } else {
                      callback(
                        new Error(
                          'PlaybackList does not exist in this registration'
                        ),
                        null
                      );
                    }
                  },
                };

                const doneCallback = () => {
                };
                playbackFunction(state, fromEvent, funcs, doneCallback);
              }
            } else {

              const thisScriptName = registration.scriptName;
              const thisPlaybackScript = window[thisScriptName];
              const playbackFunction = thisPlaybackScript.playbackInterface[eventObj.payload.name];

              if (playbackFunction) {
                // Override aggregateId to handle other subscriptions
                if (registration.rowId) {
                  eventObj.aggregateId = registration.rowId;
                }
                const row = conditionalSubscription.stateFunctions.getState(eventObj.aggregateId);
                const state = row.data;
                const funcs = {
                  emit: (targetQuery, payload, done) => {
                    done();
                  },
                  getPlaybackList: (
                    playbackListName: string,
                    callback: (err, playbackList: PlaybackList) => void
                  ) => {
                    if (registration.playbackList) {
                      callback(null, registration.playbackList);
                    } else {
                      callback(
                        new Error(
                          'PlaybackList does not exist in this registration'
                        ),
                        null
                      );
                    }
                  },
                };

                const doneCallback = () => {
                  // stateFunctions.setState(row.rowId, row);
                };

                playbackFunction(state, eventObj, funcs, doneCallback);
              }
            }
          }
        );

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
        return pushSubscriptionId;
      } else if (!conditionalSubscription.conditionFunction(rowData) && conditionalSubscription.pushSubscriptionId) {
        this.pushService.unsubscribe([conditionalSubscription.pushSubscriptionId]).then(() => {
          delete this._playbackRegistry[conditionalSubscription.playbackSubscriptionId];
          conditionalSubscription.pushSubscriptionId = undefined;
        });
      }
    });
  }

}
