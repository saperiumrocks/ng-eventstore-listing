import { Output, EventEmitter, Input, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';

export abstract class ItemTemplateComponent implements OnInit, OnChanges {
  // Event Emitters
  onUpdateEmitter: EventEmitter<any> = new EventEmitter();
  onUpdateLookupsEmitter: EventEmitter<any> = new EventEmitter();
  onShowModalEmitter: EventEmitter<any> = new EventEmitter();
  onDeleteEmitter: EventEmitter<any> = new EventEmitter();

  idPropertyName: string;
  data: any; // Immutable item
  lookups: any;

  _changeFn: (changes) => void;

  constructor(protected changeDetectorRef?: ChangeDetectorRef) {
  }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this._changeFn) {
      this._changeFn(changes);
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
      data: actionData
    };
    this.onUpdateEmitter.emit(actionEventEmitterData);
  }

  onUpdateLookups = (lookup) => {
    const actionEventEmitterData = {
      lookup: lookup
    };
    this.onUpdateLookupsEmitter.emit(actionEventEmitterData);
  }

  onShowModal = (modalName, data) => {
    const actionEventEmitterData = {
      modalName: modalName,
      id: this.data.get(this.idPropertyName),
      data: data
    };
    this.onShowModalEmitter.emit(actionEventEmitterData);
  }

  onDelete = (actionData?: any) => {
    const actionEventEmitterData = {
      id: this.data.get(this.idPropertyName),
      data: actionData
    };
    this.onDeleteEmitter.emit(actionEventEmitterData);
  }
}
