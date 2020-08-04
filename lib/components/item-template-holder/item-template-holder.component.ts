import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ComponentFactoryResolver,
  Output,
  EventEmitter,
  OnChanges,
  ComponentRef,
  SimpleChanges,
  ChangeDetectionStrategy,
  AfterViewInit,
} from '@angular/core';
import { ItemTemplateComponent } from '../template-components/index';
import { TemplateDirective } from '../../directives/template.directive';

@Component({
  selector: 'lib-item-template-holder',
  templateUrl: './item-template-holder.component.html',
  styleUrls: ['./item-template-holder.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemTemplateHolderComponent
  implements OnInit, OnChanges, AfterViewInit {
  @Input() itemComponentClass: any;
  @Input() data: any = {};
  @Input() lookups: any = {};
  @Output() updateEmitter: EventEmitter<any> = new EventEmitter();
  @Output() updateLookupsEmitter: EventEmitter<any> = new EventEmitter();
  @Output() showModalEmitter: EventEmitter<any> = new EventEmitter();
  @Output() deleteEmitter: EventEmitter<any> = new EventEmitter();

  componentRef: ComponentRef<any>;
  initialChanges: SimpleChanges;
  @ViewChild(TemplateDirective) itemHost: TemplateDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnInit(): void {
    // this.loadComponent();
  }

  ngAfterViewInit(): void {
    this.loadComponent();
    if (this.initialChanges) {
      this.ngOnChanges(this.initialChanges);
      this.initialChanges = undefined;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const self = this;
    if (self.componentRef) {
      const changesKeys = Object.keys(changes);
      changesKeys.forEach((key) => {
        (self.componentRef.instance as ItemTemplateComponent)[key] =
          changes[key].currentValue;
      });
      (self.componentRef.instance as ItemTemplateComponent).ngOnChanges(
        changes
      );
    } else {
      this.initialChanges = changes;
    }
  }

  loadComponent(): void {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      this.itemComponentClass
    );
    const viewContainerRef = this.itemHost.viewContainerRef;
    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(componentFactory);
    (this.componentRef.instance as ItemTemplateComponent).data = this.data;
    (this.componentRef
      .instance as ItemTemplateComponent).onUpdateEmitter = this.updateEmitter;
    (this.componentRef
      .instance as ItemTemplateComponent).onUpdateLookupsEmitter = this.updateLookupsEmitter;
    (this.componentRef
      .instance as ItemTemplateComponent).onShowModalEmitter = this.showModalEmitter;
    (this.componentRef
      .instance as ItemTemplateComponent).onDeleteEmitter = this.deleteEmitter;
    // (this.componentRef.instance as ItemTemplateComponent).idPropertyName = this.idPropertyName;
    (this.componentRef
      .instance as ItemTemplateComponent).lookups = this.lookups;
    (this.componentRef.instance as ItemTemplateComponent).ngOnInit();
  }
}
