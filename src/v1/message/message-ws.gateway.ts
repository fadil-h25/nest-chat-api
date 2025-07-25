import { Inject, Logger, UseFilters } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { WsCustomFilter } from '../common/filters/ws/ws-custom/ws-custom.filter';
import { getUserIdWs } from '../utils/auth/get-user-id.util';
import { Server, Socket } from 'socket.io';
import { MessageWsEvent } from '../common/enum/message-event';
import { WsCustomException } from '../common/exceptions/ws-custom.exception';
import { MessageService } from './message.service';
import { validateWith } from '../common/validation/validate-with.validation';
import { createMessageSchema } from '../common/validation/schemas/message/create-message.schema';

import { generateRoomName } from '../utils/ws/generate-room-name.util';
import { updateMessageSchema } from '../common/validation/schemas/message/update-message.schema';

import { RoomScope } from '../common/enum/room-scope.enum';
import { MessageResponseDto } from './dto/response/message-response.dto';
import { Context } from '../common/types/context,type';
import { SendUpdatedMessegaeRequest } from './dto/request/send-updated-message-request.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { createLoggerMeta } from '../utils/logger/logger.util';
import { generateResponseAck } from '../common/utils/generate-ws-response';
import { WsCustomResponseAck } from '../common/types/ws-custom-response.type';

@UseFilters(WsCustomFilter)
@WebSocketGateway()
export class MessageWsGateway {
  @WebSocketServer()
  server: Server;
  constructor(
    private messageService: MessageService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  @SubscribeMessage(MessageWsEvent.CREATE_MESSAGE)
  async listenCreateMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): Promise<WsCustomResponseAck> {
    this.logger.debug(
      'listenCreateMessage method called',
      createLoggerMeta('message', MessageWsGateway.name),
    );
    const eventName = MessageWsEvent.CREATE_MESSAGE;
    const userId = getUserIdWs(client);

    try {
      const createdMessage = await this.messageService.createMessage(
        { userId: getUserIdWs(client) },
        validateWith(createMessageSchema, { ...data, ownerId: userId }),
      );

      this.sendCreatedMessage(createdMessage);

      return generateResponseAck(eventName);
    } catch (error) {
      throw new WsCustomException(
        eventName,
        'Failed to create a message',
        error,
      );
    }
  }

  sendCreatedMessage(data: MessageResponseDto) {
    this.logger.debug(
      'sendCreatedMessage method called',
      createLoggerMeta('message', MessageWsGateway.name),
    );
    const eventName = MessageWsEvent.MESSAGE_CREATED;

    try {
      this.server
        .to(generateRoomName(RoomScope.RELATION_ROOM_PREFIX, data.relationId))
        .emit(eventName, data);
    } catch (error) {
      throw new WsCustomException(
        eventName,
        'Failed to send created message',
        error,
      );
    }
  }

  @SubscribeMessage(MessageWsEvent.UPDATE_MESSAGE)
  async listenUpdateMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.debug(
      'listenUpdateMessage method called',
      createLoggerMeta('message', MessageWsGateway.name),
    );
    const eventName = MessageWsEvent.UPDATE_MESSAGE;
    const ctx: Context = { userId: getUserIdWs(client) };

    try {
      const validateData = validateWith(updateMessageSchema, data);
      const updatedMessage = await this.messageService.updateMessage(
        ctx,
        validateData,
      );

      await this.sendUpdatedMessage(ctx, {
        id: updatedMessage.id,
        relationId: updatedMessage.relationId,
      });

      return generateResponseAck(eventName);
    } catch (error) {
      throw new WsCustomException(
        eventName,
        'Failed to update message listener',
        error,
      );
    }
  }

  async sendUpdatedMessage(ctx: Context, data: SendUpdatedMessegaeRequest) {
    this.logger.debug(
      'sendUpdatedMessage method called',
      createLoggerMeta('message', MessageWsGateway.name),
    );
    const eventName = MessageWsEvent.MESSAGE_UPDATED;

    try {
      const message = await this.messageService.findMessage(ctx, {
        id: data.id,
        relationId: data.relationId,
      });

      this.server
        .to(generateRoomName(RoomScope.RELATION_ROOM_PREFIX, data.relationId))
        .emit(eventName, message);
    } catch (error) {
      throw new WsCustomException(
        eventName,
        'Failed to send updated message',
        error,
      );
    }
  }

  //tahan dlu
  // async listenDeleteMessage(
  //   @MessageBody() data: any,
  //   @ConnectedSocket() client: Socket,
  // ) {
  //   const eventName = MessageWsEvent.DELETE_MESSAGE;
  //   const userId = getUserIdWs(client);

  //   try {
  //     const deletedMessage = await this.messageService.deleteMessage(
  //       validateWith(DeleteMessageSchema, { ...data, ownerId: userId }),
  //     );

  //     this.sendDeletedMessage(deletedMessage);

  //     return createWsCustomResponse(eventName, deletedMessage, 200);
  //   } catch (error) {
  //     throw new WsCustomException(eventName, 'Failed to delete message', error);
  //   }
  // }
  //   sendDeletedMessage(data: DeleteMessageRequestDto) {
  //     const eventName = MessageWsEvent.MESSAGE_DELETED;

  //     try {
  //       this.server
  //         .to(generateRoomName(RoomScope.RELATION_ROOM_PREFIX, data.))
  //         .emit(eventName, data);
  //     } catch (error) {
  //       throw new WsCustomException(
  //         eventName,
  //         'Failed to send deleted message',
  //         error,
  //       );
  //     }
  //   }
}
