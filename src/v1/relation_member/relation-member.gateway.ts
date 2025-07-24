// import {
//   ConnectedSocket,
//   MessageBody,
//   OnGatewayInit,
//   SubscribeMessage,
//   WebSocketGateway,
//   WebSocketServer,
// } from '@nestjs/websockets';
// import { RelationMemberService } from './relation_member.service';
// import { Server, Socket } from 'socket.io';
// import { RelationMemberWsEvent } from '../common/enum/relation-member-event';

// import { generateRoomName } from '../utils/ws/generate-room-name.util';
// import { RoomScope } from '../common/enum/room-scope.enum';
// import { createWsCustomResponse } from '../utils/ws/create-ws-custom-response.util';
// import { Injectable } from '@nestjs/common';
// import { SocketServerHolder } from '../common/socket/socket-server.holder';
// import { validateWith } from '../common/validation/validate-with.validation';
// import { SendUpdatedRelationMemberSchema } from '../common/validation/schemas/relation-member/relation-member-ws.schema';
// import { WsCustomException } from '../common/exceptions/ws-custom.exception';
// import { FindRelationMembersRequestDto } from './dto/request/find-relation-members-request.dto';
// import { getUserIdWs } from '../utils/auth/get-user-id.util';

// @Injectable()
// @WebSocketGateway()
// export class RelationMemberGateway implements OnGatewayInit {
//   constructor(
//     private relationMemberService: RelationMemberService,
//     private socketServerHolder: SocketServerHolder,
//   ) {}
//   @WebSocketServer()
//   server: Server;
//   afterInit(server: Server) {
//     this.socketServerHolder.setServer(server);
//   }

//   // akan dihapus
//   //   @SubscribeMessage(RelationMemberWsEvent.CREATE_RELATION_MEMBER)
//   //   listenCreateRelationMembers(
//   //     @MessageBody() data: any,
//   //     @Socket() Socket: Socket,
//   //   ) {
//   //     const eventName = RelationMemberWsEvent.CREATE_RELATION_MEMBER;
//   //     try {
//   //       const validateData = validateWith(CreateRelationMemberSchema, data);
//   //     } catch (error) {
//   //       throw new WsCustomException(eventName, 'Failed create relation', error);
//   //     }
//   //   }

//   @SubscribeMessage(RelationMemberWsEvent.RELATION_MEMBER_UPDATED)
//   async sendUpdatedRelationMember(
//     @MessageBody() data: any,
//     @ConnectedSocket() socket: Socket,
//   ) {
//     const eventName = RelationMemberWsEvent.RELATION_MEMBER_UPDATED;

//     try {
//       const validatedData = validateWith(SendUpdatedRelationMemberSchema, data);
//       const dataRelationMember: FindRelationMembersRequestDto = {
//         relationId: validatedData.relationId,
//         userId: getUserIdWs(socket),
//         id: validatedData.id,
//       };
//       await this.relationMemberService.findRelationMember(dataRelationMember);
//       socket
//         .to(
//           generateRoomName(
//             RoomScope.RELATION_ROOM_PREFIX,
//             validatedData.relationId,
//           ),
//         )
//         .emit(eventName, createWsCustomResponse(eventName, data, 200));
//     } catch (error) {
//       throw new WsCustomException(
//         eventName,
//         'Failed send updated relation member',
//         error,
//       );
//     }
//   }
// }
