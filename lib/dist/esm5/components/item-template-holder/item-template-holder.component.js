import { __decorate } from "tslib";
import { Component, OnInit, Input, ViewChild, ComponentFactoryResolver, Output, EventEmitter, OnChanges, ComponentRef, SimpleChanges, ChangeDetectionStrategy, AfterViewInit, } from '@angular/core';
import { TemplateDirective } from '../../directives/template.directive';
var ItemTemplateHolderComponent = /** @class */ (function () {
    function ItemTemplateHolderComponent(componentFactoryResolver) {
        this.componentFactoryResolver = componentFactoryResolver;
        this.data = {};
        this.lookups = {};
        this.updateEmitter = new EventEmitter();
        this.getLookupsEmitter = new EventEmitter();
        this.showModalEmitter = new EventEmitter();
        this.deleteEmitter = new EventEmitter();
    }
    ItemTemplateHolderComponent.prototype.ngOnInit = function () {
        // this.loadComponent();
    };
    ItemTemplateHolderComponent.prototype.ngAfterViewInit = function () {
        this.loadComponent();
        if (this.initialChanges) {
            this.ngOnChanges(this.initialChanges);
            this.initialChanges = undefined;
        }
    };
    ItemTemplateHolderComponent.prototype.ngOnChanges = function (changes) {
        var self = this;
        if (self.componentRef) {
            var changesKeys = Object.keys(changes);
            changesKeys.forEach(function (key) {
                self.componentRef.instance[key] =
                    changes[key].currentValue;
            });
            self.componentRef.instance.ngOnChanges(changes);
        }
        else {
            this.initialChanges = changes;
        }
    };
    ItemTemplateHolderComponent.prototype.loadComponent = function () {
        var componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.itemComponentClass);
        var viewContainerRef = this.itemHost.viewContainerRef;
        viewContainerRef.clear();
        this.componentRef = viewContainerRef.createComponent(componentFactory);
        this.componentRef.instance.data = this.data;
        this.componentRef
            .instance.onUpdateEmitter = this.updateEmitter;
        this.componentRef
            .instance.onGetLookupsEmitter = this.getLookupsEmitter;
        this.componentRef
            .instance.onShowModalEmitter = this.showModalEmitter;
        this.componentRef
            .instance.onDeleteEmitter = this.deleteEmitter;
        // (this.componentRef.instance as ItemTemplateComponent).idPropertyName = this.idPropertyName;
        this.componentRef
            .instance.lookups = this.lookups;
        this.componentRef.instance.ngOnInit();
    };
    ItemTemplateHolderComponent.ctorParameters = function () { return [
        { type: ComponentFactoryResolver }
    ]; };
    __decorate([
        Input()
    ], ItemTemplateHolderComponent.prototype, "itemComponentClass", void 0);
    __decorate([
        Input()
    ], ItemTemplateHolderComponent.prototype, "data", void 0);
    __decorate([
        Input()
    ], ItemTemplateHolderComponent.prototype, "lookups", void 0);
    __decorate([
        Output()
    ], ItemTemplateHolderComponent.prototype, "updateEmitter", void 0);
    __decorate([
        Output()
    ], ItemTemplateHolderComponent.prototype, "getLookupsEmitter", void 0);
    __decorate([
        Output()
    ], ItemTemplateHolderComponent.prototype, "showModalEmitter", void 0);
    __decorate([
        Output()
    ], ItemTemplateHolderComponent.prototype, "deleteEmitter", void 0);
    __decorate([
        ViewChild(TemplateDirective)
    ], ItemTemplateHolderComponent.prototype, "itemHost", void 0);
    ItemTemplateHolderComponent = __decorate([
        Component({
            selector: 'lib-item-template-holder',
            template: "<div class=\"row no-gutters\">\n  <div class=\"col-12\">\n    <ng-template libTemplateDirective></ng-template>\n  </div>\n</div>\n",
            changeDetection: ChangeDetectionStrategy.OnPush,
            styles: [""]
        })
    ], ItemTemplateHolderComponent);
    return ItemTemplateHolderComponent;
}());
export { ItemTemplateHolderComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlbS10ZW1wbGF0ZS1ob2xkZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmctZXZlbnRzdG9yZS1saXN0aW5nLyIsInNvdXJjZXMiOlsiY29tcG9uZW50cy9pdGVtLXRlbXBsYXRlLWhvbGRlci9pdGVtLXRlbXBsYXRlLWhvbGRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsTUFBTSxFQUNOLEtBQUssRUFDTCxTQUFTLEVBQ1Qsd0JBQXdCLEVBQ3hCLE1BQU0sRUFDTixZQUFZLEVBQ1osU0FBUyxFQUNULFlBQVksRUFDWixhQUFhLEVBQ2IsdUJBQXVCLEVBQ3ZCLGFBQWEsR0FDZCxNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQVF4RTtJQWNFLHFDQUFvQix3QkFBa0Q7UUFBbEQsNkJBQXdCLEdBQXhCLHdCQUF3QixDQUEwQjtRQVg3RCxTQUFJLEdBQVEsRUFBRSxDQUFDO1FBQ2YsWUFBTyxHQUFRLEVBQUUsQ0FBQztRQUNqQixrQkFBYSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ3RELHNCQUFpQixHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQzFELHFCQUFnQixHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ3pELGtCQUFhLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7SUFNUyxDQUFDO0lBRTFFLDhDQUFRLEdBQVI7UUFDRSx3QkFBd0I7SUFDMUIsQ0FBQztJQUVELHFEQUFlLEdBQWY7UUFDRSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDckIsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ3ZCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxjQUFjLEdBQUcsU0FBUyxDQUFDO1NBQ2pDO0lBQ0gsQ0FBQztJQUVELGlEQUFXLEdBQVgsVUFBWSxPQUFzQjtRQUNoQyxJQUFNLElBQUksR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ3JCLElBQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDekMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEdBQUc7Z0JBQ3JCLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBa0MsQ0FBQyxHQUFHLENBQUM7b0JBQ3hELE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxZQUFZLENBQUM7WUFDOUIsQ0FBQyxDQUFDLENBQUM7WUFDRixJQUFJLENBQUMsWUFBWSxDQUFDLFFBQWtDLENBQUMsV0FBVyxDQUMvRCxPQUFPLENBQ1IsQ0FBQztTQUNIO2FBQU07WUFDTCxJQUFJLENBQUMsY0FBYyxHQUFHLE9BQU8sQ0FBQztTQUMvQjtJQUNILENBQUM7SUFFRCxtREFBYSxHQUFiO1FBQ0UsSUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsd0JBQXdCLENBQUMsdUJBQXVCLENBQzVFLElBQUksQ0FBQyxrQkFBa0IsQ0FDeEIsQ0FBQztRQUNGLElBQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQztRQUN4RCxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUV6QixJQUFJLENBQUMsWUFBWSxHQUFHLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3RFLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBa0MsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUN0RSxJQUFJLENBQUMsWUFBWTthQUNmLFFBQWtDLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7UUFDMUUsSUFBSSxDQUFDLFlBQVk7YUFDZixRQUFrQyxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztRQUNsRixJQUFJLENBQUMsWUFBWTthQUNmLFFBQWtDLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDO1FBQ2hGLElBQUksQ0FBQyxZQUFZO2FBQ2YsUUFBa0MsQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQztRQUMzRSw4RkFBOEY7UUFDN0YsSUFBSSxDQUFDLFlBQVk7YUFDZixRQUFrQyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQzVELElBQUksQ0FBQyxZQUFZLENBQUMsUUFBa0MsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNuRSxDQUFDOztnQkFuRDZDLHdCQUF3Qjs7SUFaN0Q7UUFBUixLQUFLLEVBQUU7MkVBQXlCO0lBQ3hCO1FBQVIsS0FBSyxFQUFFOzZEQUFnQjtJQUNmO1FBQVIsS0FBSyxFQUFFO2dFQUFtQjtJQUNqQjtRQUFULE1BQU0sRUFBRTtzRUFBdUQ7SUFDdEQ7UUFBVCxNQUFNLEVBQUU7MEVBQTJEO0lBQzFEO1FBQVQsTUFBTSxFQUFFO3lFQUEwRDtJQUN6RDtRQUFULE1BQU0sRUFBRTtzRUFBdUQ7SUFJbEM7UUFBN0IsU0FBUyxDQUFDLGlCQUFpQixDQUFDO2lFQUE2QjtJQVovQywyQkFBMkI7UUFOdkMsU0FBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLDBCQUEwQjtZQUNwQyw4SUFBb0Q7WUFFcEQsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07O1NBQ2hELENBQUM7T0FDVywyQkFBMkIsQ0FrRXZDO0lBQUQsa0NBQUM7Q0FBQSxBQWxFRCxJQWtFQztTQWxFWSwyQkFBMkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIE9uSW5pdCxcbiAgSW5wdXQsXG4gIFZpZXdDaGlsZCxcbiAgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbiAgT25DaGFuZ2VzLFxuICBDb21wb25lbnRSZWYsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBBZnRlclZpZXdJbml0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEl0ZW1UZW1wbGF0ZUNvbXBvbmVudCB9IGZyb20gJy4uL3RlbXBsYXRlLWNvbXBvbmVudHMvaW5kZXgnO1xuaW1wb3J0IHsgVGVtcGxhdGVEaXJlY3RpdmUgfSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL3RlbXBsYXRlLmRpcmVjdGl2ZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2xpYi1pdGVtLXRlbXBsYXRlLWhvbGRlcicsXG4gIHRlbXBsYXRlVXJsOiAnLi9pdGVtLXRlbXBsYXRlLWhvbGRlci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2l0ZW0tdGVtcGxhdGUtaG9sZGVyLmNvbXBvbmVudC5jc3MnXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIEl0ZW1UZW1wbGF0ZUhvbGRlckNvbXBvbmVudFxuICBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBBZnRlclZpZXdJbml0IHtcbiAgQElucHV0KCkgaXRlbUNvbXBvbmVudENsYXNzOiBhbnk7XG4gIEBJbnB1dCgpIGRhdGE6IGFueSA9IHt9O1xuICBASW5wdXQoKSBsb29rdXBzOiBhbnkgPSB7fTtcbiAgQE91dHB1dCgpIHVwZGF0ZUVtaXR0ZXI6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgZ2V0TG9va3Vwc0VtaXR0ZXI6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgc2hvd01vZGFsRW1pdHRlcjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBkZWxldGVFbWl0dGVyOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBjb21wb25lbnRSZWY6IENvbXBvbmVudFJlZjxhbnk+O1xuICBpbml0aWFsQ2hhbmdlczogU2ltcGxlQ2hhbmdlcztcbiAgQFZpZXdDaGlsZChUZW1wbGF0ZURpcmVjdGl2ZSkgaXRlbUhvc3Q6IFRlbXBsYXRlRGlyZWN0aXZlO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY29tcG9uZW50RmFjdG9yeVJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIpIHt9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgLy8gdGhpcy5sb2FkQ29tcG9uZW50KCk7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgdGhpcy5sb2FkQ29tcG9uZW50KCk7XG4gICAgaWYgKHRoaXMuaW5pdGlhbENoYW5nZXMpIHtcbiAgICAgIHRoaXMubmdPbkNoYW5nZXModGhpcy5pbml0aWFsQ2hhbmdlcyk7XG4gICAgICB0aGlzLmluaXRpYWxDaGFuZ2VzID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBpZiAoc2VsZi5jb21wb25lbnRSZWYpIHtcbiAgICAgIGNvbnN0IGNoYW5nZXNLZXlzID0gT2JqZWN0LmtleXMoY2hhbmdlcyk7XG4gICAgICBjaGFuZ2VzS2V5cy5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgKHNlbGYuY29tcG9uZW50UmVmLmluc3RhbmNlIGFzIEl0ZW1UZW1wbGF0ZUNvbXBvbmVudClba2V5XSA9XG4gICAgICAgICAgY2hhbmdlc1trZXldLmN1cnJlbnRWYWx1ZTtcbiAgICAgIH0pO1xuICAgICAgKHNlbGYuY29tcG9uZW50UmVmLmluc3RhbmNlIGFzIEl0ZW1UZW1wbGF0ZUNvbXBvbmVudCkubmdPbkNoYW5nZXMoXG4gICAgICAgIGNoYW5nZXNcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaW5pdGlhbENoYW5nZXMgPSBjaGFuZ2VzO1xuICAgIH1cbiAgfVxuXG4gIGxvYWRDb21wb25lbnQoKTogdm9pZCB7XG4gICAgY29uc3QgY29tcG9uZW50RmFjdG9yeSA9IHRoaXMuY29tcG9uZW50RmFjdG9yeVJlc29sdmVyLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KFxuICAgICAgdGhpcy5pdGVtQ29tcG9uZW50Q2xhc3NcbiAgICApO1xuICAgIGNvbnN0IHZpZXdDb250YWluZXJSZWYgPSB0aGlzLml0ZW1Ib3N0LnZpZXdDb250YWluZXJSZWY7XG4gICAgdmlld0NvbnRhaW5lclJlZi5jbGVhcigpO1xuXG4gICAgdGhpcy5jb21wb25lbnRSZWYgPSB2aWV3Q29udGFpbmVyUmVmLmNyZWF0ZUNvbXBvbmVudChjb21wb25lbnRGYWN0b3J5KTtcbiAgICAodGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2UgYXMgSXRlbVRlbXBsYXRlQ29tcG9uZW50KS5kYXRhID0gdGhpcy5kYXRhO1xuICAgICh0aGlzLmNvbXBvbmVudFJlZlxuICAgICAgLmluc3RhbmNlIGFzIEl0ZW1UZW1wbGF0ZUNvbXBvbmVudCkub25VcGRhdGVFbWl0dGVyID0gdGhpcy51cGRhdGVFbWl0dGVyO1xuICAgICh0aGlzLmNvbXBvbmVudFJlZlxuICAgICAgLmluc3RhbmNlIGFzIEl0ZW1UZW1wbGF0ZUNvbXBvbmVudCkub25HZXRMb29rdXBzRW1pdHRlciA9IHRoaXMuZ2V0TG9va3Vwc0VtaXR0ZXI7XG4gICAgKHRoaXMuY29tcG9uZW50UmVmXG4gICAgICAuaW5zdGFuY2UgYXMgSXRlbVRlbXBsYXRlQ29tcG9uZW50KS5vblNob3dNb2RhbEVtaXR0ZXIgPSB0aGlzLnNob3dNb2RhbEVtaXR0ZXI7XG4gICAgKHRoaXMuY29tcG9uZW50UmVmXG4gICAgICAuaW5zdGFuY2UgYXMgSXRlbVRlbXBsYXRlQ29tcG9uZW50KS5vbkRlbGV0ZUVtaXR0ZXIgPSB0aGlzLmRlbGV0ZUVtaXR0ZXI7XG4gICAgLy8gKHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlIGFzIEl0ZW1UZW1wbGF0ZUNvbXBvbmVudCkuaWRQcm9wZXJ0eU5hbWUgPSB0aGlzLmlkUHJvcGVydHlOYW1lO1xuICAgICh0aGlzLmNvbXBvbmVudFJlZlxuICAgICAgLmluc3RhbmNlIGFzIEl0ZW1UZW1wbGF0ZUNvbXBvbmVudCkubG9va3VwcyA9IHRoaXMubG9va3VwcztcbiAgICAodGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2UgYXMgSXRlbVRlbXBsYXRlQ29tcG9uZW50KS5uZ09uSW5pdCgpO1xuICB9XG59XG4iXX0=