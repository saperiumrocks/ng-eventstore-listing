import {
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
} from '@angular/core';

import {
  FormGroup, Validators, FormControl
} from '@angular/forms';

export abstract class ItemTemplateComponent implements OnInit, OnChanges {
  // Event Emitters
  onUpdateEmitter: EventEmitter<any> = new EventEmitter();
  onUpdateLookupsEmitter: EventEmitter<any> = new EventEmitter();
  onShowModalEmitter: EventEmitter<any> = new EventEmitter();
  onDeleteEmitter: EventEmitter<any> = new EventEmitter();

  idPropertyName: string;
  data: any; // Immutable item
  lookups: any;
  private _formGroup: FormGroup = new FormGroup({});
  private _formGroupKeys: string[] = [];

  _changeFn: (changes) => void;

  constructor(protected changeDetectorRef?: ChangeDetectorRef) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this._changeFn) {
      this._changeFn(changes);
    }

    const dataChanges = changes.data ? changes.data.currentValue : null;
    if (dataChanges && !changes.data.isFirstChange()) {
      const dataObj = (dataChanges as any).toJS();

      this._formGroupKeys.forEach((key) => {
        const newValue = dataObj.data[key];
        const oldValue = this._formGroup.get(key).value;

        if (newValue !== oldValue) {
          this._formGroup.get(key).setValue(newValue, { emit: false, onlySelf: true });
        }
      });

    }


    if (this.changeDetectorRef) {
      this.changeDetectorRef.detectChanges();
    }
  }

  registerChangeFunction = (changeFn: (changes) => void) => {
    this._changeFn = changeFn;
  }

  onUpdate = (propertyName: string, actionData: any) => {
    const actionEventEmitterData = {
      propertyName: propertyName,
      id: this.data.get(this.idPropertyName),
      data: actionData,
    };
    this.onUpdateEmitter.emit(actionEventEmitterData);
  }

  onUpdateLookups = (lookup) => {
    const actionEventEmitterData = {
      lookup: lookup,
    };
    this.onUpdateLookupsEmitter.emit(actionEventEmitterData);
  }

  onShowModal = (modalName, data) => {
    const actionEventEmitterData = {
      modalName: modalName,
      id: this.data.get(this.idPropertyName),
      data: data,
    };
    this.onShowModalEmitter.emit(actionEventEmitterData);
  }

  onDelete = (actionData?: any) => {
    const actionEventEmitterData = {
      id: this.data.get(this.idPropertyName),
      data: actionData,
    };
    this.onDeleteEmitter.emit(actionEventEmitterData);
  }

  // registerFormControl(propertyName: string)
  registerFormGroup = (formGroup: FormGroup): void => {
    this._formGroup = formGroup;
  }

  createFormControl(propertyName: string, initialValue: any, validators: Validators): FormControl {
    const formControl = new FormControl(initialValue, validators);
    this._formGroup.addControl(propertyName, formControl);
    this._formGroupKeys.push(propertyName);
    return formControl;
  }

}
