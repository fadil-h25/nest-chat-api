import { Injectable, UseFilters } from '@nestjs/common';
import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { WsCustomFilter } from '../common/filters/ws/ws-custom/ws-custom.filter';

import { Server, Socket } from 'socket.io';
import { getUserIdWs } from '../utils/auth/get-user-id.util';

import { UserWsEvent } from '../common/enum/user-event.enum';
import { generateRoomName } from '../utils/ws/generate-room-name.util';
import { WsCustomResponseAck } from '../common/response/ws-custom-response-ack.type';

@UseFilters(WsCustomFilter)
@Injectable()
@WebSocketGateway({
  cors: {
    credentials: true,
    origin: 'http://localhost:3000',
  },
})
export class UserWsGateway {
  constructor() {}
  @WebSocketServer()
  server: Server;

  @SubscribeMessage(UserWsEvent.USER_JOIN_ROOM)
  async joinPrivateRoom(
    @ConnectedSocket() client: Socket,
  ): Promise<WsCustomResponseAck> {
    const eventName = UserWsEvent.USER_JOIN_ROOM;
    const room = generateRoomName(
      UserWsEvent.USER_ROOM_PREFIX,
      getUserIdWs(client),
    );
    await client.join(room);

    return {
      eventName,
      message: 'User joined room successfully',
      success: true,
    };
  }
}
