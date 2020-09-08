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
  private playbackRegistry: PlaybackRegistry = {};
  private conditionalSubscriptionRegistry: ConditionalSubscriptionRegistry = {};

  constructor(
    private scriptService: ScriptService,
    private pushService: PushService
  ) {}

  init(socketUrl: string) {
    this.pushService.init(socketUrl);
  }

  async unRegisterForPlayback(tokens: string[]) {
    // unsubscribe from push
    await this.pushService.unsubscribe(tokens);

    // unregister from playback registry
    tokens.forEach((token) => {
      delete this.playbackRegistry[token];
    });
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
    const playbackSubscriptionId = Math.random().toString(36).substr(2, 9) + '-' + Date.now().toString();

    const script = await this.scriptService.getScript(scriptName);
    let playbackScript;
    if (script) {
      playbackScript = window[script.meta.objectName];
    }

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

    const streamRevision = streamRevisionFunction(rowData);

    // Check if condition is true
    const isConditionTrue = conditionFunction ? conditionFunction(rowData) : undefined;

    let pushSubscriptionId;
    if (isConditionTrue === true || conditionFunction === undefined) {
      pushSubscriptionId = await this.pushService.subscribe(
        query,
        streamRevision,
        this,
        async (err, eventObj, owner2) => {
          // owner is playbackservice
          const self = owner2 as PlaybackService;
          const registration = self.playbackRegistry[playbackSubscriptionId];

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
      );
    }

    // If condition exists, register in conditional registry
    if (conditionFunction) {
      if (this.conditionalSubscriptionRegistry[rowId] && Array.isArray(this.conditionalSubscriptionRegistry[rowId])) {
        this.conditionalSubscriptionRegistry[rowId].push({
          playbackList: playbackList,
          playbackScript: playbackScript,
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
        this.conditionalSubscriptionRegistry[rowId] = [{
          playbackList: playbackList,
          playbackScript: playbackScript,
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


    this.playbackRegistry[playbackSubscriptionId] = {
      playbackScript: playbackScript,
      owner: owner,
      registrationId: pushSubscriptionId,
      playbackList: playbackList,
      scriptName: scriptName,
      rowId: rowId
    };



    console.log('subscribed to playback: ', playbackSubscriptionId, pushSubscriptionId, query);
    return playbackSubscriptionId;
  }

  async registerConditionalSubscriptions(
    conditionFunction: (item) => boolean,
    scriptName: string,
    owner: object,
    query: Query,
    stateFunctions: StateFunctions,
    playbackList: PlaybackList,
    rowId?: string,
    streamRevisionFunction?: (item) =>  number,
    subscriptionToken?: string
  ) {
    const script = await this.scriptService.getScript(scriptName);
    let playbackScript;
    if (script) {
      playbackScript = window[script.meta.objectName];
    }


    if (this.conditionalSubscriptionRegistry[rowId] && Array.isArray(this.conditionalSubscriptionRegistry[rowId])) {
      this.conditionalSubscriptionRegistry[rowId].push({
        playbackList: playbackList,
        playbackScript: playbackScript,
        scriptName: scriptName,
        owner: owner,
        stateFunctions: stateFunctions,
        query: query,
        streamRevisionFunction: streamRevisionFunction,
        conditionFunction: conditionFunction,
        pushSubscriptionId: subscriptionToken
      });
    } else {
      this.conditionalSubscriptionRegistry[rowId] = [{
        playbackList: playbackList,
        playbackScript: playbackScript,
        scriptName: scriptName,
        owner: owner,
        stateFunctions: stateFunctions,
        query: query,
        streamRevisionFunction: streamRevisionFunction,
        conditionFunction: conditionFunction,
        pushSubscriptionId: subscriptionToken
      }];
    }
  }

  _updateConditionalSubscriptions(rowId, rowData) {
    const conditionalSubscriptions = this.conditionalSubscriptionRegistry[rowId] || [];
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
            const registration = self.playbackRegistry[conditionalSubscription.playbackSubscriptionId];

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
        this.playbackRegistry[conditionalSubscription.playbackSubscriptionId] = {
          playbackScript: conditionalSubscription.playbackScript,
          owner: conditionalSubscription.owner,
          registrationId: pushSubscriptionId,
          playbackList: conditionalSubscription.playbackList,
          scriptName: conditionalSubscription.scriptName,
          rowId: rowId
        };

        conditionalSubscription.pushSubscriptionId = pushSubscriptionId;

        console.log('subscribed to playback: ', pushSubscriptionId, conditionalSubscription.query);
        return pushSubscriptionId;
      } else if (!conditionalSubscription.conditionFunction(rowData) && conditionalSubscription.pushSubscriptionId) {
        this.pushService.unsubscribe([conditionalSubscription.pushSubscriptionId]).then(() => {
          delete this.playbackRegistry[conditionalSubscription.playbackSubscriptionId];
          conditionalSubscription.pushSubscriptionId = undefined;
        });
      }
    });
  }

}
