import { EventEmitter, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
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
}
