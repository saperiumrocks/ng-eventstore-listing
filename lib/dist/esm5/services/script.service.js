import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
var ScriptService = /** @class */ (function () {
    function ScriptService() {
        this.scripts = {};
    }
    ScriptService.prototype.init = function (scriptStore) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var promises;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promises = [];
                        scriptStore.forEach(function (script) {
                            // console.log('SCRIPT STORE LOGGING');
                            _this.scripts[script.name] = {
                                loaded: false,
                                src: script.src,
                                meta: script.meta,
                            };
                            promises.push(_this.load(script.name));
                        });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ScriptService.prototype.load = function () {
        var scripts = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            scripts[_i] = arguments[_i];
        }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var promises;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promises = [];
                        scripts.forEach(function (script) { return promises.push(_this.loadScript(script)); });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ScriptService.prototype.loadScript = function (name) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // resolve if already loaded
            if (_this.scripts[name].loaded) {
                // console.log('LOADED');
                resolve({
                    script: name,
                    loaded: true,
                    status: 'Already Loaded',
                    meta: _this.scripts[name].meta,
                });
            }
            else {
                var existingScript = document.querySelectorAll("head script[src=\"" + _this.scripts[name].src + "\"]");
                if (existingScript.length === 0) {
                    // load script
                    var script_1 = document.createElement('script');
                    script_1.type = 'text/javascript';
                    script_1.src = _this.scripts[name].src;
                    if (script_1.readyState) {
                        // IE
                        script_1.onreadystatechange = function () {
                            // console.log('ON READYSTATECHANGE');
                            if (script_1.readyState === 'loaded' ||
                                script_1.readyState === 'complete') {
                                script_1.onreadystatechange = null;
                                _this.scripts[name].loaded = true;
                                resolve({
                                    script: name,
                                    loaded: true,
                                    status: 'Loaded',
                                    meta: _this.scripts[name].meta,
                                });
                            }
                        };
                    }
                    else {
                        // Others
                        // console.log('ONLOAD');
                        script_1.onload = function () {
                            _this.scripts[name].loaded = true;
                            resolve({
                                script: name,
                                loaded: true,
                                status: 'Loaded',
                                meta: _this.scripts[name].meta,
                            });
                        };
                    }
                    script_1.onerror = function (error) {
                        return console.log('ON ERROR', error);
                    };
                    resolve({
                        script: name,
                        loaded: false,
                        status: 'Loaded',
                        meta: _this.scripts[name].meta,
                    });
                    document.getElementsByTagName('head')[0].appendChild(script_1);
                }
                else {
                    // console.log('Script already exists');
                    resolve();
                }
            }
        });
    };
    ScriptService.prototype.getScript = function (scriptName) {
        return this.scripts[scriptName];
    };
    ScriptService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [])
    ], ScriptService);
    return ScriptService;
}());
export { ScriptService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyaXB0LnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy1ldmVudHN0b3JlLWxpc3RpbmcvIiwic291cmNlcyI6WyJzZXJ2aWNlcy9zY3JpcHQuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQU0zQztJQUdFO1FBRlEsWUFBTyxHQUFRLEVBQUUsQ0FBQztJQUVYLENBQUM7SUFFViw0QkFBSSxHQUFWLFVBQVcsV0FBcUI7Ozs7Ozs7d0JBQ3hCLFFBQVEsR0FBRyxFQUFFLENBQUM7d0JBQ3BCLFdBQVcsQ0FBQyxPQUFPLENBQUMsVUFBQyxNQUFjOzRCQUNqQyx1Q0FBdUM7NEJBQ3ZDLEtBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHO2dDQUMxQixNQUFNLEVBQUUsS0FBSztnQ0FDYixHQUFHLEVBQUUsTUFBTSxDQUFDLEdBQUc7Z0NBQ2YsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJOzZCQUNsQixDQUFDOzRCQUNGLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzt3QkFDeEMsQ0FBQyxDQUFDLENBQUM7d0JBRUkscUJBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBQTs0QkFBbEMsc0JBQU8sU0FBMkIsRUFBQzs7OztLQUNwQztJQUVLLDRCQUFJLEdBQVY7UUFBVyxpQkFBb0I7YUFBcEIsVUFBb0IsRUFBcEIscUJBQW9CLEVBQXBCLElBQW9CO1lBQXBCLDRCQUFvQjs7Ozs7Ozs7d0JBQ3ZCLFFBQVEsR0FBVSxFQUFFLENBQUM7d0JBQzNCLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBQyxNQUFNLElBQUssT0FBQSxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBdEMsQ0FBc0MsQ0FB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QUFDLFdBQVcsQ0FBQyxRQUFNLENBQUMsQ0FBQztpQkFDOUQ7cUJBQU07b0JBQ0wsd0NBQXdDO29CQUN4QyxPQUFPLEVBQUUsQ0FBQztpQkFDWDthQUNGO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsaUNBQVMsR0FBVCxVQUFVLFVBQWtCO1FBQzFCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBOUZVLGFBQWE7UUFEekIsVUFBVSxFQUFFOztPQUNBLGFBQWEsQ0ErRnpCO0lBQUQsb0JBQUM7Q0FBQSxBQS9GRCxJQStGQztTQS9GWSxhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU2NyaXB0IH0gZnJvbSAnLi4vbW9kZWxzJztcblxuZGVjbGFyZSB2YXIgZG9jdW1lbnQ6IGFueTtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFNjcmlwdFNlcnZpY2Uge1xuICBwcml2YXRlIHNjcmlwdHM6IGFueSA9IHt9O1xuXG4gIGNvbnN0cnVjdG9yKCkge31cblxuICBhc3luYyBpbml0KHNjcmlwdFN0b3JlOiBTY3JpcHRbXSkge1xuICAgIGNvbnN0IHByb21pc2VzID0gW107XG4gICAgc2NyaXB0U3RvcmUuZm9yRWFjaCgoc2NyaXB0OiBTY3JpcHQpID0+IHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdTQ1JJUFQgU1RPUkUgTE9HR0lORycpO1xuICAgICAgdGhpcy5zY3JpcHRzW3NjcmlwdC5uYW1lXSA9IHtcbiAgICAgICAgbG9hZGVkOiBmYWxzZSxcbiAgICAgICAgc3JjOiBzY3JpcHQuc3JjLFxuICAgICAgICBtZXRhOiBzY3JpcHQubWV0YSxcbiAgICAgIH07XG4gICAgICBwcm9taXNlcy5wdXNoKHRoaXMubG9hZChzY3JpcHQubmFtZSkpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgfVxuXG4gIGFzeW5jIGxvYWQoLi4uc2NyaXB0czogc3RyaW5nW10pOiBQcm9taXNlPGFueT4ge1xuICAgIGNvbnN0IHByb21pc2VzOiBhbnlbXSA9IFtdO1xuICAgIHNjcmlwdHMuZm9yRWFjaCgoc2NyaXB0KSA9PiBwcm9taXNlcy5wdXNoKHRoaXMubG9hZFNjcmlwdChzY3JpcHQpKSk7XG4gICAgcmV0dXJuIGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgfVxuXG4gIGxvYWRTY3JpcHQobmFtZTogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgLy8gcmVzb2x2ZSBpZiBhbHJlYWR5IGxvYWRlZFxuICAgICAgaWYgKHRoaXMuc2NyaXB0c1tuYW1lXS5sb2FkZWQpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ0xPQURFRCcpO1xuICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICBzY3JpcHQ6IG5hbWUsXG4gICAgICAgICAgbG9hZGVkOiB0cnVlLFxuICAgICAgICAgIHN0YXR1czogJ0FscmVhZHkgTG9hZGVkJyxcbiAgICAgICAgICBtZXRhOiB0aGlzLnNjcmlwdHNbbmFtZV0ubWV0YSxcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBleGlzdGluZ1NjcmlwdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYGhlYWQgc2NyaXB0W3NyYz1cIiR7dGhpcy5zY3JpcHRzW25hbWVdLnNyY31cIl1gKTtcbiAgICAgICAgaWYgKGV4aXN0aW5nU2NyaXB0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIC8vIGxvYWQgc2NyaXB0XG4gICAgICAgICAgY29uc3Qgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgICAgICAgc2NyaXB0LnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0JztcbiAgICAgICAgICBzY3JpcHQuc3JjID0gdGhpcy5zY3JpcHRzW25hbWVdLnNyYztcbiAgICAgICAgICBpZiAoc2NyaXB0LnJlYWR5U3RhdGUpIHtcbiAgICAgICAgICAgIC8vIElFXG4gICAgICAgICAgICBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnT04gUkVBRFlTVEFURUNIQU5HRScpO1xuICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgc2NyaXB0LnJlYWR5U3RhdGUgPT09ICdsb2FkZWQnIHx8XG4gICAgICAgICAgICAgICAgc2NyaXB0LnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZSdcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy5zY3JpcHRzW25hbWVdLmxvYWRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgICBzY3JpcHQ6IG5hbWUsXG4gICAgICAgICAgICAgICAgICBsb2FkZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdMb2FkZWQnLFxuICAgICAgICAgICAgICAgICAgbWV0YTogdGhpcy5zY3JpcHRzW25hbWVdLm1ldGEsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIE90aGVyc1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ09OTE9BRCcpO1xuICAgICAgICAgICAgc2NyaXB0Lm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5zY3JpcHRzW25hbWVdLmxvYWRlZCA9IHRydWU7XG4gICAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgIHNjcmlwdDogbmFtZSxcbiAgICAgICAgICAgICAgICBsb2FkZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnTG9hZGVkJyxcbiAgICAgICAgICAgICAgICBtZXRhOiB0aGlzLnNjcmlwdHNbbmFtZV0ubWV0YSxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgICBzY3JpcHQub25lcnJvciA9IChlcnJvcjogYW55KSA9PlxuICAgICAgICAgIGNvbnNvbGUubG9nKCdPTiBFUlJPUicsIGVycm9yKTtcbiAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICBzY3JpcHQ6IG5hbWUsXG4gICAgICAgICAgICAgIGxvYWRlZDogZmFsc2UsXG4gICAgICAgICAgICAgIHN0YXR1czogJ0xvYWRlZCcsXG4gICAgICAgICAgICAgIG1ldGE6IHRoaXMuc2NyaXB0c1tuYW1lXS5tZXRhLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXS5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdTY3JpcHQgYWxyZWFkeSBleGlzdHMnKTtcbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldFNjcmlwdChzY3JpcHROYW1lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5zY3JpcHRzW3NjcmlwdE5hbWVdO1xuICB9XG59XG4iXX0=