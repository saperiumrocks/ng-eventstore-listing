import { OnInit, ComponentFactoryResolver, EventEmitter, OnChanges, ComponentRef, SimpleChanges, AfterViewInit } from '@angular/core';
import { TemplateDirective } from '../../directives/template.directive';
import * as ɵngcc0 from '@angular/core';
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
    static ɵfac: ɵngcc0.ɵɵFactoryDef<ItemTemplateHolderComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<ItemTemplateHolderComponent, "lib-item-template-holder", never, { "data": "data"; "lookups": "lookups"; "itemComponentClass": "itemComponentClass"; }, { "updateEmitter": "updateEmitter"; "getLookupsEmitter": "getLookupsEmitter"; "showModalEmitter": "showModalEmitter"; "deleteEmitter": "deleteEmitter"; }, never, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlbS10ZW1wbGF0ZS1ob2xkZXIuY29tcG9uZW50LmQudHMiLCJzb3VyY2VzIjpbIml0ZW0tdGVtcGxhdGUtaG9sZGVyLmNvbXBvbmVudC5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPbkluaXQsIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlciwgRXZlbnRFbWl0dGVyLCBPbkNoYW5nZXMsIENvbXBvbmVudFJlZiwgU2ltcGxlQ2hhbmdlcywgQWZ0ZXJWaWV3SW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgVGVtcGxhdGVEaXJlY3RpdmUgfSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL3RlbXBsYXRlLmRpcmVjdGl2ZSc7XG5leHBvcnQgZGVjbGFyZSBjbGFzcyBJdGVtVGVtcGxhdGVIb2xkZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgQWZ0ZXJWaWV3SW5pdCB7XG4gICAgcHJpdmF0ZSBjb21wb25lbnRGYWN0b3J5UmVzb2x2ZXI7XG4gICAgaXRlbUNvbXBvbmVudENsYXNzOiBhbnk7XG4gICAgZGF0YTogYW55O1xuICAgIGxvb2t1cHM6IGFueTtcbiAgICB1cGRhdGVFbWl0dGVyOiBFdmVudEVtaXR0ZXI8YW55PjtcbiAgICBnZXRMb29rdXBzRW1pdHRlcjogRXZlbnRFbWl0dGVyPGFueT47XG4gICAgc2hvd01vZGFsRW1pdHRlcjogRXZlbnRFbWl0dGVyPGFueT47XG4gICAgZGVsZXRlRW1pdHRlcjogRXZlbnRFbWl0dGVyPGFueT47XG4gICAgY29tcG9uZW50UmVmOiBDb21wb25lbnRSZWY8YW55PjtcbiAgICBpbml0aWFsQ2hhbmdlczogU2ltcGxlQ2hhbmdlcztcbiAgICBpdGVtSG9zdDogVGVtcGxhdGVEaXJlY3RpdmU7XG4gICAgY29uc3RydWN0b3IoY29tcG9uZW50RmFjdG9yeVJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIpO1xuICAgIG5nT25Jbml0KCk6IHZvaWQ7XG4gICAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQ7XG4gICAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQ7XG4gICAgbG9hZENvbXBvbmVudCgpOiB2b2lkO1xufVxuIl19