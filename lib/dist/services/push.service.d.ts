export declare class PushService {
    private io;
    private ioPush;
    private subscriptions;
    constructor(io: any);
    init(socketUrl: string): void;
    subscribe(query: any, offset: any, owner: any, cb: any): Promise<string>;
    subscribeStreams(): void;
    unsubscribe(clientToken: any): Promise<void>;
}
