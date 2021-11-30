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
    Injectable(),
    tslib_1.__metadata("design:paramtypes", [])
], ScriptService);
export { ScriptService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyaXB0LnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy1ldmVudHN0b3JlLWxpc3RpbmcvIiwic291cmNlcyI6WyJzZXJ2aWNlcy9zY3JpcHQuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQU0zQyxJQUFhLGFBQWEsR0FBMUIsTUFBYSxhQUFhO0lBR3hCO1FBRlEsWUFBTyxHQUFRLEVBQUUsQ0FBQztJQUVYLENBQUM7SUFFVixJQUFJLENBQUMsV0FBcUI7O1lBQzlCLE1BQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQztZQUNwQixXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBYyxFQUFFLEVBQUU7Z0JBQ3JDLHVDQUF1QztnQkFDdkMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUc7b0JBQzFCLE1BQU0sRUFBRSxLQUFLO29CQUNiLEdBQUcsRUFBRSxNQUFNLENBQUMsR0FBRztvQkFDZixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUk7aUJBQ2xCLENBQUM7Z0JBQ0YsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3hDLENBQUMsQ0FBQyxDQUFDO1lBRUgsT0FBTyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDckMsQ0FBQztLQUFBO0lBRUssSUFBSSxDQUFDLEdBQUcsT0FBaUI7O1lBQzdCLE1BQU0sUUFBUSxHQUFVLEVBQUUsQ0FBQztZQUMzQixPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BFLE9BQU8sTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEs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eEMsT0FBTyxFQUFFLENBQUM7aUJBQ1g7YUFDRjtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELFNBQVMsQ0FBQyxVQUFrQjtRQUMxQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDbEMsQ0FBQztDQUNGLENBQUE7QUEvRlksYUFBYTtJQUR6QixVQUFVLEVBQUU7O0dBQ0EsYUFBYSxDQStGekI7U0EvRlksYUFBYSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFNjcmlwdCB9IGZyb20gJy4uL21vZGVscyc7XG5cbmRlY2xhcmUgdmFyIGRvY3VtZW50OiBhbnk7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTY3JpcHRTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBzY3JpcHRzOiBhbnkgPSB7fTtcblxuICBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgYXN5bmMgaW5pdChzY3JpcHRTdG9yZTogU2NyaXB0W10pIHtcbiAgICBjb25zdCBwcm9taXNlcyA9IFtdO1xuICAgIHNjcmlwdFN0b3JlLmZvckVhY2goKHNjcmlwdDogU2NyaXB0KSA9PiB7XG4gICAgICAvLyBjb25zb2xlLmxvZygnU0NSSVBUIFNUT1JFIExPR0dJTkcnKTtcbiAgICAgIHRoaXMuc2NyaXB0c1tzY3JpcHQubmFtZV0gPSB7XG4gICAgICAgIGxvYWRlZDogZmFsc2UsXG4gICAgICAgIHNyYzogc2NyaXB0LnNyYyxcbiAgICAgICAgbWV0YTogc2NyaXB0Lm1ldGEsXG4gICAgICB9O1xuICAgICAgcHJvbWlzZXMucHVzaCh0aGlzLmxvYWQoc2NyaXB0Lm5hbWUpKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcyk7XG4gIH1cblxuICBhc3luYyBsb2FkKC4uLnNjcmlwdHM6IHN0cmluZ1tdKTogUHJvbWlzZTxhbnk+IHtcbiAgICBjb25zdCBwcm9taXNlczogYW55W10gPSBbXTtcbiAgICBzY3JpcHRzLmZvckVhY2goKHNjcmlwdCkgPT4gcHJvbWlzZXMucHVzaCh0aGlzLmxvYWRTY3JpcHQoc2NyaXB0KSkpO1xuICAgIHJldHVybiBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcyk7XG4gIH1cblxuICBsb2FkU2NyaXB0KG5hbWU6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIC8vIHJlc29sdmUgaWYgYWxyZWFkeSBsb2FkZWRcbiAgICAgIGlmICh0aGlzLnNjcmlwdHNbbmFtZV0ubG9hZGVkKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdMT0FERUQnKTtcbiAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgc2NyaXB0OiBuYW1lLFxuICAgICAgICAgIGxvYWRlZDogdHJ1ZSxcbiAgICAgICAgICBzdGF0dXM6ICdBbHJlYWR5IExvYWRlZCcsXG4gICAgICAgICAgbWV0YTogdGhpcy5zY3JpcHRzW25hbWVdLm1ldGEsXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgZXhpc3RpbmdTY3JpcHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGBoZWFkIHNjcmlwdFtzcmM9XCIke3RoaXMuc2NyaXB0c1tuYW1lXS5zcmN9XCJdYCk7XG4gICAgICAgIGlmIChleGlzdGluZ1NjcmlwdC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAvLyBsb2FkIHNjcmlwdFxuICAgICAgICAgIGNvbnN0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgICAgICAgIHNjcmlwdC50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XG4gICAgICAgICAgc2NyaXB0LnNyYyA9IHRoaXMuc2NyaXB0c1tuYW1lXS5zcmM7XG4gICAgICAgICAgaWYgKHNjcmlwdC5yZWFkeVN0YXRlKSB7XG4gICAgICAgICAgICAvLyBJRVxuICAgICAgICAgICAgc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ09OIFJFQURZU1RBVEVDSEFOR0UnKTtcbiAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIHNjcmlwdC5yZWFkeVN0YXRlID09PSAnbG9hZGVkJyB8fFxuICAgICAgICAgICAgICAgIHNjcmlwdC5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnXG4gICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBudWxsO1xuICAgICAgICAgICAgICAgIHRoaXMuc2NyaXB0c1tuYW1lXS5sb2FkZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgICAgc2NyaXB0OiBuYW1lLFxuICAgICAgICAgICAgICAgICAgbG9hZGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgc3RhdHVzOiAnTG9hZGVkJyxcbiAgICAgICAgICAgICAgICAgIG1ldGE6IHRoaXMuc2NyaXB0c1tuYW1lXS5tZXRhLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBPdGhlcnNcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdPTkxPQUQnKTtcbiAgICAgICAgICAgIHNjcmlwdC5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuc2NyaXB0c1tuYW1lXS5sb2FkZWQgPSB0cnVlO1xuICAgICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICBzY3JpcHQ6IG5hbWUsXG4gICAgICAgICAgICAgICAgbG9hZGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHN0YXR1czogJ0xvYWRlZCcsXG4gICAgICAgICAgICAgICAgbWV0YTogdGhpcy5zY3JpcHRzW25hbWVdLm1ldGEsXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc2NyaXB0Lm9uZXJyb3IgPSAoZXJyb3I6IGFueSkgPT5cbiAgICAgICAgICBjb25zb2xlLmxvZygnT04gRVJST1InLCBlcnJvcik7XG4gICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgc2NyaXB0OiBuYW1lLFxuICAgICAgICAgICAgICBsb2FkZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICBzdGF0dXM6ICdMb2FkZWQnLFxuICAgICAgICAgICAgICBtZXRhOiB0aGlzLnNjcmlwdHNbbmFtZV0ubWV0YSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF0uYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZygnU2NyaXB0IGFscmVhZHkgZXhpc3RzJyk7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBnZXRTY3JpcHQoc2NyaXB0TmFtZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuc2NyaXB0c1tzY3JpcHROYW1lXTtcbiAgfVxufVxuIl19