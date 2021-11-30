import { EventEmitter } from '@angular/core';
var HeaderFooterTemplateComponent = /** @class */ (function () {
    function HeaderFooterTemplateComponent(changeDetectorRef) {
        var _this = this;
        this.changeDetectorRef = changeDetectorRef;
        // Event Emitters
        this.actionEmitter = new EventEmitter();
        this.pageChangedEmitter = new EventEmitter();
        this.filterEmitter = new EventEmitter();
        this.onPageChanged = function (event) {
            _this.pageIndex = event;
            _this.updatePageValues();
            _this.pageChangedEmitter.emit(event);
        };
        this.onFilter = function (event) {
            _this.filterEmitter.emit(event);
        };
        this.onAction = function (action, data) {
            var actionData = {
                action: action,
                data: data
            };
            _this.actionEmitter.emit(actionData);
        };
    }
    HeaderFooterTemplateComponent.prototype.ngOnInit = function () { };
    HeaderFooterTemplateComponent.prototype.updatePageValues = function () {
        this.pageStart = ((this.pageIndex - 1) * this.itemsPerPage) + 1;
        this.pageEnd = Math.min((((this.pageIndex - 1) * this.itemsPerPage) + this.actualItemCount), this.totalItemCount);
        this.changeDetectorRef.detectChanges();
    };
    return HeaderFooterTemplateComponent;
}());
export { HeaderFooterTemplateComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZGVyLWZvb3Rlci10ZW1wbGF0ZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy1ldmVudHN0b3JlLWxpc3RpbmcvIiwic291cmNlcyI6WyJjb21wb25lbnRzL3RlbXBsYXRlLWNvbXBvbmVudHMvaGVhZGVyLWZvb3Rlci10ZW1wbGF0ZS9oZWFkZXItZm9vdGVyLXRlbXBsYXRlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUE2QixNQUFNLGVBQWUsQ0FBQztBQUV4RTtJQW9CRSx1Q0FBb0IsaUJBQW9DO1FBQXhELGlCQUNDO1FBRG1CLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBbUI7UUFuQnhELGlCQUFpQjtRQUNqQixrQkFBYSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ3RELHVCQUFrQixHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQzNELGtCQUFhLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUEyQnRELGtCQUFhLEdBQUcsVUFBQyxLQUFLO1lBQ3BCLEtBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1lBQ3ZCLEtBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1lBQ3hCLEtBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdEMsQ0FBQyxDQUFBO1FBRUQsYUFBUSxHQUFHLFVBQUMsS0FBSztZQUNmLEtBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2pDLENBQUMsQ0FBQTtRQUVELGFBQVEsR0FBRyxVQUFDLE1BQWMsRUFBRSxJQUFVO1lBQ3BDLElBQU0sVUFBVSxHQUFHO2dCQUNqQixNQUFNLEVBQUUsTUFBTTtnQkFDZCxJQUFJLEVBQUUsSUFBSTthQUNYLENBQUM7WUFDRixLQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN0QyxDQUFDLENBQUE7SUExQkQsQ0FBQztJQUVELGdEQUFRLEdBQVIsY0FBbUIsQ0FBQztJQUVwQix3REFBZ0IsR0FBaEI7UUFDRSxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDaEUsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDbEgsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ3pDLENBQUM7SUFtQkgsb0NBQUM7QUFBRCxDQUFDLEFBaERELElBZ0RDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXZlbnRFbWl0dGVyLCBPbkluaXQsIENoYW5nZURldGVjdG9yUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBIZWFkZXJGb290ZXJUZW1wbGF0ZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIC8vIEV2ZW50IEVtaXR0ZXJzXG4gIGFjdGlvbkVtaXR0ZXI6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBwYWdlQ2hhbmdlZEVtaXR0ZXI6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBmaWx0ZXJFbWl0dGVyOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAvLyBQYWdlclxuICB0b3RhbEl0ZW1Db3VudDogbnVtYmVyO1xuICBwYWdlU3RhcnQ6IG51bWJlcjtcbiAgcGFnZUVuZDogbnVtYmVyO1xuICBwYWdlSW5kZXg6IG51bWJlcjtcbiAgbWF4U2l6ZTogbnVtYmVyO1xuICBpdGVtc1BlclBhZ2U6IG51bWJlcjtcbiAgYWN0dWFsSXRlbUNvdW50OiBudW1iZXI7XG5cbiAgZGF0YTogYW55OyAvLyBJbW11dGFibGUgaXRlbVxuICBsb29rdXBzOiBhbnk7XG5cbiAgaW52YWxpZFNlYXJjaDogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZikge1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7IH1cblxuICB1cGRhdGVQYWdlVmFsdWVzKCk6IHZvaWQge1xuICAgIHRoaXMucGFnZVN0YXJ0ID0gKCh0aGlzLnBhZ2VJbmRleCAtIDEpICogdGhpcy5pdGVtc1BlclBhZ2UpICsgMTtcbiAgICB0aGlzLnBhZ2VFbmQgPSBNYXRoLm1pbigoKCh0aGlzLnBhZ2VJbmRleCAtIDEpICogdGhpcy5pdGVtc1BlclBhZ2UpICsgdGhpcy5hY3R1YWxJdGVtQ291bnQpLCB0aGlzLnRvdGFsSXRlbUNvdW50KTtcbiAgICB0aGlzLmNoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgfVxuXG4gIG9uUGFnZUNoYW5nZWQgPSAoZXZlbnQpID0+IHtcbiAgICB0aGlzLnBhZ2VJbmRleCA9IGV2ZW50O1xuICAgIHRoaXMudXBkYXRlUGFnZVZhbHVlcygpO1xuICAgIHRoaXMucGFnZUNoYW5nZWRFbWl0dGVyLmVtaXQoZXZlbnQpO1xuICB9XG5cbiAgb25GaWx0ZXIgPSAoZXZlbnQpID0+IHtcbiAgICB0aGlzLmZpbHRlckVtaXR0ZXIuZW1pdChldmVudCk7XG4gIH1cblxuICBvbkFjdGlvbiA9IChhY3Rpb246IHN0cmluZywgZGF0YT86IGFueSkgPT4ge1xuICAgIGNvbnN0IGFjdGlvbkRhdGEgPSB7XG4gICAgICBhY3Rpb246IGFjdGlvbixcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9O1xuICAgIHRoaXMuYWN0aW9uRW1pdHRlci5lbWl0KGFjdGlvbkRhdGEpO1xuICB9XG59XG4iXX0=