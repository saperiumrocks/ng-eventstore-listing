import { OnInit, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { SubscriptionConfiguration, Script, PlaybackList, RowItem, Filter, Sort, PlaybackListRequest } from './models';
import { ScriptService } from './services/script.service';
import { PlaybackService } from './services/playback.service';
import { PlaybackListService } from './services/playback-list.service';
import * as Immutable from 'immutable';
export declare class NgEventstoreListingComponent implements OnInit, OnChanges, OnDestroy {
    private changeDetectorRef;
    private scriptService;
    private playbackService;
    private playbackListService;
    updateEmitter: EventEmitter<any>;
    updateLookupsEmitter: EventEmitter<any>;
    showModalEmitter: EventEmitter<any>;
    deleteEmitter: EventEmitter<any>;
    playbackListLoadedEmitter: EventEmitter<any>;
    newItemNotifyEmitter: EventEmitter<any>;
    removedItemNotifyEmitter: EventEmitter<any>;
    itemComponentClass: any;
    lookups: {};
    socketUrl: string;
    playbackListBaseUrl: string;
    scriptStore: Script[];
    itemSubscriptionConfiguration: SubscriptionConfiguration;
    listSubscriptionConfiguration: SubscriptionConfiguration;
    playbackListName: string;
    filters: Filter[];
    sort: Sort;
    pageIndex: number;
    itemsPerPage: number;
    responseBasePath: string;
    emptyListDisplayText: string;
    csvFileName: string;
    debugging: boolean;
    _dataList: Immutable.List<RowItem>;
    _dataCount: number;
    _dataTotalCount: number;
    _initialized: boolean;
    _getPlaybackListSubscription: Subscription;
    _getPlaybackListSubject: Subject<PlaybackListRequest>;
    _exportPlaybackListSubscription: Subscription;
    _exportPlaybackListSubject: Subject<PlaybackListRequest>;
    _subscriptionTokens: string[];
    _playbackList: PlaybackList;
    _stateFunctions: {
        getState: (id: string) => any;
        setState: (id: string, data: any) => void;
    };
    constructor(changeDetectorRef: ChangeDetectorRef, scriptService: ScriptService, playbackService: PlaybackService, playbackListService: PlaybackListService);
    ngOnInit(): Promise<void>;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    trackByFn(index: number, item: any): any;
    private _initializeRequests;
    _getPlaybackList(playbackListName: string, startIndex: number, limit: number, filters?: Filter[], sort?: Sort): void;
    requestPlaybackList(): void;
    private _loadScripts;
    private _initSubscriptions;
    private _resetSubscriptions;
    _onUpdate(payload: any): void;
    _onUpdateLookups(payload: any): void;
    _onShowModal(payload: any): void;
    _onDelete(payload: any): void;
    exportCSV(): void;
}
