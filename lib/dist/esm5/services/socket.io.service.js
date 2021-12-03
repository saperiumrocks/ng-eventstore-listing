import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
var SocketIoService = /** @class */ (function () {
    // sockets = {};
    function SocketIoService() {
    }
    SocketIoService.prototype.getSocketInstance = function (socketUrl) {
        return io.connect(socketUrl + "/events");
        //   if (!this.sockets[socketUrl]) {
        //     this.sockets[socketUrl] = io.connect(`${socketUrl}/events`);
        //   }
        //   return this.sockets[socketUrl];
    };
    SocketIoService = tslib_1.__decorate([
        Injectable()
    ], SocketIoService);
    return SocketIoService;
}());
export { SocketIoService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ja2V0LmlvLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy1ldmVudHN0b3JlLWxpc3RpbmcvIiwic291cmNlcyI6WyJzZXJ2aWNlcy9zb2NrZXQuaW8uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEtBQUssRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBR3ZDO0lBQ0UsZ0JBQWdCO0lBQ2hCO0lBQWdCLENBQUM7SUFDakIsMkNBQWlCLEdBQWpCLFVBQWtCLFNBQVM7UUFDekIsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFJLFNBQVMsWUFBUyxDQUFDLENBQUM7UUFDM0Msb0NBQW9DO1FBQ3BDLG1FQUFtRTtRQUNuRSxNQUFNO1FBQ04sb0NBQW9DO0lBQ3BDLENBQUM7SUFUVSxlQUFlO1FBRDNCLFVBQVUsRUFBRTtPQUNBLGVBQWUsQ0FVM0I7SUFBRCxzQkFBQztDQUFBLEFBVkQsSUFVQztTQVZZLGVBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgKiBhcyBpbyBmcm9tICdzb2NrZXQuaW8tY2xpZW50JztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFNvY2tldElvU2VydmljZSB7XG4gIC8vIHNvY2tldHMgPSB7fTtcbiAgY29uc3RydWN0b3IoKSB7IH1cbiAgZ2V0U29ja2V0SW5zdGFuY2Uoc29ja2V0VXJsKSB7XG4gICAgcmV0dXJuIGlvLmNvbm5lY3QoYCR7c29ja2V0VXJsfS9ldmVudHNgKTtcbiAgLy8gICBpZiAoIXRoaXMuc29ja2V0c1tzb2NrZXRVcmxdKSB7XG4gIC8vICAgICB0aGlzLnNvY2tldHNbc29ja2V0VXJsXSA9IGlvLmNvbm5lY3QoYCR7c29ja2V0VXJsfS9ldmVudHNgKTtcbiAgLy8gICB9XG4gIC8vICAgcmV0dXJuIHRoaXMuc29ja2V0c1tzb2NrZXRVcmxdO1xuICB9XG59XG4iXX0=