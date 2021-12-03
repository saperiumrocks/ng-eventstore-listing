import * as ɵngcc0 from '@angular/core';
export declare class PushService {
    private ioPush;
    private subscriptions;
    constructor();
    init(socketUrl: string): void;
    _processEvent(eventObj: any): void;
    subscribe(query: any, offset: any, owner: any, cb: any): string;
    unsubscribe(pushTokens: string[]): Promise<void>;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<PushService, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDef<PushService>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVzaC5zZXJ2aWNlLmQudHMiLCJzb3VyY2VzIjpbInB1c2guc2VydmljZS5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWNsYXJlIGNsYXNzIFB1c2hTZXJ2aWNlIHtcbiAgICBwcml2YXRlIGlvUHVzaDtcbiAgICBwcml2YXRlIHN1YnNjcmlwdGlvbnM7XG4gICAgY29uc3RydWN0b3IoKTtcbiAgICBpbml0KHNvY2tldFVybDogc3RyaW5nKTogdm9pZDtcbiAgICBfcHJvY2Vzc0V2ZW50KGV2ZW50T2JqOiBhbnkpOiB2b2lkO1xuICAgIHN1YnNjcmliZShxdWVyeTogYW55LCBvZmZzZXQ6IGFueSwgb3duZXI6IGFueSwgY2I6IGFueSk6IHN0cmluZztcbiAgICB1bnN1YnNjcmliZShwdXNoVG9rZW5zOiBzdHJpbmdbXSk6IFByb21pc2U8dm9pZD47XG59XG4iXX0=