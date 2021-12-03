import { EventEmitter, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import * as ɵngcc0 from '@angular/core';
export declare abstract class ItemTemplateComponent implements OnInit, OnChanges {
    protected changeDetectorRef?: ChangeDetectorRef;
    onUpdateEmitter: EventEmitter<any>;
    onGetLookupsEmitter: EventEmitter<any>;
    onShowModalEmitter: EventEmitter<any>;
    onDeleteEmitter: EventEmitter<any>;
    idPropertyName: string;
    data: any;
    lookups: any;
    private _formGroup;
    private _formGroupKeys;
    _changeFn: (changes: any) => void;
    constructor(changeDetectorRef?: ChangeDetectorRef);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    registerChangeFunction: (changeFn: (changes: any) => void) => void;
    onUpdate: (propertyName: string, actionData: any) => void;
    onGetLookups: (lookupName: string, callback: (payload: any) => void) => void;
    onShowModal: (modalName: any, data: any) => void;
    onDelete: (actionData?: any) => void;
    registerFormGroup: (formGroup: FormGroup) => void;
    createFormControl(propertyName: string, initialValue: any, validators: Validators): FormControl;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<ItemTemplateComponent, never>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<ItemTemplateComponent, never, never, {}, {}, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlbS10ZW1wbGF0ZS5jb21wb25lbnQuZC50cyIsInNvdXJjZXMiOlsiaXRlbS10ZW1wbGF0ZS5jb21wb25lbnQuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEV2ZW50RW1pdHRlciwgT25Jbml0LCBPbkNoYW5nZXMsIFNpbXBsZUNoYW5nZXMsIENoYW5nZURldGVjdG9yUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3JtR3JvdXAsIFZhbGlkYXRvcnMsIEZvcm1Db250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuZXhwb3J0IGRlY2xhcmUgYWJzdHJhY3QgY2xhc3MgSXRlbVRlbXBsYXRlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMge1xuICAgIHByb3RlY3RlZCBjaGFuZ2VEZXRlY3RvclJlZj86IENoYW5nZURldGVjdG9yUmVmO1xuICAgIG9uVXBkYXRlRW1pdHRlcjogRXZlbnRFbWl0dGVyPGFueT47XG4gICAgb25HZXRMb29rdXBzRW1pdHRlcjogRXZlbnRFbWl0dGVyPGFueT47XG4gICAgb25TaG93TW9kYWxFbWl0dGVyOiBFdmVudEVtaXR0ZXI8YW55PjtcbiAgICBvbkRlbGV0ZUVtaXR0ZXI6IEV2ZW50RW1pdHRlcjxhbnk+O1xuICAgIGlkUHJvcGVydHlOYW1lOiBzdHJpbmc7XG4gICAgZGF0YTogYW55O1xuICAgIGxvb2t1cHM6IGFueTtcbiAgICBwcml2YXRlIF9mb3JtR3JvdXA7XG4gICAgcHJpdmF0ZSBfZm9ybUdyb3VwS2V5cztcbiAgICBfY2hhbmdlRm46IChjaGFuZ2VzOiBhbnkpID0+IHZvaWQ7XG4gICAgY29uc3RydWN0b3IoY2hhbmdlRGV0ZWN0b3JSZWY/OiBDaGFuZ2VEZXRlY3RvclJlZik7XG4gICAgbmdPbkluaXQoKTogdm9pZDtcbiAgICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZDtcbiAgICByZWdpc3RlckNoYW5nZUZ1bmN0aW9uOiAoY2hhbmdlRm46IChjaGFuZ2VzOiBhbnkpID0+IHZvaWQpID0+IHZvaWQ7XG4gICAgb25VcGRhdGU6IChwcm9wZXJ0eU5hbWU6IHN0cmluZywgYWN0aW9uRGF0YTogYW55KSA9PiB2b2lkO1xuICAgIG9uR2V0TG9va3VwczogKGxvb2t1cE5hbWU6IHN0cmluZywgY2FsbGJhY2s6IChwYXlsb2FkOiBhbnkpID0+IHZvaWQpID0+IHZvaWQ7XG4gICAgb25TaG93TW9kYWw6IChtb2RhbE5hbWU6IGFueSwgZGF0YTogYW55KSA9PiB2b2lkO1xuICAgIG9uRGVsZXRlOiAoYWN0aW9uRGF0YT86IGFueSkgPT4gdm9pZDtcbiAgICByZWdpc3RlckZvcm1Hcm91cDogKGZvcm1Hcm91cDogRm9ybUdyb3VwKSA9PiB2b2lkO1xuICAgIGNyZWF0ZUZvcm1Db250cm9sKHByb3BlcnR5TmFtZTogc3RyaW5nLCBpbml0aWFsVmFsdWU6IGFueSwgdmFsaWRhdG9yczogVmFsaWRhdG9ycyk6IEZvcm1Db250cm9sO1xufVxuIl19