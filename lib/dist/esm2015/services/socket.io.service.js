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
    Injectable(),
    tslib_1.__metadata("design:paramtypes", [])
], SocketIoService);
export { SocketIoService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ja2V0LmlvLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy1ldmVudHN0b3JlLWxpc3RpbmcvIiwic291cmNlcyI6WyJzZXJ2aWNlcy9zb2NrZXQuaW8uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEtBQUssRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBR3ZDLElBQWEsZUFBZSxHQUE1QixNQUFhLGVBQWU7SUFDMUIsZ0JBQWdCO0lBQ2hCLGdCQUFnQixDQUFDO0lBQ2pCLGlCQUFpQixDQUFDLFNBQVM7UUFDekIsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsU0FBUyxTQUFTLENBQUMsQ0FBQztRQUMzQyxvQ0FBb0M7UUFDcEMsbUVBQW1FO1FBQ25FLE1BQU07UUFDTixvQ0FBb0M7SUFDcEMsQ0FBQztDQUNGLENBQUE7QUFWWSxlQUFlO0lBRDNCLFVBQVUsRUFBRTs7R0FDQSxlQUFlLENBVTNCO1NBVlksZUFBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCAqIGFzIGlvIGZyb20gJ3NvY2tldC5pby1jbGllbnQnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU29ja2V0SW9TZXJ2aWNlIHtcbiAgLy8gc29ja2V0cyA9IHt9O1xuICBjb25zdHJ1Y3RvcigpIHsgfVxuICBnZXRTb2NrZXRJbnN0YW5jZShzb2NrZXRVcmwpIHtcbiAgICByZXR1cm4gaW8uY29ubmVjdChgJHtzb2NrZXRVcmx9L2V2ZW50c2ApO1xuICAvLyAgIGlmICghdGhpcy5zb2NrZXRzW3NvY2tldFVybF0pIHtcbiAgLy8gICAgIHRoaXMuc29ja2V0c1tzb2NrZXRVcmxdID0gaW8uY29ubmVjdChgJHtzb2NrZXRVcmx9L2V2ZW50c2ApO1xuICAvLyAgIH1cbiAgLy8gICByZXR1cm4gdGhpcy5zb2NrZXRzW3NvY2tldFVybF07XG4gIH1cbn1cbiJdfQ==