import { EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
export declare abstract class HeaderFooterTemplateComponent implements OnInit {
    private changeDetectorRef;
    actionEmitter: EventEmitter<any>;
    pageChangedEmitter: EventEmitter<any>;
    filterEmitter: EventEmitter<any>;
    totalItemCount: number;
    pageStart: number;
    pageEnd: number;
    pageIndex: number;
    maxSize: number;
    itemsPerPage: number;
    actualItemCount: number;
    data: any;
    lookups: any;
    invalidSearch: boolean;
    constructor(changeDetectorRef: ChangeDetectorRef);
    ngOnInit(): void;
    updatePageValues(): void;
    onPageChanged: (event: any) => void;
    onFilter: (event: any) => void;
    onAction: (action: string, data?: any) => void;
}
