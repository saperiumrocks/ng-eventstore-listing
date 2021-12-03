import * as tslib_1 from "tslib";
import { Component, OnInit, Input, ViewChild, ComponentFactoryResolver, Output, EventEmitter, OnChanges, ComponentRef, SimpleChanges, ChangeDetectionStrategy, AfterViewInit, } from '@angular/core';
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
ItemTemplateHolderComponent.ctorParameters = () => [
    { type: ComponentFactoryResolver }
];
tslib_1.__decorate([
    Input()
], ItemTemplateHolderComponent.prototype, "itemComponentClass", void 0);
tslib_1.__decorate([
    Input()
], ItemTemplateHolderComponent.prototype, "data", void 0);
tslib_1.__decorate([
    Input()
], ItemTemplateHolderComponent.prototype, "lookups", void 0);
tslib_1.__decorate([
    Output()
], ItemTemplateHolderComponent.prototype, "updateEmitter", void 0);
tslib_1.__decorate([
    Output()
], ItemTemplateHolderComponent.prototype, "getLookupsEmitter", void 0);
tslib_1.__decorate([
    Output()
], ItemTemplateHolderComponent.prototype, "showModalEmitter", void 0);
tslib_1.__decorate([
    Output()
], ItemTemplateHolderComponent.prototype, "deleteEmitter", void 0);
tslib_1.__decorate([
    ViewChild(TemplateDirective, { static: false })
], ItemTemplateHolderComponent.prototype, "itemHost", void 0);
ItemTemplateHolderComponent = tslib_1.__decorate([
    Component({
        selector: 'lib-item-template-holder',
        template: "<div class=\"row no-gutters\">\n  <div class=\"col-12\">\n    <ng-template libTemplateDirective></ng-template>\n  </div>\n</div>\n",
        changeDetection: ChangeDetectionStrategy.OnPush,
        styles: [""]
    })
], ItemTemplateHolderComponent);
export { ItemTemplateHolderComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlbS10ZW1wbGF0ZS1ob2xkZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmctZXZlbnRzdG9yZS1saXN0aW5nLyIsInNvdXJjZXMiOlsiY29tcG9uZW50cy9pdGVtLXRlbXBsYXRlLWhvbGRlci9pdGVtLXRlbXBsYXRlLWhvbGRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsTUFBTSxFQUNOLEtBQUssRUFDTCxTQUFTLEVBQ1Qsd0JBQXdCLEVBQ3hCLE1BQU0sRUFDTixZQUFZLEVBQ1osU0FBUyxFQUNULFlBQVksRUFDWixhQUFhLEVBQ2IsdUJBQXVCLEVBQ3ZCLGFBQWEsR0FDZCxNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQVF4RSxJQUFhLDJCQUEyQixHQUF4QyxNQUFhLDJCQUEyQjtJQWN0QyxZQUFvQix3QkFBa0Q7UUFBbEQsNkJBQXdCLEdBQXhCLHdCQUF3QixDQUEwQjtRQVg3RCxTQUFJLEdBQVEsRUFBRSxDQUFDO1FBQ2YsWUFBTyxHQUFRLEVBQUUsQ0FBQztRQUNqQixrQkFBYSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ3RELHNCQUFpQixHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQzFELHFCQUFnQixHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ3pELGtCQUFhLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7SUFNUyxDQUFDO0lBRTFFLFFBQVE7UUFDTix3QkFBd0I7SUFDMUIsQ0FBQztJQUVELGVBQWU7UUFDYixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDckIsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ3ZCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxjQUFjLEdBQUcsU0FBUyxDQUFDO1NBQ2pDO0lBQ0gsQ0FBQztJQUVELFdBQVcsQ0FBQyxPQUFzQjtRQUNoQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ3JCLE1BQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDekMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO2dCQUN6QixJQUFJLENBQUMsWUFBWSxDQUFDLFFBQWtDLENBQUMsR0FBRyxDQUFDO29CQUN4RCxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsWUFBWSxDQUFDO1lBQzlCLENBQUMsQ0FBQyxDQUFDO1lBQ0YsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFrQyxDQUFDLFdBQVcsQ0FDL0QsT0FBTyxDQUNSLENBQUM7U0FDSDthQUFNO1lBQ0wsSUFBSSxDQUFDLGNBQWMsR0FBRyxPQUFPLENBQUM7U0FDL0I7SUFDSCxDQUFDO0lBRUQsYUFBYTtRQUNYLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixDQUFDLHVCQUF1QixDQUM1RSxJQUFJLENBQUMsa0JBQWtCLENBQ3hCLENBQUM7UUFDRixNQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUM7UUFDeEQsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFekIsSUFBSSxDQUFDLFlBQVksR0FBRyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUN0RSxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQWtDLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDdEUsSUFBSSxDQUFDLFlBQVk7YUFDZixRQUFrQyxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDO1FBQzFFLElBQUksQ0FBQyxZQUFZO2FBQ2YsUUFBa0MsQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUM7UUFDbEYsSUFBSSxDQUFDLFlBQVk7YUFDZixRQUFrQyxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztRQUNoRixJQUFJLENBQUMsWUFBWTthQUNmLFFBQWtDLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7UUFDM0UsOEZBQThGO1FBQzdGLElBQUksQ0FBQyxZQUFZO2FBQ2YsUUFBa0MsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUM1RCxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQWtDLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDbkUsQ0FBQztDQUNGLENBQUE7O1lBcEQrQyx3QkFBd0I7O0FBWjdEO0lBQVIsS0FBSyxFQUFFO3VFQUF5QjtBQUN4QjtJQUFSLEtBQUssRUFBRTt5REFBZ0I7QUFDZjtJQUFSLEtBQUssRUFBRTs0REFBbUI7QUFDakI7SUFBVCxNQUFNLEVBQUU7a0VBQXVEO0FBQ3REO0lBQVQsTUFBTSxFQUFFO3NFQUEyRDtBQUMxRDtJQUFULE1BQU0sRUFBRTtxRUFBMEQ7QUFDekQ7SUFBVCxNQUFNLEVBQUU7a0VBQXVEO0FBSWY7SUFBaEQsU0FBUyxDQUFDLGlCQUFpQixFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxDQUFDOzZEQUE2QjtBQVpsRSwyQkFBMkI7SUFOdkMsU0FBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLDBCQUEwQjtRQUNwQyw4SUFBb0Q7UUFFcEQsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07O0tBQ2hELENBQUM7R0FDVywyQkFBMkIsQ0FrRXZDO1NBbEVZLDJCQUEyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgT25Jbml0LFxuICBJbnB1dCxcbiAgVmlld0NoaWxkLFxuICBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBPbkNoYW5nZXMsXG4gIENvbXBvbmVudFJlZixcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIEFmdGVyVmlld0luaXQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSXRlbVRlbXBsYXRlQ29tcG9uZW50IH0gZnJvbSAnLi4vdGVtcGxhdGUtY29tcG9uZW50cy9pbmRleCc7XG5pbXBvcnQgeyBUZW1wbGF0ZURpcmVjdGl2ZSB9IGZyb20gJy4uLy4uL2RpcmVjdGl2ZXMvdGVtcGxhdGUuZGlyZWN0aXZlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbGliLWl0ZW0tdGVtcGxhdGUtaG9sZGVyJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2l0ZW0tdGVtcGxhdGUtaG9sZGVyLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vaXRlbS10ZW1wbGF0ZS1ob2xkZXIuY29tcG9uZW50LmNzcyddLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgSXRlbVRlbXBsYXRlSG9sZGVyQ29tcG9uZW50XG4gIGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIEFmdGVyVmlld0luaXQge1xuICBASW5wdXQoKSBpdGVtQ29tcG9uZW50Q2xhc3M6IGFueTtcbiAgQElucHV0KCkgZGF0YTogYW55ID0ge307XG4gIEBJbnB1dCgpIGxvb2t1cHM6IGFueSA9IHt9O1xuICBAT3V0cHV0KCkgdXBkYXRlRW1pdHRlcjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBnZXRMb29rdXBzRW1pdHRlcjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBzaG93TW9kYWxFbWl0dGVyOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIGRlbGV0ZUVtaXR0ZXI6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIGNvbXBvbmVudFJlZjogQ29tcG9uZW50UmVmPGFueT47XG4gIGluaXRpYWxDaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzO1xuICBAVmlld0NoaWxkKFRlbXBsYXRlRGlyZWN0aXZlLCB7IHN0YXRpYzogZmFsc2UgfSkgaXRlbUhvc3Q6IFRlbXBsYXRlRGlyZWN0aXZlO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY29tcG9uZW50RmFjdG9yeVJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIpIHt9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgLy8gdGhpcy5sb2FkQ29tcG9uZW50KCk7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgdGhpcy5sb2FkQ29tcG9uZW50KCk7XG4gICAgaWYgKHRoaXMuaW5pdGlhbENoYW5nZXMpIHtcbiAgICAgIHRoaXMubmdPbkNoYW5nZXModGhpcy5pbml0aWFsQ2hhbmdlcyk7XG4gICAgICB0aGlzLmluaXRpYWxDaGFuZ2VzID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBpZiAoc2VsZi5jb21wb25lbnRSZWYpIHtcbiAgICAgIGNvbnN0IGNoYW5nZXNLZXlzID0gT2JqZWN0LmtleXMoY2hhbmdlcyk7XG4gICAgICBjaGFuZ2VzS2V5cy5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgKHNlbGYuY29tcG9uZW50UmVmLmluc3RhbmNlIGFzIEl0ZW1UZW1wbGF0ZUNvbXBvbmVudClba2V5XSA9XG4gICAgICAgICAgY2hhbmdlc1trZXldLmN1cnJlbnRWYWx1ZTtcbiAgICAgIH0pO1xuICAgICAgKHNlbGYuY29tcG9uZW50UmVmLmluc3RhbmNlIGFzIEl0ZW1UZW1wbGF0ZUNvbXBvbmVudCkubmdPbkNoYW5nZXMoXG4gICAgICAgIGNoYW5nZXNcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaW5pdGlhbENoYW5nZXMgPSBjaGFuZ2VzO1xuICAgIH1cbiAgfVxuXG4gIGxvYWRDb21wb25lbnQoKTogdm9pZCB7XG4gICAgY29uc3QgY29tcG9uZW50RmFjdG9yeSA9IHRoaXMuY29tcG9uZW50RmFjdG9yeVJlc29sdmVyLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KFxuICAgICAgdGhpcy5pdGVtQ29tcG9uZW50Q2xhc3NcbiAgICApO1xuICAgIGNvbnN0IHZpZXdDb250YWluZXJSZWYgPSB0aGlzLml0ZW1Ib3N0LnZpZXdDb250YWluZXJSZWY7XG4gICAgdmlld0NvbnRhaW5lclJlZi5jbGVhcigpO1xuXG4gICAgdGhpcy5jb21wb25lbnRSZWYgPSB2aWV3Q29udGFpbmVyUmVmLmNyZWF0ZUNvbXBvbmVudChjb21wb25lbnRGYWN0b3J5KTtcbiAgICAodGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2UgYXMgSXRlbVRlbXBsYXRlQ29tcG9uZW50KS5kYXRhID0gdGhpcy5kYXRhO1xuICAgICh0aGlzLmNvbXBvbmVudFJlZlxuICAgICAgLmluc3RhbmNlIGFzIEl0ZW1UZW1wbGF0ZUNvbXBvbmVudCkub25VcGRhdGVFbWl0dGVyID0gdGhpcy51cGRhdGVFbWl0dGVyO1xuICAgICh0aGlzLmNvbXBvbmVudFJlZlxuICAgICAgLmluc3RhbmNlIGFzIEl0ZW1UZW1wbGF0ZUNvbXBvbmVudCkub25HZXRMb29rdXBzRW1pdHRlciA9IHRoaXMuZ2V0TG9va3Vwc0VtaXR0ZXI7XG4gICAgKHRoaXMuY29tcG9uZW50UmVmXG4gICAgICAuaW5zdGFuY2UgYXMgSXRlbVRlbXBsYXRlQ29tcG9uZW50KS5vblNob3dNb2RhbEVtaXR0ZXIgPSB0aGlzLnNob3dNb2RhbEVtaXR0ZXI7XG4gICAgKHRoaXMuY29tcG9uZW50UmVmXG4gICAgICAuaW5zdGFuY2UgYXMgSXRlbVRlbXBsYXRlQ29tcG9uZW50KS5vbkRlbGV0ZUVtaXR0ZXIgPSB0aGlzLmRlbGV0ZUVtaXR0ZXI7XG4gICAgLy8gKHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlIGFzIEl0ZW1UZW1wbGF0ZUNvbXBvbmVudCkuaWRQcm9wZXJ0eU5hbWUgPSB0aGlzLmlkUHJvcGVydHlOYW1lO1xuICAgICh0aGlzLmNvbXBvbmVudFJlZlxuICAgICAgLmluc3RhbmNlIGFzIEl0ZW1UZW1wbGF0ZUNvbXBvbmVudCkubG9va3VwcyA9IHRoaXMubG9va3VwcztcbiAgICAodGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2UgYXMgSXRlbVRlbXBsYXRlQ29tcG9uZW50KS5uZ09uSW5pdCgpO1xuICB9XG59XG4iXX0=