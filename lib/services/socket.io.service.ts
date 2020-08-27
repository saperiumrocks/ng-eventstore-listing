import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

@Injectable()
export class SocketIoService {
  // sockets = {};
  constructor() { }
  getSocketInstance(socketUrl) {
    return io.connect(`${socketUrl}/events`);
  //   if (!this.sockets[socketUrl]) {
  //     this.sockets[socketUrl] = io.connect(`${socketUrl}/events`);
  //   }
  //   return this.sockets[socketUrl];
  }
}
