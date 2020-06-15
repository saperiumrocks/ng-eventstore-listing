import { Component, OnInit, ComponentFactoryResolver, Input, Output, EventEmitter, ViewChild, OnChanges, ComponentRef, SimpleChanges, forwardRef } from '@angular/core';
import { HeaderFooterTemplateComponent } from '../template-components/index';
import { TemplateDirective } from '../../directives/template.directive';

@Component({
  selector: 'lib-header-footer-template-holder',
  templateUrl: './header-footer-template-holder.component.html',
  styleUrls: ['./header-footer-template-holder.component.css']
})
export class HeaderFooterTemplateHolderComponent implements OnInit, OnChanges {
  @Input() headerComponentClass: any;
  @Input() headerData: any = {};

  @Input() pageIndex: number;
  @Input() itemsPerPage: number;
  @Input() actualItemCount: number;
  @Input() totalItemCount: number;
  @Input() maxSize = 5;

  @Output() actionEmitter: EventEmitter<any> = new EventEmitter();
  @Output() pageChangedEmitter: EventEmitter<any> = new EventEmitter();
  @Output() filterEmitter: EventEmitter<any> = new EventEmitter();

  componentRef: ComponentRef<any>;
  @ViewChild(TemplateDirective) itemHost: TemplateDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit() {
    this.loadComponent();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const self = this;
    if (self.componentRef) {
      const changesKeys = Object.keys(changes);
      changesKeys.forEach((key) => {
        (self.componentRef.instance as HeaderFooterTemplateComponent)[key] = changes[key].currentValue;
      });
      (self.componentRef.instance as HeaderFooterTemplateComponent).initPageValues();
    }
  }

  loadComponent() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.headerComponentClass);

    const viewContainerRef = this.itemHost.viewContainerRef;
    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(componentFactory);
    (this.componentRef.instance as HeaderFooterTemplateComponent).data = this.headerData;
    (this.componentRef.instance as HeaderFooterTemplateComponent).pageIndex = this.pageIndex;
    (this.componentRef.instance as HeaderFooterTemplateComponent).itemsPerPage = this.itemsPerPage;
    (this.componentRef.instance as HeaderFooterTemplateComponent).totalItemCount = this.totalItemCount;
    (this.componentRef.instance as HeaderFooterTemplateComponent).actualItemCount = this.actualItemCount;
    (this.componentRef.instance as HeaderFooterTemplateComponent).maxSize = this.maxSize;

    (this.componentRef.instance as HeaderFooterTemplateComponent).actionEmitter = this.actionEmitter;
    (this.componentRef.instance as HeaderFooterTemplateComponent).pageChangedEmitter = this.pageChangedEmitter;
    (this.componentRef.instance as HeaderFooterTemplateComponent).filterEmitter = this.filterEmitter;

    (this.componentRef.instance as HeaderFooterTemplateComponent).initPageValues();
  }

}
