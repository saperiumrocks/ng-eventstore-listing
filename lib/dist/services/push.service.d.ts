import { NgZone } from '@angular/core';
export declare class PushService {
    private io;
    private ngZone;
    private ioPush;
    private subscriptions;
    constructor(io: any, ngZone: NgZone);
    init(socketUrl: string): void;
    subscribe(query: any, offset: any, owner: any, cb: any): Promise<string>;
    unsubscribe(clientToken: any): Promise<void>;
}
