import { EventEmitter, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
export declare abstract class ItemTemplateComponent implements OnInit, OnChanges {
    protected changeDetectorRef?: ChangeDetectorRef;
    onUpdateEmitter: EventEmitter<any>;
    onUpdateLookupsEmitter: EventEmitter<any>;
    onShowModalEmitter: EventEmitter<any>;
    onDeleteEmitter: EventEmitter<any>;
    idPropertyName: string;
    data: any;
    lookups: any;
    _changeFn: (changes: any) => void;
    constructor(changeDetectorRef?: ChangeDetectorRef);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    registerChangeFunction: (changeFn: (changes: any) => void) => void;
    onUpdate: (propertyName: string, actionData: any) => void;
    onUpdateLookups: (lookup: any) => void;
    onShowModal: (modalName: any, data: any) => void;
    onDelete: (actionData?: any) => void;
}
