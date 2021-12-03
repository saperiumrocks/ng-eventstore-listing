import { __awaiter, __decorate, __generator } from "tslib";
import { Injectable } from '@angular/core';
var ScriptService = /** @class */ (function () {
    function ScriptService() {
        this.scripts = {};
    }
    ScriptService.prototype.init = function (scriptStore) {
        return __awaiter(this, void 0, void 0, function () {
            var promises;
            var _this = this;
            return __generator(this, function (_a) {
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
        return __awaiter(this, void 0, void 0, function () {
            var promises;
            var _this = this;
            return __generator(this, function (_a) {
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
    ScriptService = __decorate([
        Injectable()
    ], ScriptService);
    return ScriptService;
}());
export { ScriptService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyaXB0LnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy1ldmVudHN0b3JlLWxpc3RpbmcvIiwic291cmNlcyI6WyJzZXJ2aWNlcy9zY3JpcHQuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQU0zQztJQUdFO1FBRlEsWUFBTyxHQUFRLEVBQUUsQ0FBQztJQUVYLENBQUM7SUFFViw0QkFBSSxHQUFWLFVBQVcsV0FBcUI7Ozs7Ozs7d0JBQ3hCLFFBQVEsR0FBRyxFQUFFLENBQUM7d0JBQ3BCLFdBQVcsQ0FBQyxPQUFPLENBQUMsVUFBQyxNQUFjOzRCQUNqQyx1Q0FBdUM7NEJBQ3ZDLEtBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHO2dDQUMxQixNQUFNLEVBQUUsS0FBSztnQ0FDYixHQUFHLEVBQUUsTUFBTSxDQUFDLEdBQUc7Z0NBQ2YsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJOzZCQUNsQixDQUFDOzRCQUNGLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzt3QkFDeEMsQ0FBQyxDQUFDLENBQUM7d0JBRUkscUJBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBQTs0QkFBbEMsc0JBQU8sU0FBMkIsRUFBQzs7OztLQUNwQztJQUVLLDRCQUFJLEdBQVY7UUFBVyxpQkFBb0I7YUFBcEIsVUFBb0IsRUFBcEIscUJBQW9CLEVBQXBCLElBQW9CO1lBQXBCLDRCQUFvQjs7Ozs7Ozs7d0JBQ3ZCLFFBQVEsR0FBVSxFQUFFLENBQUM7d0JBQzNCLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBQyxNQUFNLElBQUssT0FBQSxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBdEMsQ0FBc0MsQ0FB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QUFDLFdBQVcsQ0FBQyxRQUFNLENBQUMsQ0FBQztpQkFDOUQ7cUJBQU07b0JBQ0wsd0NBQXdDO29CQUN4QyxPQUFPLEVBQUUsQ0FBQztpQkFDWDthQUNGO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsaUNBQVMsR0FBVCxVQUFVLFVBQWtCO1FBQzFCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBOUZVLGFBQWE7UUFEekIsVUFBVSxFQUFFO09BQ0EsYUFBYSxDQStGekI7SUFBRCxvQkFBQztDQUFBLEFBL0ZELElBK0ZDO1NBL0ZZLGFBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTY3JpcHQgfSBmcm9tICcuLi9tb2RlbHMnO1xuXG5kZWNsYXJlIHZhciBkb2N1bWVudDogYW55O1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU2NyaXB0U2VydmljZSB7XG4gIHByaXZhdGUgc2NyaXB0czogYW55ID0ge307XG5cbiAgY29uc3RydWN0b3IoKSB7fVxuXG4gIGFzeW5jIGluaXQoc2NyaXB0U3RvcmU6IFNjcmlwdFtdKSB7XG4gICAgY29uc3QgcHJvbWlzZXMgPSBbXTtcbiAgICBzY3JpcHRTdG9yZS5mb3JFYWNoKChzY3JpcHQ6IFNjcmlwdCkgPT4ge1xuICAgICAgLy8gY29uc29sZS5sb2coJ1NDUklQVCBTVE9SRSBMT0dHSU5HJyk7XG4gICAgICB0aGlzLnNjcmlwdHNbc2NyaXB0Lm5hbWVdID0ge1xuICAgICAgICBsb2FkZWQ6IGZhbHNlLFxuICAgICAgICBzcmM6IHNjcmlwdC5zcmMsXG4gICAgICAgIG1ldGE6IHNjcmlwdC5tZXRhLFxuICAgICAgfTtcbiAgICAgIHByb21pc2VzLnB1c2godGhpcy5sb2FkKHNjcmlwdC5uYW1lKSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuICB9XG5cbiAgYXN5bmMgbG9hZCguLi5zY3JpcHRzOiBzdHJpbmdbXSk6IFByb21pc2U8YW55PiB7XG4gICAgY29uc3QgcHJvbWlzZXM6IGFueVtdID0gW107XG4gICAgc2NyaXB0cy5mb3JFYWNoKChzY3JpcHQpID0+IHByb21pc2VzLnB1c2godGhpcy5sb2FkU2NyaXB0KHNjcmlwdCkpKTtcbiAgICByZXR1cm4gYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuICB9XG5cbiAgbG9hZFNjcmlwdChuYW1lOiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAvLyByZXNvbHZlIGlmIGFscmVhZHkgbG9hZGVkXG4gICAgICBpZiAodGhpcy5zY3JpcHRzW25hbWVdLmxvYWRlZCkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnTE9BREVEJyk7XG4gICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgIHNjcmlwdDogbmFtZSxcbiAgICAgICAgICBsb2FkZWQ6IHRydWUsXG4gICAgICAgICAgc3RhdHVzOiAnQWxyZWFkeSBMb2FkZWQnLFxuICAgICAgICAgIG1ldGE6IHRoaXMuc2NyaXB0c1tuYW1lXS5tZXRhLFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGV4aXN0aW5nU2NyaXB0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgaGVhZCBzY3JpcHRbc3JjPVwiJHt0aGlzLnNjcmlwdHNbbmFtZV0uc3JjfVwiXWApO1xuICAgICAgICBpZiAoZXhpc3RpbmdTY3JpcHQubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgLy8gbG9hZCBzY3JpcHRcbiAgICAgICAgICBjb25zdCBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICAgICAgICBzY3JpcHQudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnO1xuICAgICAgICAgIHNjcmlwdC5zcmMgPSB0aGlzLnNjcmlwdHNbbmFtZV0uc3JjO1xuICAgICAgICAgIGlmIChzY3JpcHQucmVhZHlTdGF0ZSkge1xuICAgICAgICAgICAgLy8gSUVcbiAgICAgICAgICAgIHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdPTiBSRUFEWVNUQVRFQ0hBTkdFJyk7XG4gICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBzY3JpcHQucmVhZHlTdGF0ZSA9PT0gJ2xvYWRlZCcgfHxcbiAgICAgICAgICAgICAgICBzY3JpcHQucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJ1xuICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0aGlzLnNjcmlwdHNbbmFtZV0ubG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgIHNjcmlwdDogbmFtZSxcbiAgICAgICAgICAgICAgICAgIGxvYWRlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogJ0xvYWRlZCcsXG4gICAgICAgICAgICAgICAgICBtZXRhOiB0aGlzLnNjcmlwdHNbbmFtZV0ubWV0YSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gT3RoZXJzXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnT05MT0FEJyk7XG4gICAgICAgICAgICBzY3JpcHQub25sb2FkID0gKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLnNjcmlwdHNbbmFtZV0ubG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgc2NyaXB0OiBuYW1lLFxuICAgICAgICAgICAgICAgIGxvYWRlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdMb2FkZWQnLFxuICAgICAgICAgICAgICAgIG1ldGE6IHRoaXMuc2NyaXB0c1tuYW1lXS5tZXRhLFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICAgIHNjcmlwdC5vbmVycm9yID0gKGVycm9yOiBhbnkpID0+XG4gICAgICAgICAgY29uc29sZS5sb2coJ09OIEVSUk9SJywgZXJyb3IpO1xuICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgIHNjcmlwdDogbmFtZSxcbiAgICAgICAgICAgICAgbG9hZGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgc3RhdHVzOiAnTG9hZGVkJyxcbiAgICAgICAgICAgICAgbWV0YTogdGhpcy5zY3JpcHRzW25hbWVdLm1ldGEsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdLmFwcGVuZENoaWxkKHNjcmlwdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gY29uc29sZS5sb2coJ1NjcmlwdCBhbHJlYWR5IGV4aXN0cycpO1xuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZ2V0U2NyaXB0KHNjcmlwdE5hbWU6IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLnNjcmlwdHNbc2NyaXB0TmFtZV07XG4gIH1cbn1cbiJdfQ==