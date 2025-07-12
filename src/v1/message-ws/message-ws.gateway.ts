import { UseFilters } from '@nestjs/common';
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
import { MessageService } from '../message/message.service';
import { validateWith } from '../common/validation/validate-with.validation';
import { createMessageSchema } from '../common/validation/schemas/message/create-message.schema';
import { createWsCustomResponse } from '../utils/ws/create-ws-custom-response.util';

import { generateRoomName } from '../utils/ws/generate-room-name.util';
import { updateMessageSchema } from '../common/validation/schemas/message/update-message.schema';
import { DeleteMessageSchema } from '../common/validation/schemas/message/delete-message.schema';
import { DeleteMessageResponseDto } from '../message/dto/response/delete-message-response.dto';
import { RoomScope } from '../common/enum/room-scope.enum';
import { UpdateMessageRequestDto } from '../message/dto/request/update-message-request.dto';

import { CreateMessageResponseDto } from '../message/dto/response/create-message-response.dto';

@UseFilters(WsCustomFilter)
@WebSocketGateway()
export class MessageWsGateway {
  @WebSocketServer()
  server: Server;
  constructor(private messageService: MessageService) {}

  // @SubscribeMessage(MessageWsEvent.)

  @SubscribeMessage(MessageWsEvent.CREATE_MESSAGE)
  async listenCreateMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    const eventName = MessageWsEvent.CREATE_MESSAGE;
    const userId = getUserIdWs(client);

    try {
      const createdMessage = await this.messageService.createMessage(
        validateWith(createMessageSchema, { ...data, ownerId: userId }),
      );

      this.sendCreatedMessage(createdMessage);

      return createWsCustomResponse(eventName, createdMessage, 200);
    } catch (error) {
      throw new WsCustomException(
        eventName,
        'Failed to create a message',
        error,
      );
    }
  }

  sendCreatedMessage(data: CreateMessageResponseDto) {
    const eventName = MessageWsEvent.MESSAGE_CREATED;

    try {
      this.server
        .to(generateRoomName(RoomScope.MESSAGE_ROOM_PREFIX, data.relationId))
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
  async listenerUpdate(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    const eventName = MessageWsEvent.UPDATE_MESSAGE;
    const userId = getUserIdWs(client);

    try {
      const updatedMessage = await this.messageService.updateMessage(
        validateWith(updateMessageSchema, { ...data, ownerId: userId }),
      );

      this.sendUpdatedMessage(updatedMessage);

      return createWsCustomResponse(eventName, updatedMessage, 200);
    } catch (error) {
      throw new WsCustomException(
        eventName,
        'Failed to update message listener',
        error,
      );
    }
  }
  sendUpdatedMessage(data: UpdateMessageRequestDto) {
    const eventName = MessageWsEvent.MESSAGE_UPDATED;

    try {
      this.server
        .to(generateRoomName(RoomScope.MESSAGE_ROOM_PREFIX, data.relationId))
        .emit(eventName, data);
    } catch (error) {
      throw new WsCustomException(
        eventName,
        'Failed to send updated message',
        error,
      );
    }
  }

  async listenDeleteMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    const eventName = MessageWsEvent.DELETE_MESSAGE;
    const userId = getUserIdWs(client);

    try {
      const deletedMessage = await this.messageService.deleteMessage(
        validateWith(DeleteMessageSchema, { ...data, ownerId: userId }),
      );

      this.sendDeletedMessage(deletedMessage);

      return createWsCustomResponse(eventName, deletedMessage, 200);
    } catch (error) {
      throw new WsCustomException(eventName, 'Failed to delete message', error);
    }
  }
  sendDeletedMessage(data: DeleteMessageResponseDto) {
    const eventName = MessageWsEvent.MESSAGE_DELETED;

    try {
      this.server
        .to(generateRoomName(RoomScope.MESSAGE_ROOM_PREFIX, data.relationId))
        .emit(eventName, data);
    } catch (error) {
      throw new WsCustomException(
        eventName,
        'Failed to send deleted message',
        error,
      );
    }
  }
}
