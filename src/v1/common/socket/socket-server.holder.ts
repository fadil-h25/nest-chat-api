// src/v1/websocket/socket-server.holder.ts
import { Server } from 'socket.io';

export class SocketServerHolder {
  private static server: Server;

  static setServer(server: Server) {
    this.server = server;
  }

  static getServer(): Server {
    if (!this.server) {
      throw new Error('Socket.IO server has not been set yet.');
    }
    return this.server;
  }
}
