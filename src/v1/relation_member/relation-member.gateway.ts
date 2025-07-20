import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { RelationMemberService } from './relation_member.service';
import { Server, Socket } from 'socket.io';
import { RelationMemberWsEvent } from '../common/enum/relation-member-event';
import { RelationMemberResponse } from './dto/response/relation-member-response.dto';
import { generateRoomName } from '../utils/ws/generate-room-name.util';
import { RoomScope } from '../common/enum/room-scope.enum';
import { createWsCustomResponse } from '../utils/ws/create-ws-custom-response.util';
import { Injectable } from '@nestjs/common';
import { SocketServerHolder } from '../common/socket/socket-server.holder';

@Injectable()
@WebSocketGateway()
export class RelationMemberGateway implements OnGatewayInit {
  constructor(private relationMemberService: RelationMemberService) {}
  @WebSocketServer()
  server: Server;
  afterInit(server: Server) {
    SocketServerHolder.setServer(server);
  }

  // akan dihapus
  //   @SubscribeMessage(RelationMemberWsEvent.CREATE_RELATION_MEMBER)
  //   listenCreateRelationMembers(
  //     @MessageBody() data: any,
  //     @Socket() Socket: Socket,
  //   ) {
  //     const eventName = RelationMemberWsEvent.CREATE_RELATION_MEMBER;
  //     try {
  //       const validateData = validateWith(CreateRelationMemberSchema, data);
  //     } catch (error) {
  //       throw new WsCustomException(eventName, 'Failed create relation', error);
  //     }
  //   }

  @SubscribeMessage(RelationMemberWsEvent.RELATION_MEMBER_CREATED)
  sendCreatedRelationMember(
    @MessageBody() data: RelationMemberResponse,
    @ConnectedSocket() socket: Socket,
  ) {
    const eventName = RelationMemberWsEvent.RELATION_MEMBER_CREATED;
    socket
      .to(generateRoomName(RoomScope.RELATION_ROOM_PREFIX, data.relation.id))
      .emit(eventName, createWsCustomResponse(eventName, data, 200));
  }
}
