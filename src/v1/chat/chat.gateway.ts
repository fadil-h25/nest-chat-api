import { Server, Socket } from 'socket.io';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Contact, Message } from '@prisma/client'; // sesuaikan dengan modelmu
import { Inject, Injectable, Logger, UseFilters } from '@nestjs/common';

import {} from '../common/validation/schemas/message.schema';
import {
  AddNewContact,
  AddNewContactReq,
} from '../common/validation/schemas/contact.schema';
import { ContactService } from '../contact/contact.service';

import { JwtService } from '@nestjs/jwt';
import { parse } from 'cookie';
import { ZodValidationSocketPipe } from '../common/pipes/zod-validation-socket/zod-validation-socket.pipe';
import { UserPayload } from '../common/types/user-payload.type';
import { getUserIdWs } from '../utils/auth/get-user-id.util';
import { PrismaWsKnownFilter } from '../common/filters/prisma/prisma-ws-known/prisma-ws-known.filter';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { createLoggerMeta } from '../utils/logger/logger.util';

@UseFilters(PrismaWsKnownFilter)
@Injectable()
@WebSocketGateway({
  cors: {
    credentials: true,
    origin: 'http://localhost:3000',
  },
})
export class ChatGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(
    private contactService: ContactService,
    private jwtService: JwtService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  afterInit(server: Server) {
    this.logger.debug(
      'afterInit called',
      createLoggerMeta('chat', ChatGateway.name),
    );
    server.use((socket, next) => {
      const rawCookie = socket.handshake.headers.cookie || '';
      const cookies = parse(rawCookie);
      const token = cookies['chat-token'];

      if (!token) {
        return next(new Error('Unauthorized'));
      }

      try {
        const payload: UserPayload = this.jwtService.verify(token);
        // Simpan user ke socket biar bisa dipakai nanti
        (socket as any).user = payload;
        next();
      } catch (err) {
        return next(new Error('Invalid token'));
      }
    });
  }

  @SubscribeMessage('room:join')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
  ): Promise<WsResponse<any>> {
    this.logger.debug(
      'handleJoinRoom called',
      createLoggerMeta('chat', ChatGateway.name),
    );
    const room = 'user:' + String(getUserIdWs(client));

    await client.join(room);

    return {
      event: 'room:join',
      data: {
        status: 'joined',
        message: 'join on room: ' + room,
      },
    };
  }

  // @SubscribeMessage('message:create')
  // handleCreateMessage(
  //   @MessageBody(new ZodValidationPipe(AddNewMessage)) data: AddNewMessageDto,
  //   @ConnectedSocket() client: Socket,
  // ): WsResponse<any> {
  //   const event = 'message:create';
  //   return { event, data };
  // }

  @SubscribeMessage('contact:create')
  async handleCreateContact(
    @ConnectedSocket() client: Socket,
    @MessageBody(new ZodValidationSocketPipe(AddNewContact))
    data: AddNewContactReq,
  ): Promise<WsResponse<any>> {
    this.logger.debug(
      'handleCreateContact called',
      createLoggerMeta('chat', ChatGateway.name),
    );
    const event = 'contact:create';

    await this.contactService.addNewContactWithEmit(getUserIdWs(client), data);

    return {
      event,
      data: {
        status: 'ok',
      },
    };
  }

  //belum jalan
  emitNewMessage(room: string, message: Message) {
    this.server.to(room).emit('message:new', message);
  }

  emitNewContact(room: string, contact: Contact) {
    this.logger.debug(
      'emitNewContact called',
      createLoggerMeta('chat', ChatGateway.name),
    );
    this.server.to(room).emit('contact:new', contact);
  }
}
