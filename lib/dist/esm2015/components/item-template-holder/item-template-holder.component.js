import * as tslib_1 from "tslib";
import { Component, Input, ViewChild, ComponentFactoryResolver, Output, EventEmitter, ChangeDetectionStrategy, } from '@angular/core';
import { TemplateDirective } from '../../directives/template.directive';
let ItemTemplateHolderComponent = class ItemTemplateHolderComponent {
    constructor(componentFactoryResolver) {
        this.componentFactoryResolver = componentFactoryResolver;
        this.data = {};
        this.lookups = {};
        this.updateEmitter = new EventEmitter();
        this.getLookupsEmitter = new EventEmitter();
        this.showModalEmitter = new EventEmitter();
        this.deleteEmitter = new EventEmitter();
    }
    ngOnInit() {
        // this.loadComponent();
    }
    ngAfterViewInit() {
        this.loadComponent();
        if (this.initialChanges) {
            this.ngOnChanges(this.initialChanges);
            this.initialChanges = undefined;
        }
    }
    ngOnChanges(changes) {
        const self = this;
        if (self.componentRef) {
            const changesKeys = Object.keys(changes);
            changesKeys.forEach((key) => {
                self.componentRef.instance[key] =
                    changes[key].currentValue;
            });
            self.componentRef.instance.ngOnChanges(changes);
        }
        else {
            this.initialChanges = changes;
        }
    }
    loadComponent() {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.itemComponentClass);
        const viewContainerRef = this.itemHost.viewContainerRef;
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
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], ItemTemplateHolderComponent.prototype, "itemComponentClass", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], ItemTemplateHolderComponent.prototype, "data", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], ItemTemplateHolderComponent.prototype, "lookups", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], ItemTemplateHolderComponent.prototype, "updateEmitter", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], ItemTemplateHolderComponent.prototype, "getLookupsEmitter", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], ItemTemplateHolderComponent.prototype, "showModalEmitter", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], ItemTemplateHolderComponent.prototype, "deleteEmitter", void 0);
tslib_1.__decorate([
    ViewChild(TemplateDirective),
    tslib_1.__metadata("design:type", TemplateDirective)
], ItemTemplateHolderComponent.prototype, "itemHost", void 0);
ItemTemplateHolderComponent = tslib_1.__decorate([
    Component({
        selector: 'lib-item-template-holder',
        template: "<div class=\"row no-gutters\">\n  <div class=\"col-12\">\n    <ng-template libTemplateDirective></ng-template>\n  </div>\n</div>\n",
        changeDetection: ChangeDetectionStrategy.OnPush,
        styles: [""]
    }),
    tslib_1.__metadata("design:paramtypes", [ComponentFactoryResolver])
], ItemTemplateHolderComponent);
export { ItemTemplateHolderComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlbS10ZW1wbGF0ZS1ob2xkZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmctZXZlbnRzdG9yZS1saXN0aW5nLyIsInNvdXJjZXMiOlsiY29tcG9uZW50cy9pdGVtLXRlbXBsYXRlLWhvbGRlci9pdGVtLXRlbXBsYXRlLWhvbGRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFDTCxTQUFTLEVBRVQsS0FBSyxFQUNMLFNBQVMsRUFDVCx3QkFBd0IsRUFDeEIsTUFBTSxFQUNOLFlBQVksRUFJWix1QkFBdUIsR0FFeEIsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFReEUsSUFBYSwyQkFBMkIsR0FBeEMsTUFBYSwyQkFBMkI7SUFjdEMsWUFBb0Isd0JBQWtEO1FBQWxELDZCQUF3QixHQUF4Qix3QkFBd0IsQ0FBMEI7UUFYN0QsU0FBSSxHQUFRLEVBQUUsQ0FBQztRQUNmLFlBQU8sR0FBUSxFQUFFLENBQUM7UUFDakIsa0JBQWEsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUN0RCxzQkFBaUIsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUMxRCxxQkFBZ0IsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUN6RCxrQkFBYSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO0lBTVMsQ0FBQztJQUUxRSxRQUFRO1FBQ04sd0JBQXdCO0lBQzFCLENBQUM7SUFFRCxlQUFlO1FBQ2IsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3JCLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUN2QixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUN0QyxJQUFJLENBQUMsY0FBYyxHQUFHLFNBQVMsQ0FBQztTQUNqQztJQUNILENBQUM7SUFFRCxXQUFXLENBQUMsT0FBc0I7UUFDaEMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNyQixNQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3pDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtnQkFDekIsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFrQyxDQUFDLEdBQUcsQ0FBQztvQkFDeEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFlBQVksQ0FBQztZQUM5QixDQUFDLENBQUMsQ0FBQztZQUNGLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBa0MsQ0FBQyxXQUFXLENBQy9ELE9BQU8sQ0FDUixDQUFDO1NBQ0g7YUFBTTtZQUNMLElBQUksQ0FBQyxjQUFjLEdBQUcsT0FBTyxDQUFDO1NBQy9CO0lBQ0gsQ0FBQztJQUVELGFBQWE7UUFDWCxNQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyx1QkFBdUIsQ0FDNUUsSUFBSSxDQUFDLGtCQUFrQixDQUN4QixDQUFDO1FBQ0YsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDO1FBQ3hELGdCQUFnQixDQUFDLEtBQUssRUFBRSxDQUFDO1FBRXpCLElBQUksQ0FBQyxZQUFZLEdBQUcsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDdEUsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFrQyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ3RFLElBQUksQ0FBQyxZQUFZO2FBQ2YsUUFBa0MsQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQztRQUMxRSxJQUFJLENBQUMsWUFBWTthQUNmLFFBQWtDLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDO1FBQ2xGLElBQUksQ0FBQyxZQUFZO2FBQ2YsUUFBa0MsQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7UUFDaEYsSUFBSSxDQUFDLFlBQVk7YUFDZixRQUFrQyxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDO1FBQzNFLDhGQUE4RjtRQUM3RixJQUFJLENBQUMsWUFBWTthQUNmLFFBQWtDLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDNUQsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFrQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ25FLENBQUM7Q0FDRixDQUFBO0FBaEVVO0lBQVIsS0FBSyxFQUFFOzt1RUFBeUI7QUFDeEI7SUFBUixLQUFLLEVBQUU7O3lEQUFnQjtBQUNmO0lBQVIsS0FBSyxFQUFFOzs0REFBbUI7QUFDakI7SUFBVCxNQUFNLEVBQUU7c0NBQWdCLFlBQVk7a0VBQTJCO0FBQ3REO0lBQVQsTUFBTSxFQUFFO3NDQUFvQixZQUFZO3NFQUEyQjtBQUMxRDtJQUFULE1BQU0sRUFBRTtzQ0FBbUIsWUFBWTtxRUFBMkI7QUFDekQ7SUFBVCxNQUFNLEVBQUU7c0NBQWdCLFlBQVk7a0VBQTJCO0FBSWxDO0lBQTdCLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQztzQ0FBVyxpQkFBaUI7NkRBQUM7QUFaL0MsMkJBQTJCO0lBTnZDLFNBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSwwQkFBMEI7UUFDcEMsOElBQW9EO1FBRXBELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNOztLQUNoRCxDQUFDOzZDQWU4Qyx3QkFBd0I7R0FkM0QsMkJBQTJCLENBa0V2QztTQWxFWSwyQkFBMkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIE9uSW5pdCxcbiAgSW5wdXQsXG4gIFZpZXdDaGlsZCxcbiAgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbiAgT25DaGFuZ2VzLFxuICBDb21wb25lbnRSZWYsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBBZnRlclZpZXdJbml0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEl0ZW1UZW1wbGF0ZUNvbXBvbmVudCB9IGZyb20gJy4uL3RlbXBsYXRlLWNvbXBvbmVudHMvaW5kZXgnO1xuaW1wb3J0IHsgVGVtcGxhdGVEaXJlY3RpdmUgfSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL3RlbXBsYXRlLmRpcmVjdGl2ZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2xpYi1pdGVtLXRlbXBsYXRlLWhvbGRlcicsXG4gIHRlbXBsYXRlVXJsOiAnLi9pdGVtLXRlbXBsYXRlLWhvbGRlci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2l0ZW0tdGVtcGxhdGUtaG9sZGVyLmNvbXBvbmVudC5jc3MnXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIEl0ZW1UZW1wbGF0ZUhvbGRlckNvbXBvbmVudFxuICBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBBZnRlclZpZXdJbml0IHtcbiAgQElucHV0KCkgaXRlbUNvbXBvbmVudENsYXNzOiBhbnk7XG4gIEBJbnB1dCgpIGRhdGE6IGFueSA9IHt9O1xuICBASW5wdXQoKSBsb29rdXBzOiBhbnkgPSB7fTtcbiAgQE91dHB1dCgpIHVwZGF0ZUVtaXR0ZXI6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgZ2V0TG9va3Vwc0VtaXR0ZXI6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgc2hvd01vZGFsRW1pdHRlcjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBkZWxldGVFbWl0dGVyOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBjb21wb25lbnRSZWY6IENvbXBvbmVudFJlZjxhbnk+O1xuICBpbml0aWFsQ2hhbmdlczogU2ltcGxlQ2hhbmdlcztcbiAgQFZpZXdDaGlsZChUZW1wbGF0ZURpcmVjdGl2ZSkgaXRlbUhvc3Q6IFRlbXBsYXRlRGlyZWN0aXZlO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY29tcG9uZW50RmFjdG9yeVJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIpIHt9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgLy8gdGhpcy5sb2FkQ29tcG9uZW50KCk7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgdGhpcy5sb2FkQ29tcG9uZW50KCk7XG4gICAgaWYgKHRoaXMuaW5pdGlhbENoYW5nZXMpIHtcbiAgICAgIHRoaXMubmdPbkNoYW5nZXModGhpcy5pbml0aWFsQ2hhbmdlcyk7XG4gICAgICB0aGlzLmluaXRpYWxDaGFuZ2VzID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBpZiAoc2VsZi5jb21wb25lbnRSZWYpIHtcbiAgICAgIGNvbnN0IGNoYW5nZXNLZXlzID0gT2JqZWN0LmtleXMoY2hhbmdlcyk7XG4gICAgICBjaGFuZ2VzS2V5cy5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgKHNlbGYuY29tcG9uZW50UmVmLmluc3RhbmNlIGFzIEl0ZW1UZW1wbGF0ZUNvbXBvbmVudClba2V5XSA9XG4gICAgICAgICAgY2hhbmdlc1trZXldLmN1cnJlbnRWYWx1ZTtcbiAgICAgIH0pO1xuICAgICAgKHNlbGYuY29tcG9uZW50UmVmLmluc3RhbmNlIGFzIEl0ZW1UZW1wbGF0ZUNvbXBvbmVudCkubmdPbkNoYW5nZXMoXG4gICAgICAgIGNoYW5nZXNcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaW5pdGlhbENoYW5nZXMgPSBjaGFuZ2VzO1xuICAgIH1cbiAgfVxuXG4gIGxvYWRDb21wb25lbnQoKTogdm9pZCB7XG4gICAgY29uc3QgY29tcG9uZW50RmFjdG9yeSA9IHRoaXMuY29tcG9uZW50RmFjdG9yeVJlc29sdmVyLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KFxuICAgICAgdGhpcy5pdGVtQ29tcG9uZW50Q2xhc3NcbiAgICApO1xuICAgIGNvbnN0IHZpZXdDb250YWluZXJSZWYgPSB0aGlzLml0ZW1Ib3N0LnZpZXdDb250YWluZXJSZWY7XG4gICAgdmlld0NvbnRhaW5lclJlZi5jbGVhcigpO1xuXG4gICAgdGhpcy5jb21wb25lbnRSZWYgPSB2aWV3Q29udGFpbmVyUmVmLmNyZWF0ZUNvbXBvbmVudChjb21wb25lbnRGYWN0b3J5KTtcbiAgICAodGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2UgYXMgSXRlbVRlbXBsYXRlQ29tcG9uZW50KS5kYXRhID0gdGhpcy5kYXRhO1xuICAgICh0aGlzLmNvbXBvbmVudFJlZlxuICAgICAgLmluc3RhbmNlIGFzIEl0ZW1UZW1wbGF0ZUNvbXBvbmVudCkub25VcGRhdGVFbWl0dGVyID0gdGhpcy51cGRhdGVFbWl0dGVyO1xuICAgICh0aGlzLmNvbXBvbmVudFJlZlxuICAgICAgLmluc3RhbmNlIGFzIEl0ZW1UZW1wbGF0ZUNvbXBvbmVudCkub25HZXRMb29rdXBzRW1pdHRlciA9IHRoaXMuZ2V0TG9va3Vwc0VtaXR0ZXI7XG4gICAgKHRoaXMuY29tcG9uZW50UmVmXG4gICAgICAuaW5zdGFuY2UgYXMgSXRlbVRlbXBsYXRlQ29tcG9uZW50KS5vblNob3dNb2RhbEVtaXR0ZXIgPSB0aGlzLnNob3dNb2RhbEVtaXR0ZXI7XG4gICAgKHRoaXMuY29tcG9uZW50UmVmXG4gICAgICAuaW5zdGFuY2UgYXMgSXRlbVRlbXBsYXRlQ29tcG9uZW50KS5vbkRlbGV0ZUVtaXR0ZXIgPSB0aGlzLmRlbGV0ZUVtaXR0ZXI7XG4gICAgLy8gKHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlIGFzIEl0ZW1UZW1wbGF0ZUNvbXBvbmVudCkuaWRQcm9wZXJ0eU5hbWUgPSB0aGlzLmlkUHJvcGVydHlOYW1lO1xuICAgICh0aGlzLmNvbXBvbmVudFJlZlxuICAgICAgLmluc3RhbmNlIGFzIEl0ZW1UZW1wbGF0ZUNvbXBvbmVudCkubG9va3VwcyA9IHRoaXMubG9va3VwcztcbiAgICAodGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2UgYXMgSXRlbVRlbXBsYXRlQ29tcG9uZW50KS5uZ09uSW5pdCgpO1xuICB9XG59XG4iXX0=