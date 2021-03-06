import { Injectable } from '@angular/core';
import { ScriptService } from './script.service';
import { PushService } from './push.service';
import {
  StateFunctions,
  PlaybackList,
  PlaybackRegistry,
  Query,
} from '../models';

@Injectable()
export class PlaybackService {
  private playbackRegistry: PlaybackRegistry = {};
  constructor(
    private scriptService: ScriptService,
    private pushService: PushService
  ) {}

  init(socketUrl: string) {
    this.pushService.init(socketUrl);
  }

  async unRegisterForPlayback(token) {
    // unsubscribe from push
    await this.pushService.unsubscribe(token);

    // unregister from playback registry
    delete this.playbackRegistry[token];
  }

  async registerForPlayback(
    scriptName: string,
    owner: object,
    query: Query,
    stateFunctions: StateFunctions,
    offset?: number,
    playbackList?: PlaybackList
  ) {
    const script = await this.scriptService.load(scriptName);
    const playbackScript = window[script[0].meta.objectName];

    const subscriptionId = await this.pushService.subscribe(
      query,
      offset,
      this,
      (err, eventObj, owner2, token) => {
        // owner is playbackservice
        const self = owner2 as PlaybackService;
        const registration = self.playbackRegistry[token];
        // call the function
        // const playbackList = self.createPlaybacklist(registration)

        // if (typeof eventObj.stateType !== 'undefined' && eventObj.eventSource)
        //   eventObj = eventObj.eventSource;

        if (eventObj.context === 'states') {
          //
        } else {
          const playbackFunction =
            registration.playbackScript.playbackInterface[
              eventObj.payload.name
            ];

          if (playbackFunction) {
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
              stateFunctions.setState(row.rowId, row);
            };

            playbackFunction(state, eventObj, funcs, doneCallback);
          }
        }
      }
    );

    // just use the subscriptionId to map the push subscription to the playback
    this.playbackRegistry[subscriptionId] = {
      playbackScript: playbackScript,
      owner: owner,
      registrationId: subscriptionId,
      playbackList: playbackList,
    };

    console.log('subscribed to playback: ', subscriptionId, query);
    return subscriptionId;
  }
}
