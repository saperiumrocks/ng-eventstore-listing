export declare class PushService {
    private ioPush;
    private subscriptions;
    constructor();
    init(socketUrl: string): void;
    subscribe(query: any, offset: any, owner: any, cb: any): Promise<string>;
    unsubscribe(clientToken: any): Promise<void>;
}
