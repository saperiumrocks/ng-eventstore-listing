import * as tslib_1 from "tslib";
import { Component, Input, ViewChild, ComponentFactoryResolver, Output, EventEmitter, ChangeDetectionStrategy, } from '@angular/core';
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
    return ItemTemplateHolderComponent;
}());
export { ItemTemplateHolderComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlbS10ZW1wbGF0ZS1ob2xkZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmctZXZlbnRzdG9yZS1saXN0aW5nLyIsInNvdXJjZXMiOlsiY29tcG9uZW50cy9pdGVtLXRlbXBsYXRlLWhvbGRlci9pdGVtLXRlbXBsYXRlLWhvbGRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFDTCxTQUFTLEVBRVQsS0FBSyxFQUNMLFNBQVMsRUFDVCx3QkFBd0IsRUFDeEIsTUFBTSxFQUNOLFlBQVksRUFJWix1QkFBdUIsR0FFeEIsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFReEU7SUFjRSxxQ0FBb0Isd0JBQWtEO1FBQWxELDZCQUF3QixHQUF4Qix3QkFBd0IsQ0FBMEI7UUFYN0QsU0FBSSxHQUFRLEVBQUUsQ0FBQztRQUNmLFlBQU8sR0FBUSxFQUFFLENBQUM7UUFDakIsa0JBQWEsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUN0RCxzQkFBaUIsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUMxRCxxQkFBZ0IsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUN6RCxrQkFBYSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO0lBTVMsQ0FBQztJQUUxRSw4Q0FBUSxHQUFSO1FBQ0Usd0JBQXdCO0lBQzFCLENBQUM7SUFFRCxxREFBZSxHQUFmO1FBQ0UsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3JCLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUN2QixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUN0QyxJQUFJLENBQUMsY0FBYyxHQUFHLFNBQVMsQ0FBQztTQUNqQztJQUNILENBQUM7SUFFRCxpREFBVyxHQUFYLFVBQVksT0FBc0I7UUFDaEMsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNyQixJQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3pDLFdBQVcsQ0FBQyxPQUFPLENBQUMsVUFBQyxHQUFHO2dCQUNyQixJQUFJLENBQUMsWUFBWSxDQUFDLFFBQWtDLENBQUMsR0FBRyxDQUFDO29CQUN4RCxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsWUFBWSxDQUFDO1lBQzlCLENBQUMsQ0FBQyxDQUFDO1lBQ0YsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFrQyxDQUFDLFdBQVcsQ0FDL0QsT0FBTyxDQUNSLENBQUM7U0FDSDthQUFNO1lBQ0wsSUFBSSxDQUFDLGNBQWMsR0FBRyxPQUFPLENBQUM7U0FDL0I7SUFDSCxDQUFDO0lBRUQsbURBQWEsR0FBYjtRQUNFLElBQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixDQUFDLHVCQUF1QixDQUM1RSxJQUFJLENBQUMsa0JBQWtCLENBQ3hCLENBQUM7UUFDRixJQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUM7UUFDeEQsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFekIsSUFBSSxDQUFDLFlBQVksR0FBRyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUN0RSxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQWtDLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDdEUsSUFBSSxDQUFDLFlBQVk7YUFDZixRQUFrQyxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDO1FBQzFFLElBQUksQ0FBQyxZQUFZO2FBQ2YsUUFBa0MsQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUM7UUFDbEYsSUFBSSxDQUFDLFlBQVk7YUFDZixRQUFrQyxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztRQUNoRixJQUFJLENBQUMsWUFBWTthQUNmLFFBQWtDLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7UUFDM0UsOEZBQThGO1FBQzdGLElBQUksQ0FBQyxZQUFZO2FBQ2YsUUFBa0MsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUM1RCxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQWtDLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDbkUsQ0FBQztJQS9EUTtRQUFSLEtBQUssRUFBRTs7MkVBQXlCO0lBQ3hCO1FBQVIsS0FBSyxFQUFFOzs2REFBZ0I7SUFDZjtRQUFSLEtBQUssRUFBRTs7Z0VBQW1CO0lBQ2pCO1FBQVQsTUFBTSxFQUFFOzBDQUFnQixZQUFZO3NFQUEyQjtJQUN0RDtRQUFULE1BQU0sRUFBRTswQ0FBb0IsWUFBWTswRUFBMkI7SUFDMUQ7UUFBVCxNQUFNLEVBQUU7MENBQW1CLFlBQVk7eUVBQTJCO0lBQ3pEO1FBQVQsTUFBTSxFQUFFOzBDQUFnQixZQUFZO3NFQUEyQjtJQUlsQztRQUE3QixTQUFTLENBQUMsaUJBQWlCLENBQUM7MENBQVcsaUJBQWlCO2lFQUFDO0lBWi9DLDJCQUEyQjtRQU52QyxTQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsMEJBQTBCO1lBQ3BDLDhJQUFvRDtZQUVwRCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTs7U0FDaEQsQ0FBQztpREFlOEMsd0JBQXdCO09BZDNELDJCQUEyQixDQWtFdkM7SUFBRCxrQ0FBQztDQUFBLEFBbEVELElBa0VDO1NBbEVZLDJCQUEyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgT25Jbml0LFxuICBJbnB1dCxcbiAgVmlld0NoaWxkLFxuICBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBPbkNoYW5nZXMsXG4gIENvbXBvbmVudFJlZixcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIEFmdGVyVmlld0luaXQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSXRlbVRlbXBsYXRlQ29tcG9uZW50IH0gZnJvbSAnLi4vdGVtcGxhdGUtY29tcG9uZW50cy9pbmRleCc7XG5pbXBvcnQgeyBUZW1wbGF0ZURpcmVjdGl2ZSB9IGZyb20gJy4uLy4uL2RpcmVjdGl2ZXMvdGVtcGxhdGUuZGlyZWN0aXZlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbGliLWl0ZW0tdGVtcGxhdGUtaG9sZGVyJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2l0ZW0tdGVtcGxhdGUtaG9sZGVyLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vaXRlbS10ZW1wbGF0ZS1ob2xkZXIuY29tcG9uZW50LmNzcyddLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgSXRlbVRlbXBsYXRlSG9sZGVyQ29tcG9uZW50XG4gIGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIEFmdGVyVmlld0luaXQge1xuICBASW5wdXQoKSBpdGVtQ29tcG9uZW50Q2xhc3M6IGFueTtcbiAgQElucHV0KCkgZGF0YTogYW55ID0ge307XG4gIEBJbnB1dCgpIGxvb2t1cHM6IGFueSA9IHt9O1xuICBAT3V0cHV0KCkgdXBkYXRlRW1pdHRlcjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBnZXRMb29rdXBzRW1pdHRlcjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBzaG93TW9kYWxFbWl0dGVyOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIGRlbGV0ZUVtaXR0ZXI6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIGNvbXBvbmVudFJlZjogQ29tcG9uZW50UmVmPGFueT47XG4gIGluaXRpYWxDaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzO1xuICBAVmlld0NoaWxkKFRlbXBsYXRlRGlyZWN0aXZlKSBpdGVtSG9zdDogVGVtcGxhdGVEaXJlY3RpdmU7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjb21wb25lbnRGYWN0b3J5UmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcikge31cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAvLyB0aGlzLmxvYWRDb21wb25lbnQoKTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmxvYWRDb21wb25lbnQoKTtcbiAgICBpZiAodGhpcy5pbml0aWFsQ2hhbmdlcykge1xuICAgICAgdGhpcy5uZ09uQ2hhbmdlcyh0aGlzLmluaXRpYWxDaGFuZ2VzKTtcbiAgICAgIHRoaXMuaW5pdGlhbENoYW5nZXMgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGlmIChzZWxmLmNvbXBvbmVudFJlZikge1xuICAgICAgY29uc3QgY2hhbmdlc0tleXMgPSBPYmplY3Qua2V5cyhjaGFuZ2VzKTtcbiAgICAgIGNoYW5nZXNLZXlzLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAoc2VsZi5jb21wb25lbnRSZWYuaW5zdGFuY2UgYXMgSXRlbVRlbXBsYXRlQ29tcG9uZW50KVtrZXldID1cbiAgICAgICAgICBjaGFuZ2VzW2tleV0uY3VycmVudFZhbHVlO1xuICAgICAgfSk7XG4gICAgICAoc2VsZi5jb21wb25lbnRSZWYuaW5zdGFuY2UgYXMgSXRlbVRlbXBsYXRlQ29tcG9uZW50KS5uZ09uQ2hhbmdlcyhcbiAgICAgICAgY2hhbmdlc1xuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5pbml0aWFsQ2hhbmdlcyA9IGNoYW5nZXM7XG4gICAgfVxuICB9XG5cbiAgbG9hZENvbXBvbmVudCgpOiB2b2lkIHtcbiAgICBjb25zdCBjb21wb25lbnRGYWN0b3J5ID0gdGhpcy5jb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIucmVzb2x2ZUNvbXBvbmVudEZhY3RvcnkoXG4gICAgICB0aGlzLml0ZW1Db21wb25lbnRDbGFzc1xuICAgICk7XG4gICAgY29uc3Qgdmlld0NvbnRhaW5lclJlZiA9IHRoaXMuaXRlbUhvc3Qudmlld0NvbnRhaW5lclJlZjtcbiAgICB2aWV3Q29udGFpbmVyUmVmLmNsZWFyKCk7XG5cbiAgICB0aGlzLmNvbXBvbmVudFJlZiA9IHZpZXdDb250YWluZXJSZWYuY3JlYXRlQ29tcG9uZW50KGNvbXBvbmVudEZhY3RvcnkpO1xuICAgICh0aGlzLmNvbXBvbmVudFJlZi5pbnN0YW5jZSBhcyBJdGVtVGVtcGxhdGVDb21wb25lbnQpLmRhdGEgPSB0aGlzLmRhdGE7XG4gICAgKHRoaXMuY29tcG9uZW50UmVmXG4gICAgICAuaW5zdGFuY2UgYXMgSXRlbVRlbXBsYXRlQ29tcG9uZW50KS5vblVwZGF0ZUVtaXR0ZXIgPSB0aGlzLnVwZGF0ZUVtaXR0ZXI7XG4gICAgKHRoaXMuY29tcG9uZW50UmVmXG4gICAgICAuaW5zdGFuY2UgYXMgSXRlbVRlbXBsYXRlQ29tcG9uZW50KS5vbkdldExvb2t1cHNFbWl0dGVyID0gdGhpcy5nZXRMb29rdXBzRW1pdHRlcjtcbiAgICAodGhpcy5jb21wb25lbnRSZWZcbiAgICAgIC5pbnN0YW5jZSBhcyBJdGVtVGVtcGxhdGVDb21wb25lbnQpLm9uU2hvd01vZGFsRW1pdHRlciA9IHRoaXMuc2hvd01vZGFsRW1pdHRlcjtcbiAgICAodGhpcy5jb21wb25lbnRSZWZcbiAgICAgIC5pbnN0YW5jZSBhcyBJdGVtVGVtcGxhdGVDb21wb25lbnQpLm9uRGVsZXRlRW1pdHRlciA9IHRoaXMuZGVsZXRlRW1pdHRlcjtcbiAgICAvLyAodGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2UgYXMgSXRlbVRlbXBsYXRlQ29tcG9uZW50KS5pZFByb3BlcnR5TmFtZSA9IHRoaXMuaWRQcm9wZXJ0eU5hbWU7XG4gICAgKHRoaXMuY29tcG9uZW50UmVmXG4gICAgICAuaW5zdGFuY2UgYXMgSXRlbVRlbXBsYXRlQ29tcG9uZW50KS5sb29rdXBzID0gdGhpcy5sb29rdXBzO1xuICAgICh0aGlzLmNvbXBvbmVudFJlZi5pbnN0YW5jZSBhcyBJdGVtVGVtcGxhdGVDb21wb25lbnQpLm5nT25Jbml0KCk7XG4gIH1cbn1cbiJdfQ==