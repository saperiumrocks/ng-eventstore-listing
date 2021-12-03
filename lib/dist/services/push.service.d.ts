export declare class PushService {
    private ioPush;
    private subscriptions;
    constructor();
    init(socketUrl: string): void;
    _processEvent(eventObj: any): void;
    subscribe(query: any, offset: any, owner: any, cb: any): string;
    unsubscribe(pushTokens: string[]): Promise<void>;
}
