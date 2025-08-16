import { Inject, Logger, UseFilters } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RelationWsEvent } from '../common/enum/relation-event';
import { WsCustomFilter } from '../common/filters/ws/ws-custom/ws-custom.filter';
import { getUserIdWs } from '../utils/auth/get-user-id.util';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { createLoggerMeta } from '../utils/logger/logger.util';
import { generateRoomName } from '../utils/ws/generate-room-name.util';
import { RoomScope } from '../common/enum/room-scope.enum';
import { WsCustomException } from '../common/exceptions/ws-custom.exception';

import { validateWith } from '../common/validation/validate-with.validation';
import { relationIdSchema } from '../common/validation/schemas/relation/relation.schema';
import { Context } from '../common/types/context,type';
import { RelationService } from './relation.service';
import { WsCustomResponseAck } from '../common/response/ws-custom-response-ack.type';

@UseFilters(WsCustomFilter)
@WebSocketGateway()
export class RelationGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private relationService: RelationService,
  ) {}

  @SubscribeMessage(RelationWsEvent.JOIN_RELATION_ROOM)
  async listenJoinRelationRoom(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): Promise<WsCustomException | WsCustomResponseAck> {
    const eventName = RelationWsEvent.JOIN_RELATION_ROOM;
    this.logger.debug(
      'listenJoinRelationRoom called',
      createLoggerMeta('relation', RelationGateway.name),
    );

    try {
      const relationId = validateWith(relationIdSchema, data);
      const userId = getUserIdWs(client);
      const ctx: Context = { userId };
      await this.relationService.findUserRelation(ctx, relationId);
      const room = generateRoomName(
        RelationWsEvent.RELATION_ROOM_PREFIX,
        relationId,
      );

      await client.join(room);

      return {
        eventName,
        message: 'Joined relation room successfully',
        success: true,
      };
    } catch (error) {
      throw new WsCustomException(
        eventName,
        'Failed to join relation room',
        error,
      );
    }
  }

  @SubscribeMessage(RelationWsEvent.LEFT_RELATION_ROOM)
  async listenLeftRelationRoom(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): Promise<WsCustomResponseAck> {
    const eventName = RelationWsEvent.LEFT_RELATION_ROOM;
    this.logger.debug(
      'listenLeftRelationRoom called',
      createLoggerMeta('relation', RelationGateway.name),
    );

    try {
      const userId = getUserIdWs(client);
      const relationId = validateWith(relationIdSchema, data);
      const room = generateRoomName(
        RelationWsEvent.RELATION_ROOM_PREFIX,
        relationId,
      );

      await client.leave(room);
      this.server.to(room).emit(`${eventName}:success`, {
        userId,
        relationId: relationId,
      });

      return {
        eventName,
        message: 'Left relation room successfully',
        success: true,
      };
    } catch (error) {
      throw new WsCustomException(
        eventName,
        'Failed to leave relation room',
        error,
      );
    }
  }
}
