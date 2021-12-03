import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
let SocketIoService = class SocketIoService {
    // sockets = {};
    constructor() { }
    getSocketInstance(socketUrl) {
        return io.connect(`${socketUrl}/events`);
        //   if (!this.sockets[socketUrl]) {
        //     this.sockets[socketUrl] = io.connect(`${socketUrl}/events`);
        //   }
        //   return this.sockets[socketUrl];
    }
};
SocketIoService = tslib_1.__decorate([
    Injectable()
], SocketIoService);
export { SocketIoService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ja2V0LmlvLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy1ldmVudHN0b3JlLWxpc3RpbmcvIiwic291cmNlcyI6WyJzZXJ2aWNlcy9zb2NrZXQuaW8uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEtBQUssRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBR3ZDLElBQWEsZUFBZSxHQUE1QixNQUFhLGVBQWU7SUFDMUIsZ0JBQWdCO0lBQ2hCLGdCQUFnQixDQUFDO0lBQ2pCLGlCQUFpQixDQUFDLFNBQVM7UUFDekIsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsU0FBUyxTQUFTLENBQUMsQ0FBQztRQUMzQyxvQ0FBb0M7UUFDcEMsbUVBQW1FO1FBQ25FLE1BQU07UUFDTixvQ0FBb0M7SUFDcEMsQ0FBQztDQUNGLENBQUE7QUFWWSxlQUFlO0lBRDNCLFVBQVUsRUFBRTtHQUNBLGVBQWUsQ0FVM0I7U0FWWSxlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0ICogYXMgaW8gZnJvbSAnc29ja2V0LmlvLWNsaWVudCc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTb2NrZXRJb1NlcnZpY2Uge1xuICAvLyBzb2NrZXRzID0ge307XG4gIGNvbnN0cnVjdG9yKCkgeyB9XG4gIGdldFNvY2tldEluc3RhbmNlKHNvY2tldFVybCkge1xuICAgIHJldHVybiBpby5jb25uZWN0KGAke3NvY2tldFVybH0vZXZlbnRzYCk7XG4gIC8vICAgaWYgKCF0aGlzLnNvY2tldHNbc29ja2V0VXJsXSkge1xuICAvLyAgICAgdGhpcy5zb2NrZXRzW3NvY2tldFVybF0gPSBpby5jb25uZWN0KGAke3NvY2tldFVybH0vZXZlbnRzYCk7XG4gIC8vICAgfVxuICAvLyAgIHJldHVybiB0aGlzLnNvY2tldHNbc29ja2V0VXJsXTtcbiAgfVxufVxuIl19