import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { ContactService } from '../contact/contact.service';
import {
  AddNewContact,
  AddNewContactReq,
} from '../common/validation/schemas/contact.schema';
import { Server, Socket } from 'socket.io';
import { getUserIdWs } from '../utils/auth/get-user-id.util';

import { Inject, Injectable, UseFilters } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { createLoggerMeta } from '../utils/logger/logger.util';

import { GetContactRes } from '../contact/dto/contact-response.dto';
import { WsCustomException } from '../common/exceptions/ws-custom.exception';
import { validateWith } from '../common/validation/validate-with.validation';
import { WsCustomFilter } from '../common/filters/ws/ws-custom/ws-custom.filter';
import { Contact } from '@prisma/client';

@UseFilters(WsCustomFilter)
@Injectable()
@WebSocketGateway({
  cors: {
    credentials: true,
    origin: 'http://localhost:3000',
  },
})
export class ContactWsGateway implements OnGatewayInit {
  constructor(
    private contactService: ContactService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  @WebSocketServer()
  server: Server;
  afterInit(server: any) {}

  @SubscribeMessage('contact:create')
  async listenCreateNewContact(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: AddNewContactReq,
  ): Promise<WsResponse> {
    this.logger.debug(
      'createNewContact called ',
      createLoggerMeta('contact-ws', ContactWsGateway.name),
    );
    const eventName = 'contact:create';

    try {
      validateWith(AddNewContact, data);
      const newContact = await this.contactService.addNewContact(
        getUserIdWs(client),
        data,
      );

      await this.getNewContact(client, newContact.id);
    } catch (error) {
      throw new WsCustomException(eventName, 'create contatc fail', error);
    }

    return {
      event: eventName,
      data: {
        message: 'create contact successful',
      },
    };
  }

  async sendNewContact(@ConnectedSocket() client: Socket, contactId: number) {
    const eventName = 'contact:get_new';
    try {
      const contact = await this.contactService.getContact(contactId);
      this.server.to('user:' + getUserIdWs(client)).emit(eventName, contact);
    } catch (error) {
      throw new WsCustomException(eventName, 'get new contact fail', error);
    }
  }

  @SubscribeMessage('contact:update')
  updatedContact() {}

  @SubscribeMessage('contact:get_updated')
  getUpdatedContact() {}
}
