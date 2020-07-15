import { OnInit, ComponentFactoryResolver, EventEmitter, OnChanges, ComponentRef, SimpleChanges, AfterViewInit } from '@angular/core';
import { TemplateDirective } from '../../directives/template.directive';
export declare class NgHeaderFooterTemplateHolderComponent implements OnInit, OnChanges, AfterViewInit {
    private componentFactoryResolver;
    componentClass: any;
    headerData: any;
    pageIndex: number;
    itemsPerPage: number;
    actualItemCount: number;
    totalItemCount: number;
    maxSize: number;
    actionEmitter: EventEmitter<any>;
    pageChangedEmitter: EventEmitter<any>;
    filterEmitter: EventEmitter<any>;
    componentRef: ComponentRef<any>;
    itemHost: TemplateDirective;
    constructor(componentFactoryResolver: ComponentFactoryResolver);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    loadComponent(): void;
}
