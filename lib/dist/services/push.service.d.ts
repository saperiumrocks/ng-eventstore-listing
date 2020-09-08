export declare class PushService {
    private ioPush;
    private subscriptions;
    constructor();
    init(socketUrl: string): void;
    subscribe(query: any, offset: any, owner: any, cb: any): string;
    unsubscribe(clientTokens: any): Promise<void>;
}
