import { EventEmitter, } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
var ItemTemplateComponent = /** @class */ (function () {
    function ItemTemplateComponent(changeDetectorRef) {
        var _this = this;
        this.changeDetectorRef = changeDetectorRef;
        // Event Emitters
        this.onUpdateEmitter = new EventEmitter();
        this.onGetLookupsEmitter = new EventEmitter();
        this.onShowModalEmitter = new EventEmitter();
        this.onDeleteEmitter = new EventEmitter();
        this._formGroup = new FormGroup({});
        this._formGroupKeys = [];
        this.registerChangeFunction = function (changeFn) {
            _this._changeFn = changeFn;
        };
        this.onUpdate = function (propertyName, actionData) {
            var actionEventEmitterData = {
                propertyName: propertyName,
                id: _this.data.get(_this.idPropertyName),
                data: actionData,
            };
            _this.onUpdateEmitter.emit(actionEventEmitterData);
        };
        this.onGetLookups = function (lookupName, callback) {
            var actionEventEmitterData = {
                lookupName: lookupName,
                callback: callback
            };
            _this.onGetLookupsEmitter.emit(actionEventEmitterData);
        };
        this.onShowModal = function (modalName, data) {
            var actionEventEmitterData = {
                modalName: modalName,
                id: _this.data.get(_this.idPropertyName),
                data: data,
            };
            _this.onShowModalEmitter.emit(actionEventEmitterData);
        };
        this.onDelete = function (actionData) {
            var actionEventEmitterData = {
                id: _this.data.get(_this.idPropertyName),
                data: actionData,
            };
            _this.onDeleteEmitter.emit(actionEventEmitterData);
        };
        // registerFormControl(propertyName: string)
        this.registerFormGroup = function (formGroup) {
            _this._formGroup = formGroup;
        };
    }
    ItemTemplateComponent.prototype.ngOnInit = function () { };
    ItemTemplateComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        if (this._changeFn) {
            this._changeFn(changes);
        }
        var dataChanges = changes.data ? changes.data.currentValue : null;
        if (dataChanges && !changes.data.isFirstChange()) {
            var dataObj_1 = dataChanges.toJS();
            this._formGroupKeys.forEach(function (key) {
                var newValue = dataObj_1.data[key];
                var oldValue = _this._formGroup.get(key).value;
                if (newValue !== oldValue) {
                    _this._formGroup.get(key).setValue(newValue, { emit: false, onlySelf: true });
                }
            });
        }
        if (this.changeDetectorRef) {
            this.changeDetectorRef.detectChanges();
        }
    };
    ItemTemplateComponent.prototype.createFormControl = function (propertyName, initialValue, validators) {
        var formControl = new FormControl(initialValue, validators);
        this._formGroup.addControl(propertyName, formControl);
        this._formGroupKeys.push(propertyName);
        return formControl;
    };
    return ItemTemplateComponent;
}());
export { ItemTemplateComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlbS10ZW1wbGF0ZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy1ldmVudHN0b3JlLWxpc3RpbmcvIiwic291cmNlcyI6WyJjb21wb25lbnRzL3RlbXBsYXRlLWNvbXBvbmVudHMvaXRlbS10ZW1wbGF0ZS9pdGVtLXRlbXBsYXRlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsWUFBWSxHQUtiLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFDTCxTQUFTLEVBQWMsV0FBVyxFQUNuQyxNQUFNLGdCQUFnQixDQUFDO0FBRXhCO0lBZUUsK0JBQXNCLGlCQUFxQztRQUEzRCxpQkFBK0Q7UUFBekMsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFvQjtRQWQzRCxpQkFBaUI7UUFDakIsb0JBQWUsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUN4RCx3QkFBbUIsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUM1RCx1QkFBa0IsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUMzRCxvQkFBZSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBS2hELGVBQVUsR0FBYyxJQUFJLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMxQyxtQkFBYyxHQUFhLEVBQUUsQ0FBQztRQWtDdEMsMkJBQXNCLEdBQUcsVUFBQyxRQUEyQjtZQUNuRCxLQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztRQUM1QixDQUFDLENBQUE7UUFFRCxhQUFRLEdBQUcsVUFBQyxZQUFvQixFQUFFLFVBQWU7WUFDL0MsSUFBTSxzQkFBc0IsR0FBRztnQkFDN0IsWUFBWSxFQUFFLFlBQVk7Z0JBQzFCLEVBQUUsRUFBRSxLQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFJLENBQUMsY0FBYyxDQUFDO2dCQUN0QyxJQUFJLEVBQUUsVUFBVTthQUNqQixDQUFDO1lBQ0YsS0FBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENB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QyxjQUFjLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3ZDLE9BQU8sV0FBVyxDQUFDO0lBQ3JCLENBQUM7SUFFSCw0QkFBQztBQUFELENBQUMsQUEvRkQsSUErRkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBFdmVudEVtaXR0ZXIsXG4gIE9uSW5pdCxcbiAgT25DaGFuZ2VzLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7XG4gIEZvcm1Hcm91cCwgVmFsaWRhdG9ycywgRm9ybUNvbnRyb2xcbn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgSXRlbVRlbXBsYXRlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMge1xuICAvLyBFdmVudCBFbWl0dGVyc1xuICBvblVwZGF0ZUVtaXR0ZXI6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBvbkdldExvb2t1cHNFbWl0dGVyOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgb25TaG93TW9kYWxFbWl0dGVyOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgb25EZWxldGVFbWl0dGVyOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBpZFByb3BlcnR5TmFtZTogc3RyaW5nO1xuICBkYXRhOiBhbnk7IC8vIEltbXV0YWJsZSBpdGVtXG4gIGxvb2t1cHM6IGFueTtcbiAgcHJpdmF0ZSBfZm9ybUdyb3VwOiBGb3JtR3JvdXAgPSBuZXcgRm9ybUdyb3VwKHt9KTtcbiAgcHJpdmF0ZSBfZm9ybUdyb3VwS2V5czogc3RyaW5nW10gPSBbXTtcblxuICBfY2hhbmdlRm46IChjaGFuZ2VzKSA9PiB2b2lkO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBjaGFuZ2VEZXRlY3RvclJlZj86IENoYW5nZURldGVjdG9yUmVmKSB7fVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge31cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2NoYW5nZUZuKSB7XG4gICAgICB0aGlzLl9jaGFuZ2VGbihjaGFuZ2VzKTtcbiAgICB9XG5cbiAgICBjb25zdCBkYXRhQ2hhbmdlcyA9IGNoYW5nZXMuZGF0YSA/IGNoYW5nZXMuZGF0YS5jdXJyZW50VmFsdWUgOiBudWxsO1xuICAgIGlmIChkYXRhQ2hhbmdlcyAmJiAhY2hhbmdlcy5kYXRhLmlzRmlyc3RDaGFuZ2UoKSkge1xuICAgICAgY29uc3QgZGF0YU9iaiA9IChkYXRhQ2hhbmdlcyBhcyBhbnkpLnRvSlMoKTtcblxuICAgICAgdGhpcy5fZm9ybUdyb3VwS2V5cy5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgY29uc3QgbmV3VmFsdWUgPSBkYXRhT2JqLmRhdGFba2V5XTtcbiAgICAgICAgY29uc3Qgb2xkVmFsdWUgPSB0aGlzLl9mb3JtR3JvdXAuZ2V0KGtleSkudmFsdWU7XG5cbiAgICAgICAgaWYgKG5ld1ZhbHVlICE9PSBvbGRWYWx1ZSkge1xuICAgICAgICAgIHRoaXMuX2Zvcm1Hcm91cC5nZXQoa2V5KS5zZXRWYWx1ZShuZXdWYWx1ZSwgeyBlbWl0OiBmYWxzZSwgb25seVNlbGY6IHRydWUgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgfVxuXG5cbiAgICBpZiAodGhpcy5jaGFuZ2VEZXRlY3RvclJlZikge1xuICAgICAgdGhpcy5jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfVxuICB9XG5cbiAgcmVnaXN0ZXJDaGFuZ2VGdW5jdGlvbiA9IChjaGFuZ2VGbjogKGNoYW5nZXMpID0+IHZvaWQpID0+IHtcbiAgICB0aGlzLl9jaGFuZ2VGbiA9IGNoYW5nZUZuO1xuICB9XG5cbiAgb25VcGRhdGUgPSAocHJvcGVydHlOYW1lOiBzdHJpbmcsIGFjdGlvbkRhdGE6IGFueSkgPT4ge1xuICAgIGNvbnN0IGFjdGlvbkV2ZW50RW1pdHRlckRhdGEgPSB7XG4gICAgICBwcm9wZXJ0eU5hbWU6IHByb3BlcnR5TmFtZSxcbiAgICAgIGlkOiB0aGlzLmRhdGEuZ2V0KHRoaXMuaWRQcm9wZXJ0eU5hbWUpLFxuICAgICAgZGF0YTogYWN0aW9uRGF0YSxcbiAgICB9O1xuICAgIHRoaXMub25VcGRhdGVFbWl0dGVyLmVtaXQoYWN0aW9uRXZlbnRFbWl0dGVyRGF0YSk7XG4gIH1cblxuICBvbkdldExvb2t1cHMgPSAobG9va3VwTmFtZTogc3RyaW5nLCBjYWxsYmFjazogKHBheWxvYWQ6IGFueSkgPT4gdm9pZCkgPT4ge1xuICAgIGNvbnN0IGFjdGlvbkV2ZW50RW1pdHRlckRhdGEgPSB7XG4gICAgICBsb29rdXBOYW1lOiBsb29rdXBOYW1lLFxuICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gICAgfTtcbiAgICB0aGlzLm9uR2V0TG9va3Vwc0VtaXR0ZXIuZW1pdChhY3Rpb25FdmVudEVtaXR0ZXJEYXRhKTtcbiAgfVxuXG4gIG9uU2hvd01vZGFsID0gKG1vZGFsTmFtZSwgZGF0YSkgPT4ge1xuICAgIGNvbnN0IGFjdGlvbkV2ZW50RW1pdHRlckRhdGEgPSB7XG4gICAgICBtb2RhbE5hbWU6IG1vZGFsTmFtZSxcbiAgICAgIGlkOiB0aGlzLmRhdGEuZ2V0KHRoaXMuaWRQcm9wZXJ0eU5hbWUpLFxuICAgICAgZGF0YTogZGF0YSxcbiAgICB9O1xuICAgIHRoaXMub25TaG93TW9kYWxFbWl0dGVyLmVtaXQoYWN0aW9uRXZlbnRFbWl0dGVyRGF0YSk7XG4gIH1cblxuICBvbkRlbGV0ZSA9IChhY3Rpb25EYXRhPzogYW55KSA9PiB7XG4gICAgY29uc3QgYWN0aW9uRXZlbnRFbWl0dGVyRGF0YSA9IHtcbiAgICAgIGlkOiB0aGlzLmRhdGEuZ2V0KHRoaXMuaWRQcm9wZXJ0eU5hbWUpLFxuICAgICAgZGF0YTogYWN0aW9uRGF0YSxcbiAgICB9O1xuICAgIHRoaXMub25EZWxldGVFbWl0dGVyLmVtaXQoYWN0aW9uRXZlbnRFbWl0dGVyRGF0YSk7XG4gIH1cblxuICAvLyByZWdpc3RlckZvcm1Db250cm9sKHByb3BlcnR5TmFtZTogc3RyaW5nKVxuICByZWdpc3RlckZvcm1Hcm91cCA9IChmb3JtR3JvdXA6IEZvcm1Hcm91cCk6IHZvaWQgPT4ge1xuICAgIHRoaXMuX2Zvcm1Hcm91cCA9IGZvcm1Hcm91cDtcbiAgfVxuXG4gIGNyZWF0ZUZvcm1Db250cm9sKHByb3BlcnR5TmFtZTogc3RyaW5nLCBpbml0aWFsVmFsdWU6IGFueSwgdmFsaWRhdG9yczogVmFsaWRhdG9ycyk6IEZvcm1Db250cm9sIHtcbiAgICBjb25zdCBmb3JtQ29udHJvbCA9IG5ldyBGb3JtQ29udHJvbChpbml0aWFsVmFsdWUsIHZhbGlkYXRvcnMpO1xuICAgIHRoaXMuX2Zvcm1Hcm91cC5hZGRDb250cm9sKHByb3BlcnR5TmFtZSwgZm9ybUNvbnRyb2wpO1xuICAgIHRoaXMuX2Zvcm1Hcm91cEtleXMucHVzaChwcm9wZXJ0eU5hbWUpO1xuICAgIHJldHVybiBmb3JtQ29udHJvbDtcbiAgfVxuXG59XG4iXX0=