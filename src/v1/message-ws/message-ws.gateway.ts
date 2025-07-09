import { UseFilters } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
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
import { CreateMessageRequestDto } from '../message/dto/request/create-message-request.dto';

@UseFilters(WsCustomFilter)
@WebSocketGateway()
export class MessageWsGateway {
  @WebSocketServer()
  server: Server;
  constructor(private messageService: MessageService) {}

  async listenCreateMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    const eventName = MessageWsEvent.CREATE_MESSAGE;
    const userId = getUserIdWs(client);

    try {
      const createdContact = await this.messageService.createMessage(
        validateWith(createMessageSchema, { ...data, ownerId: userId }),
      );

      this.sendCreatedContact(createdContact, client);

      return createWsCustomResponse(eventName, createdContact, 200);
    } catch (error) {
      throw new WsCustomException(
        eventName,
        'Failed to create a message',
        error,
      );
    }
  }

  sendCreatedContact(data: CreateMessageRequestDto, client: Socket) {
    const eventName = MessageWsEvent.CREATED_MESSAGE;

    try {
      this.server.to('user:' + getUserIdWs(client)).emit(eventName, data);
    } catch (error) {
      throw new WsCustomException(
        eventName,
        'Failed to send created message',
        error,
      );
    }
  }
}
