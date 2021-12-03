import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
let ScriptService = class ScriptService {
    constructor() {
        this.scripts = {};
    }
    init(scriptStore) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const promises = [];
            scriptStore.forEach((script) => {
                // console.log('SCRIPT STORE LOGGING');
                this.scripts[script.name] = {
                    loaded: false,
                    src: script.src,
                    meta: script.meta,
                };
                promises.push(this.load(script.name));
            });
            return yield Promise.all(promises);
        });
    }
    load(...scripts) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const promises = [];
            scripts.forEach((script) => promises.push(this.loadScript(script)));
            return yield Promise.all(promises);
        });
    }
    loadScript(name) {
        return new Promise((resolve, reject) => {
            // resolve if already loaded
            if (this.scripts[name].loaded) {
                // console.log('LOADED');
                resolve({
                    script: name,
                    loaded: true,
                    status: 'Already Loaded',
                    meta: this.scripts[name].meta,
                });
            }
            else {
                const existingScript = document.querySelectorAll(`head script[src="${this.scripts[name].src}"]`);
                if (existingScript.length === 0) {
                    // load script
                    const script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.src = this.scripts[name].src;
                    if (script.readyState) {
                        // IE
                        script.onreadystatechange = () => {
                            // console.log('ON READYSTATECHANGE');
                            if (script.readyState === 'loaded' ||
                                script.readyState === 'complete') {
                                script.onreadystatechange = null;
                                this.scripts[name].loaded = true;
                                resolve({
                                    script: name,
                                    loaded: true,
                                    status: 'Loaded',
                                    meta: this.scripts[name].meta,
                                });
                            }
                        };
                    }
                    else {
                        // Others
                        // console.log('ONLOAD');
                        script.onload = () => {
                            this.scripts[name].loaded = true;
                            resolve({
                                script: name,
                                loaded: true,
                                status: 'Loaded',
                                meta: this.scripts[name].meta,
                            });
                        };
                    }
                    script.onerror = (error) => console.log('ON ERROR', error);
                    resolve({
                        script: name,
                        loaded: false,
                        status: 'Loaded',
                        meta: this.scripts[name].meta,
                    });
                    document.getElementsByTagName('head')[0].appendChild(script);
                }
                else {
                    // console.log('Script already exists');
                    resolve();
                }
            }
        });
    }
    getScript(scriptName) {
        return this.scripts[scriptName];
    }
};
ScriptService = tslib_1.__decorate([
    Injectable()
], ScriptService);
export { ScriptService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyaXB0LnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy1ldmVudHN0b3JlLWxpc3RpbmcvIiwic291cmNlcyI6WyJzZXJ2aWNlcy9zY3JpcHQuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQU0zQyxJQUFhLGFBQWEsR0FBMUIsTUFBYSxhQUFhO0lBR3hCO1FBRlEsWUFBTyxHQUFRLEVBQUUsQ0FBQztJQUVYLENBQUM7SUFFVixJQUFJLENBQUMsV0FBcUI7O1lBQzlCLE1BQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQztZQUNwQixXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBYyxFQUFFLEVBQUU7Z0JBQ3JDLHVDQUF1QztnQkFDdkMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUc7b0JBQzFCLE1BQU0sRUFBRSxLQUFLO29CQUNiLEdBQUcsRUFBRSxNQUFNLENBQUMsR0FBRztvQkFDZixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUk7aUJBQ2xCLENBQUM7Z0JBQ0YsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3hDLENBQUMsQ0FBQyxDQUFDO1lBRUgsT0FBTyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDckMsQ0FBQztLQUFBO0lBRUssSUFBSSxDQUFDLEdBQUcsT0FBaUI7O1lBQzdCLE1BQU0sUUFBUSxHQUFVLEVBQUUsQ0FBQztZQUMzQixPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BFLE9BQU8sTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEs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eEMsT0FBTyxFQUFFLENBQUM7aUJBQ1g7YUFDRjtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELFNBQVMsQ0FBQyxVQUFrQjtRQUMxQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDbEMsQ0FBQztDQUNGLENBQUE7QUEvRlksYUFBYTtJQUR6QixVQUFVLEVBQUU7R0FDQSxhQUFhLENBK0Z6QjtTQS9GWSxhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU2NyaXB0IH0gZnJvbSAnLi4vbW9kZWxzJztcblxuZGVjbGFyZSB2YXIgZG9jdW1lbnQ6IGFueTtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFNjcmlwdFNlcnZpY2Uge1xuICBwcml2YXRlIHNjcmlwdHM6IGFueSA9IHt9O1xuXG4gIGNvbnN0cnVjdG9yKCkge31cblxuICBhc3luYyBpbml0KHNjcmlwdFN0b3JlOiBTY3JpcHRbXSkge1xuICAgIGNvbnN0IHByb21pc2VzID0gW107XG4gICAgc2NyaXB0U3RvcmUuZm9yRWFjaCgoc2NyaXB0OiBTY3JpcHQpID0+IHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdTQ1JJUFQgU1RPUkUgTE9HR0lORycpO1xuICAgICAgdGhpcy5zY3JpcHRzW3NjcmlwdC5uYW1lXSA9IHtcbiAgICAgICAgbG9hZGVkOiBmYWxzZSxcbiAgICAgICAgc3JjOiBzY3JpcHQuc3JjLFxuICAgICAgICBtZXRhOiBzY3JpcHQubWV0YSxcbiAgICAgIH07XG4gICAgICBwcm9taXNlcy5wdXNoKHRoaXMubG9hZChzY3JpcHQubmFtZSkpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgfVxuXG4gIGFzeW5jIGxvYWQoLi4uc2NyaXB0czogc3RyaW5nW10pOiBQcm9taXNlPGFueT4ge1xuICAgIGNvbnN0IHByb21pc2VzOiBhbnlbXSA9IFtdO1xuICAgIHNjcmlwdHMuZm9yRWFjaCgoc2NyaXB0KSA9PiBwcm9taXNlcy5wdXNoKHRoaXMubG9hZFNjcmlwdChzY3JpcHQpKSk7XG4gICAgcmV0dXJuIGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgfVxuXG4gIGxvYWRTY3JpcHQobmFtZTogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgLy8gcmVzb2x2ZSBpZiBhbHJlYWR5IGxvYWRlZFxuICAgICAgaWYgKHRoaXMuc2NyaXB0c1tuYW1lXS5sb2FkZWQpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ0xPQURFRCcpO1xuICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICBzY3JpcHQ6IG5hbWUsXG4gICAgICAgICAgbG9hZGVkOiB0cnVlLFxuICAgICAgICAgIHN0YXR1czogJ0FscmVhZHkgTG9hZGVkJyxcbiAgICAgICAgICBtZXRhOiB0aGlzLnNjcmlwdHNbbmFtZV0ubWV0YSxcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBleGlzdGluZ1NjcmlwdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYGhlYWQgc2NyaXB0W3NyYz1cIiR7dGhpcy5zY3JpcHRzW25hbWVdLnNyY31cIl1gKTtcbiAgICAgICAgaWYgKGV4aXN0aW5nU2NyaXB0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIC8vIGxvYWQgc2NyaXB0XG4gICAgICAgICAgY29uc3Qgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgICAgICAgc2NyaXB0LnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0JztcbiAgICAgICAgICBzY3JpcHQuc3JjID0gdGhpcy5zY3JpcHRzW25hbWVdLnNyYztcbiAgICAgICAgICBpZiAoc2NyaXB0LnJlYWR5U3RhdGUpIHtcbiAgICAgICAgICAgIC8vIElFXG4gICAgICAgICAgICBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnT04gUkVBRFlTVEFURUNIQU5HRScpO1xuICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgc2NyaXB0LnJlYWR5U3RhdGUgPT09ICdsb2FkZWQnIHx8XG4gICAgICAgICAgICAgICAgc2NyaXB0LnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZSdcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy5zY3JpcHRzW25hbWVdLmxvYWRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgICBzY3JpcHQ6IG5hbWUsXG4gICAgICAgICAgICAgICAgICBsb2FkZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICBzdGF0dXM6ICdMb2FkZWQnLFxuICAgICAgICAgICAgICAgICAgbWV0YTogdGhpcy5zY3JpcHRzW25hbWVdLm1ldGEsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIE90aGVyc1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ09OTE9BRCcpO1xuICAgICAgICAgICAgc2NyaXB0Lm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5zY3JpcHRzW25hbWVdLmxvYWRlZCA9IHRydWU7XG4gICAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgIHNjcmlwdDogbmFtZSxcbiAgICAgICAgICAgICAgICBsb2FkZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnTG9hZGVkJyxcbiAgICAgICAgICAgICAgICBtZXRhOiB0aGlzLnNjcmlwdHNbbmFtZV0ubWV0YSxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgICBzY3JpcHQub25lcnJvciA9IChlcnJvcjogYW55KSA9PlxuICAgICAgICAgIGNvbnNvbGUubG9nKCdPTiBFUlJPUicsIGVycm9yKTtcbiAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICBzY3JpcHQ6IG5hbWUsXG4gICAgICAgICAgICAgIGxvYWRlZDogZmFsc2UsXG4gICAgICAgICAgICAgIHN0YXR1czogJ0xvYWRlZCcsXG4gICAgICAgICAgICAgIG1ldGE6IHRoaXMuc2NyaXB0c1tuYW1lXS5tZXRhLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXS5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdTY3JpcHQgYWxyZWFkeSBleGlzdHMnKTtcbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldFNjcmlwdChzY3JpcHROYW1lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5zY3JpcHRzW3NjcmlwdE5hbWVdO1xuICB9XG59XG4iXX0=