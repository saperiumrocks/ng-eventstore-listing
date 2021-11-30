import * as tslib_1 from "tslib";
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
PlaybackListService = tslib_1.__decorate([
    Injectable(),
    tslib_1.__metadata("design:paramtypes", [HttpClient])
], PlaybackListService);
export { PlaybackListService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheWJhY2stbGlzdC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmctZXZlbnRzdG9yZS1saXN0aW5nLyIsInNvdXJjZXMiOlsic2VydmljZXMvcGxheWJhY2stbGlzdC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUtsRCxJQUFhLG1CQUFtQixHQUFoQyxNQUFhLG1CQUFtQjtJQUM5QixZQUFvQixJQUFnQjtRQUFoQixTQUFJLEdBQUosSUFBSSxDQUFZO0lBQUcsQ0FBQztJQUV4QyxlQUFlLENBQ2IsbUJBQTJCLEVBQzNCLGdCQUF3QixFQUN4QixVQUFrQixFQUNsQixLQUFhLEVBQ2IsT0FBa0IsRUFDbEIsSUFBYSxFQUNiLFdBQW9CLEVBQ3BCLE9BQWdCO1FBRWhCLElBQUksR0FBRyxHQUFHLEdBQUcsbUJBQW1CLGtCQUFrQixnQkFBZ0IsZUFBZSxVQUFVLFVBQVUsS0FBSyxFQUFFLENBQUM7UUFFN0csSUFBSSxPQUFPLEVBQUU7WUFDWCxHQUFHLElBQUksWUFBWSxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQztTQUNsRTtRQUVELElBQUksSUFBSSxFQUFFO1lBQ1IsR0FBRyxJQUFJLFNBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1NBQ3hDO1FBRUQsSUFBSSxXQUFXLEVBQUU7WUFDZixHQUFHLElBQUksZUFBZSxHQUFHLFdBQVcsQ0FBQztTQUN0QztRQUVELElBQUksT0FBTyxFQUFFO1lBQ1QsR0FBRyxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUM7U0FDaEM7UUFFRCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUF1QixHQUFHLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQsa0JBQWtCLENBQ2hCLG1CQUEyQixFQUMzQixnQkFBd0IsRUFDeEIsVUFBa0IsRUFDbEIsS0FBYSxFQUNiLE9BQWtCLEVBQ2xCLElBQWEsRUFDYixJQUFhO1FBRWIsSUFBSSxHQUFHLEdBQUcsR0FBRyxtQkFBbUIsa0JBQWtCLGdCQUFnQixzQkFBc0IsVUFBVSxVQUFVLEtBQUssRUFBRSxDQUFDO1FBRXBILElBQUksT0FBTyxFQUFFO1lBQ1gsR0FBRyxJQUFJLFlBQVksSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1NBQzlDO1FBRUQsSUFBSSxJQUFJLEVBQUU7WUFDUixHQUFHLElBQUksU0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7U0FDeEM7UUFFRCxJQUFJLElBQUksRUFBRTtZQUNSLEdBQUcsSUFBSSxTQUFTLElBQUksRUFBRSxDQUFDO1NBQ3hCO1FBQ0QsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBdUIsR0FBRyxFQUFPLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBQyxDQUFDLENBQUM7SUFDcEYsQ0FBQztDQUNGLENBQUE7QUExRFksbUJBQW1CO0lBRC9CLFVBQVUsRUFBRTs2Q0FFZSxVQUFVO0dBRHpCLG1CQUFtQixDQTBEL0I7U0ExRFksbUJBQW1CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IEZpbHRlciwgU29ydCwgUGxheWJhY2tMaXN0UmVzcG9uc2UgfSBmcm9tICcuLi9tb2RlbHMnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgUGxheWJhY2tMaXN0U2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge31cblxuICBnZXRQbGF5YmFja0xpc3QoXG4gICAgcGxheWJhY2tMaXN0QmFzZVVybDogc3RyaW5nLFxuICAgIHBsYXliYWNrTGlzdE5hbWU6IHN0cmluZyxcbiAgICBzdGFydEluZGV4OiBudW1iZXIsXG4gICAgbGltaXQ6IG51bWJlcixcbiAgICBmaWx0ZXJzPzogRmlsdGVyW10sXG4gICAgc29ydD86IFNvcnRbXSxcbiAgICBwcmV2aW91c0tleT86IHN0cmluZyxcbiAgICBuZXh0S2V5Pzogc3RyaW5nXG4gICk6IE9ic2VydmFibGU8UGxheWJhY2tMaXN0UmVzcG9uc2U+IHtcbiAgICBsZXQgdXJsID0gYCR7cGxheWJhY2tMaXN0QmFzZVVybH0vcGxheWJhY2stbGlzdC8ke3BsYXliYWNrTGlzdE5hbWV9P3N0YXJ0SW5kZXg9JHtzdGFydEluZGV4fSZsaW1pdD0ke2xpbWl0fWA7XG5cbiAgICBpZiAoZmlsdGVycykge1xuICAgICAgdXJsICs9IGAmZmlsdGVycz0ke2VuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShmaWx0ZXJzKSl9YDtcbiAgICB9XG5cbiAgICBpZiAoc29ydCkge1xuICAgICAgdXJsICs9IGAmc29ydD0ke0pTT04uc3RyaW5naWZ5KHNvcnQpfWA7XG4gICAgfVxuXG4gICAgaWYgKHByZXZpb3VzS2V5KSB7XG4gICAgICB1cmwgKz0gJyZwcmV2aW91c0tleT0nICsgcHJldmlvdXNLZXk7XG4gICAgfVxuXG4gICAgaWYgKG5leHRLZXkpIHtcbiAgICAgICAgdXJsICs9ICcmbmV4dEtleT0nICsgbmV4dEtleTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5odHRwLmdldDxQbGF5YmFja0xpc3RSZXNwb25zZT4odXJsKTtcbiAgfVxuXG4gIGdldFBsYXliYWNrTGlzdENzdihcbiAgICBwbGF5YmFja0xpc3RCYXNlVXJsOiBzdHJpbmcsXG4gICAgcGxheWJhY2tMaXN0TmFtZTogc3RyaW5nLFxuICAgIHN0YXJ0SW5kZXg6IG51bWJlcixcbiAgICBsaW1pdDogbnVtYmVyLFxuICAgIGZpbHRlcnM/OiBGaWx0ZXJbXSxcbiAgICBzb3J0PzogU29ydFtdLFxuICAgIHR5cGU/OiBzdHJpbmdcbiAgKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICBsZXQgdXJsID0gYCR7cGxheWJhY2tMaXN0QmFzZVVybH0vcGxheWJhY2stbGlzdC8ke3BsYXliYWNrTGlzdE5hbWV9L2V4cG9ydD9zdGFydEluZGV4PSR7c3RhcnRJbmRleH0mbGltaXQ9JHtsaW1pdH1gO1xuXG4gICAgaWYgKGZpbHRlcnMpIHtcbiAgICAgIHVybCArPSBgJmZpbHRlcnM9JHtKU09OLnN0cmluZ2lmeShmaWx0ZXJzKX1gO1xuICAgIH1cblxuICAgIGlmIChzb3J0KSB7XG4gICAgICB1cmwgKz0gYCZzb3J0PSR7SlNPTi5zdHJpbmdpZnkoc29ydCl9YDtcbiAgICB9XG5cbiAgICBpZiAodHlwZSkge1xuICAgICAgdXJsICs9IGAmdHlwZT0ke3R5cGV9YDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQ8UGxheWJhY2tMaXN0UmVzcG9uc2U+KHVybCwgPGFueT57IHJlc3BvbnNlVHlwZTogJ3RleHQvY3N2J30pO1xuICB9XG59XG4iXX0=