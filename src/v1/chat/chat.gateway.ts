import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
  WsResponse,
} from '@nestjs/websockets';
import { MessageService } from '../message/message.service';
import { Message } from '@prisma/client';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway {
  constructor(private messageService: MessageService) {}
  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: unknown,
    @ConnectedSocket() client: Socket,
  ): WsResponse<any> {
    const event = 'message';
    //code store ke db
    return { event, data };
  }
}
