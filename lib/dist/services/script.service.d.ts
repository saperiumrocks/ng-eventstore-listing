import { Script } from '../models';
import * as ɵngcc0 from '@angular/core';
export declare class ScriptService {
    private scripts;
    constructor();
    init(scriptStore: Script[]): Promise<any[]>;
    load(...scripts: string[]): Promise<any>;
    loadScript(name: string): Promise<any>;
    getScript(scriptName: string): any;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<ScriptService, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDef<ScriptService>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyaXB0LnNlcnZpY2UuZC50cyIsInNvdXJjZXMiOlsic2NyaXB0LnNlcnZpY2UuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTY3JpcHQgfSBmcm9tICcuLi9tb2RlbHMnO1xuZXhwb3J0IGRlY2xhcmUgY2xhc3MgU2NyaXB0U2VydmljZSB7XG4gICAgcHJpdmF0ZSBzY3JpcHRzO1xuICAgIGNvbnN0cnVjdG9yKCk7XG4gICAgaW5pdChzY3JpcHRTdG9yZTogU2NyaXB0W10pOiBQcm9taXNlPGFueVtdPjtcbiAgICBsb2FkKC4uLnNjcmlwdHM6IHN0cmluZ1tdKTogUHJvbWlzZTxhbnk+O1xuICAgIGxvYWRTY3JpcHQobmFtZTogc3RyaW5nKTogUHJvbWlzZTxhbnk+O1xuICAgIGdldFNjcmlwdChzY3JpcHROYW1lOiBzdHJpbmcpOiBhbnk7XG59XG4iXX0=