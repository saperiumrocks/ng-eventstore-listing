import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
let PlaybackListService = class PlaybackListService {
    constructor(http) {
        this.http = http;
    }
    getPlaybackList(playbackListBaseUrl, playbackListName, startIndex, limit, filters, sort, previousKey, nextKey) {
        let url = `${playbackListBaseUrl}/playback-list/${playbackListName}?startIndex=${startIndex}&limit=${limit}`;
        if (filters) {
            url += `&filters=${encodeURIComponent(JSON.stringify(filters))}`;
        }
        if (sort) {
            url += `&sort=${JSON.stringify(sort)}`;
        }
        if (previousKey) {
            url += '&previousKey=' + previousKey;
        }
        if (nextKey) {
            url += '&nextKey=' + nextKey;
        }
        return this.http.get(url);
    }
    getPlaybackListCsv(playbackListBaseUrl, playbackListName, startIndex, limit, filters, sort, type) {
        let url = `${playbackListBaseUrl}/playback-list/${playbackListName}/export?startIndex=${startIndex}&limit=${limit}`;
        if (filters) {
            url += `&filters=${JSON.stringify(filters)}`;
        }
        if (sort) {
            url += `&sort=${JSON.stringify(sort)}`;
        }
        if (type) {
            url += `&type=${type}`;
        }
        return this.http.get(url, { responseType: 'text/csv' });
    }
};
PlaybackListService.ctorParameters = () => [
    { type: HttpClient }
];
PlaybackListService = __decorate([
    Injectable()
], PlaybackListService);
export { PlaybackListService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheWJhY2stbGlzdC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmctZXZlbnRzdG9yZS1saXN0aW5nLyIsInNvdXJjZXMiOlsic2VydmljZXMvcGxheWJhY2stbGlzdC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUtsRCxJQUFhLG1CQUFtQixHQUFoQyxNQUFhLG1CQUFtQjtJQUM5QixZQUFvQixJQUFnQjtRQUFoQixTQUFJLEdBQUosSUFBSSxDQUFZO0lBQUcsQ0FBQztJQUV4QyxlQUFlLENBQ2IsbUJBQTJCLEVBQzNCLGdCQUF3QixFQUN4QixVQUFrQixFQUNsQixLQUFhLEVBQ2IsT0FBa0IsRUFDbEIsSUFBYSxFQUNiLFdBQW9CLEVBQ3BCLE9BQWdCO1FBRWhCLElBQUksR0FBRyxHQUFHLEdBQUcsbUJBQW1CLGtCQUFrQixnQkFBZ0IsZUFBZSxVQUFVLFVBQVUsS0FBSyxFQUFFLENBQUM7UUFFN0csSUFBSSxPQUFPLEVBQUU7WUFDWCxHQUFHLElBQUksWUFBWSxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQztTQUNsRTtRQUVELElBQUksSUFBSSxFQUFFO1lBQ1IsR0FBRyxJQUFJLFNBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1NBQ3hDO1FBRUQsSUFBSSxXQUFXLEVBQUU7WUFDZixHQUFHLElBQUksZUFBZSxHQUFHLFdBQVcsQ0FBQztTQUN0QztRQUVELElBQUksT0FBTyxFQUFFO1lBQ1QsR0FBRyxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUM7U0FDaEM7UUFFRCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUF1QixHQUFHLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQsa0JBQWtCLENBQ2hCLG1CQUEyQixFQUMzQixnQkFBd0IsRUFDeEIsVUFBa0IsRUFDbEIsS0FBYSxFQUNiLE9BQWtCLEVBQ2xCLElBQWEsRUFDYixJQUFhO1FBRWIsSUFBSSxHQUFHLEdBQUcsR0FBRyxtQkFBbUIsa0JBQWtCLGdCQUFnQixzQkFBc0IsVUFBVSxVQUFVLEtBQUssRUFBRSxDQUFDO1FBRXBILElBQUksT0FBTyxFQUFFO1lBQ1gsR0FBRyxJQUFJLFlBQVksSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1NBQzlDO1FBRUQsSUFBSSxJQUFJLEVBQUU7WUFDUixHQUFHLElBQUksU0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7U0FDeEM7UUFFRCxJQUFJLElBQUksRUFBRTtZQUNSLEdBQUcsSUFBSSxTQUFTLElBQUksRUFBRSxDQUFDO1NBQ3hCO1FBQ0QsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBdUIsR0FBRyxFQUFPLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBQyxDQUFDLENBQUM7SUFDcEYsQ0FBQztDQUNGLENBQUE7O1lBekQyQixVQUFVOztBQUR6QixtQkFBbUI7SUFEL0IsVUFBVSxFQUFFO0dBQ0EsbUJBQW1CLENBMEQvQjtTQTFEWSxtQkFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgRmlsdGVyLCBTb3J0LCBQbGF5YmFja0xpc3RSZXNwb25zZSB9IGZyb20gJy4uL21vZGVscyc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBQbGF5YmFja0xpc3RTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7fVxuXG4gIGdldFBsYXliYWNrTGlzdChcbiAgICBwbGF5YmFja0xpc3RCYXNlVXJsOiBzdHJpbmcsXG4gICAgcGxheWJhY2tMaXN0TmFtZTogc3RyaW5nLFxuICAgIHN0YXJ0SW5kZXg6IG51bWJlcixcbiAgICBsaW1pdDogbnVtYmVyLFxuICAgIGZpbHRlcnM/OiBGaWx0ZXJbXSxcbiAgICBzb3J0PzogU29ydFtdLFxuICAgIHByZXZpb3VzS2V5Pzogc3RyaW5nLFxuICAgIG5leHRLZXk/OiBzdHJpbmdcbiAgKTogT2JzZXJ2YWJsZTxQbGF5YmFja0xpc3RSZXNwb25zZT4ge1xuICAgIGxldCB1cmwgPSBgJHtwbGF5YmFja0xpc3RCYXNlVXJsfS9wbGF5YmFjay1saXN0LyR7cGxheWJhY2tMaXN0TmFtZX0/c3RhcnRJbmRleD0ke3N0YXJ0SW5kZXh9JmxpbWl0PSR7bGltaXR9YDtcblxuICAgIGlmIChmaWx0ZXJzKSB7XG4gICAgICB1cmwgKz0gYCZmaWx0ZXJzPSR7ZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGZpbHRlcnMpKX1gO1xuICAgIH1cblxuICAgIGlmIChzb3J0KSB7XG4gICAgICB1cmwgKz0gYCZzb3J0PSR7SlNPTi5zdHJpbmdpZnkoc29ydCl9YDtcbiAgICB9XG5cbiAgICBpZiAocHJldmlvdXNLZXkpIHtcbiAgICAgIHVybCArPSAnJnByZXZpb3VzS2V5PScgKyBwcmV2aW91c0tleTtcbiAgICB9XG5cbiAgICBpZiAobmV4dEtleSkge1xuICAgICAgICB1cmwgKz0gJyZuZXh0S2V5PScgKyBuZXh0S2V5O1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0PFBsYXliYWNrTGlzdFJlc3BvbnNlPih1cmwpO1xuICB9XG5cbiAgZ2V0UGxheWJhY2tMaXN0Q3N2KFxuICAgIHBsYXliYWNrTGlzdEJhc2VVcmw6IHN0cmluZyxcbiAgICBwbGF5YmFja0xpc3ROYW1lOiBzdHJpbmcsXG4gICAgc3RhcnRJbmRleDogbnVtYmVyLFxuICAgIGxpbWl0OiBudW1iZXIsXG4gICAgZmlsdGVycz86IEZpbHRlcltdLFxuICAgIHNvcnQ/OiBTb3J0W10sXG4gICAgdHlwZT86IHN0cmluZ1xuICApOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIGxldCB1cmwgPSBgJHtwbGF5YmFja0xpc3RCYXNlVXJsfS9wbGF5YmFjay1saXN0LyR7cGxheWJhY2tMaXN0TmFtZX0vZXhwb3J0P3N0YXJ0SW5kZXg9JHtzdGFydEluZGV4fSZsaW1pdD0ke2xpbWl0fWA7XG5cbiAgICBpZiAoZmlsdGVycykge1xuICAgICAgdXJsICs9IGAmZmlsdGVycz0ke0pTT04uc3RyaW5naWZ5KGZpbHRlcnMpfWA7XG4gICAgfVxuXG4gICAgaWYgKHNvcnQpIHtcbiAgICAgIHVybCArPSBgJnNvcnQ9JHtKU09OLnN0cmluZ2lmeShzb3J0KX1gO1xuICAgIH1cblxuICAgIGlmICh0eXBlKSB7XG4gICAgICB1cmwgKz0gYCZ0eXBlPSR7dHlwZX1gO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5odHRwLmdldDxQbGF5YmFja0xpc3RSZXNwb25zZT4odXJsLCA8YW55PnsgcmVzcG9uc2VUeXBlOiAndGV4dC9jc3YnfSk7XG4gIH1cbn1cbiJdfQ==