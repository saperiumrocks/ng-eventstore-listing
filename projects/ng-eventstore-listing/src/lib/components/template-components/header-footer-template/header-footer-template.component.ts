import { EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';

export abstract class HeaderFooterTemplateComponent implements OnInit {
  // Event Emitters
  actionEmitter: EventEmitter<any> = new EventEmitter();
  pageChangedEmitter: EventEmitter<any> = new EventEmitter();
  filterEmitter: EventEmitter<any> = new EventEmitter();

  // Pager
  totalItemCount: number;
  pageStart: number;
  pageEnd: number;
  pageIndex: number;
  maxSize: number;
  itemsPerPage: number;
  actualItemCount: number;

  data: any; // Immutable item
  lookups: any;

  invalidSearch: boolean;

  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit(): void { }

  updatePageValues(): void {
    this.pageStart = ((this.pageIndex - 1) * this.itemsPerPage) + 1;
    this.pageEnd = Math.min((((this.pageIndex - 1) * this.itemsPerPage) + this.actualItemCount), this.totalItemCount);
    this.changeDetectorRef.detectChanges();
  }

  onPageChanged = (event) => {
    this.pageIndex = event;
    this.updatePageValues();
    this.pageChangedEmitter.emit(event);
  }

  onFilter = (event) => {
    this.filterEmitter.emit(event);
  }

  onAction = (action: string, data?: any) => {
    const actionData = {
      action: action,
      data: data
    };
    this.actionEmitter.emit(actionData);
  }
}
