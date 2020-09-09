import { OnInit, ComponentFactoryResolver, EventEmitter, OnChanges, ComponentRef, SimpleChanges, AfterViewInit } from '@angular/core';
import { TemplateDirective } from '../../directives/template.directive';
export declare class ItemTemplateHolderComponent implements OnInit, OnChanges, AfterViewInit {
    private componentFactoryResolver;
    itemComponentClass: any;
    data: any;
    lookups: any;
    updateEmitter: EventEmitter<any>;
    getLookupsEmitter: EventEmitter<any>;
    showModalEmitter: EventEmitter<any>;
    deleteEmitter: EventEmitter<any>;
    componentRef: ComponentRef<any>;
    initialChanges: SimpleChanges;
    itemHost: TemplateDirective;
    constructor(componentFactoryResolver: ComponentFactoryResolver);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    loadComponent(): void;
}
