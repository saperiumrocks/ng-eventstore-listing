import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { ScriptService } from './script.service';
import { PushService } from './push.service';
import { StateFunctions } from '../models/state-functions';

// listId, rowId, revision, data
export interface PlaybackAdd {
  (listId: string, rowId: string, revision: Number, data: any): void;
}

export interface PlaybackUpdate {
  (
    listId: string,
    rowId: string,
    revision: Number,
    oldData: any,
    newData: any
  ): void;
}

export interface PlaybackDelete {
  (listId: string, rowId: string): void;
}

export interface PlaybackGetOne {
  (listId: string, rowId: string): void;
}

export interface Query {
  aggregateId?: string;
  streamId?: string;
  aggregate?: string;
  context?: string;
}

interface PlaybackRegistry {
  [key: string]: PlaybackRegistration;
}
interface PlaybackRegistration {
  playbackScript: any;
  owner: Object;
  registrationId: string;
  // playbackAdd: PlaybackAdd;
  // playbackUpdate: PlaybackUpdate;
  // playbackDelete: PlaybackDelete;
  // playbackGetOne: PlaybackGetOne;
}

// interface PlaybackFunction ( state: any, event: any, funcs: any, done: () => void)

@Injectable({
  providedIn: 'root',
})
export class PlaybackService {
  private playbackRegistry: PlaybackRegistry = {};
  constructor(
    private scriptService: ScriptService,
    private pushService: PushService
  ) {}

  // private createPlaybacklist = function (registration: PlaybackRegistration) {
  //   return {
  //     // match expected state functions as playback routine, just do dummy operations
  //     getState: function (evt, cb) {
  //       if (typeof evt === "function") {
  //         cb = evt;
  //         evt = undefined;
  //       }
  //       cb(undefined, {});
  //     },
  //     outputState: function (evt, state, cb) {
  //       if (typeof state === "function") {
  //         cb = state;
  //         state = evt;
  //         evt = undefined;
  //       }
  //       cb();
  //     },
  //     // IMPORTANT! - for playback, implement PlaybackList CUD interface via DOM
  //     playbackList: function (listId, groupId, cb) {
  //       // FOR FUTURE: var dom = document.getElementById(listId);
  //       var playbackList = {
  //         add: function (rowId, revision, data, meta, cb) {
  //           if (typeof meta === "function") {
  //             cb = meta;
  //             meta = undefined;
  //           }

  //           console.log('playbackList.add', data);
  //           registration.playbackAdd.call(registration.owner, listId, rowId, revision, data)
  //           // registration.playbackAdd(listId, rowId, revision, data);
  //           if (cb) {
  //             cb();
  //           }
  //         },
  //         update: function (rowId, revision, oldData, newData, meta, cb) {
  //           if (typeof meta === "function") {
  //             cb = meta;
  //             meta = undefined;
  //           }
  //           registration.playbackUpdate.call(
  //             registration.owner,
  //             listId,
  //             rowId,
  //             revision,
  //             oldData,
  //             newData
  //           );
  //           // registration.playbackUpdate(
  //           //   listId,
  //           //   rowId,
  //           //   revision,
  //           //   oldData,
  //           //   newData
  //           // );
  //           if (cb) {
  //             cb();
  //           }
  //         },
  //         delete: function (rowId, cb) {
  //           registration.playbackDelete.call(registration.owner, listId, rowId);
  //           // registration.playbackDelete(listId, rowId);
  //           if (cb) {
  //             cb();
  //           }
  //         },
  //         get: function (rowId, cb) {
  //           // cb(undefined, cbGet(listId, rowId));
  //           cb(undefined, registration.playbackGetOne.call(registration.owner, listId, rowId));
  //         },
  //       };
  //       cb(undefined, playbackList);
  //     },
  //   };
  // };

  async unRegisterForPlayback(token) {
    // unsubscribe from push
    await this.pushService.unsubscribe(token);

    // unregister from playback registry
    delete this.playbackRegistry[token];

    console.log('unregistered token: ', token);
  }

  async registerForPlayback(
    scriptName: string,
    owner: Object,
    // playbackAdd: PlaybackAdd,
    // playbackUpdate: PlaybackUpdate,
    // playbackDelete: PlaybackDelete,
    // playbackGetOne: PlaybackGetOne,
    query: Query,
    stateFunctions: StateFunctions,
    offset?: Number
  ) {
    const script = await this.scriptService.load(scriptName);
    console.log(script[0].meta.objectName);
    const playbackScript = window[script[0].meta.objectName];

    console.log(playbackScript);

    const subscriptionId = await this.pushService.subscribe(
      query,
      offset,
      this,
      (err, eventObj, owner, token) => {
        // owner is playbackservice
        const self = owner as PlaybackService;
        const registration = self.playbackRegistry[token];
        // call the function
        // const playbackList = self.createPlaybacklist(registration)

        if (typeof eventObj.stateType !== 'undefined' && eventObj.eventSource)
          eventObj = eventObj.eventSource;

        // registration.playbackScript.playback(
        //   undefined,
        //   eventObj,
        //   {},
        //   (err) => {
        //     if (err) {
        //       console.error("error in playing back: ", err);
        //     } else {
        //       console.log("playback done");
        //     }
        //   },
        //   playbackList
        // );
        debugger;
        const playbackFunction =
          registration.playbackScript.playbackInterface[eventObj.payload.name];

        // Retrieve state: Need to get current state from UI
        //

        const state = stateFunctions.getState(eventObj.aggregateId);
        const event = eventObj;
        const funcs = {
          emit: () => {},
          getPlaybackList: (
            playbackListName,
            callback: (err, playbackList) => void
          ) => {
            callback(null, {});
          },
        };

        const callback = () => {
          console.log('DONE');
        };

        playbackFunction(state, event, funcs, callback);
      }
    );

    // just use the subscriptionId to map the push subscription to the playback
    this.playbackRegistry[subscriptionId] = {
      playbackScript: playbackScript,
      owner: owner,
      registrationId: subscriptionId,
      // playbackAdd: playbackAdd,
      // playbackDelete: playbackDelete,
      // playbackUpdate: playbackUpdate,
      // playbackGetOne: playbackGetOne,
    };

    console.log('subscribed to playback: ', subscriptionId, query);
    return subscriptionId;
  }
}
