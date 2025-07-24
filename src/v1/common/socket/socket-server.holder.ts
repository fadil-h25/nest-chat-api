// src/v1/websocket/socket-server.holder.ts
import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class SocketServerHolder {
  private server: Server;

  setServer(server: Server) {
    this.server = server;
  }

  getServer(): Server {
    if (!this.server) {
      throw new Error('Socket.IO server has not been set yet.');
    }
    return this.server;
  }
}
