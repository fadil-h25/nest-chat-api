import { Injectable, UseFilters } from '@nestjs/common';
import {
  ConnectedSocket,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { WsCustomFilter } from '../common/filters/ws/ws-custom/ws-custom.filter';

import { Server, Socket } from 'socket.io';
import { getUserIdWs } from '../utils/auth/get-user-id.util';
import { SocketServerHolder } from '../common/socket/socket-server.holder';
import { Status } from '../common/enum/status.enum';

@UseFilters(WsCustomFilter)
@Injectable()
@WebSocketGateway({
  cors: {
    credentials: true,
    origin: 'http://localhost:3000',
  },
})
export class UserWsGateway implements OnGatewayInit {
  constructor() {}
  @WebSocketServer()
  server: Server;

  afterInit() {
    SocketServerHolder.setServer(this.server);
  }
  @SubscribeMessage('room:join')
  async joinPrivateRoom(
    @ConnectedSocket() client: Socket,
  ): Promise<WsResponse> {
    const eventName = 'room:join';
    const room = 'user:' + String(getUserIdWs(client));
    await client.join(room);

    return {
      event: eventName,
      data: {
        status: Status.OK,
        message: 'User join private room successful',
      },
    };
  }
}
