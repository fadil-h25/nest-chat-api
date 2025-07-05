import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { ContactService } from '../contact/contact.service';
import {
  AddNewContact,
  AddNewContactReq,
  UpdateContactName,
  UpdateContactNameDto,
  validationContactId,
} from '../common/validation/schemas/contact.schema';
import { Server, Socket } from 'socket.io';
import { getUserIdWs } from '../utils/auth/get-user-id.util';

import { Inject, Injectable, UseFilters } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { createLoggerMeta } from '../utils/logger/logger.util';

import { WsCustomException } from '../common/exceptions/ws-custom.exception';
import { validateWith } from '../common/validation/validate-with.validation';
import { WsCustomFilter } from '../common/filters/ws/ws-custom/ws-custom.filter';

import {
  AddNewContactRes,
  UpdateContactRes,
} from '../contact/dto/contact-response.dto';
import { createWsCustomResponse } from '../utils/ws/create-ws-custom-response.util';
import { ContactWsEvent } from '../common/enum/contact-event';

@UseFilters(WsCustomFilter)
@Injectable()
@WebSocketGateway({
  cors: {
    credentials: true,
    origin: 'http://localhost:3000',
  },
})
export class ContactWsGateway {
  constructor(
    private contactService: ContactService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  @WebSocketServer()
  server: Server;
  // afterInit(server: any) {}

  @SubscribeMessage(ContactWsEvent.CREATE_CONTACT)
  async listenCreateNewContact(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: AddNewContactReq,
  ): Promise<WsResponse> {
    this.logger.debug(
      'createNewContact called ',
      createLoggerMeta('contact-ws', ContactWsGateway.name),
    );
    const eventName = ContactWsEvent.CREATE_CONTACT;
    let createdContact: AddNewContactRes;

    try {
      validateWith(AddNewContact, data);
      createdContact = await this.contactService.addNewContact(
        getUserIdWs(client),
        data,
      );

      this.sendNewContact(client, createdContact);
    } catch (error) {
      throw new WsCustomException(eventName, 'create contact fail', error);
    }

    return {
      ...createWsCustomResponse(
        ContactWsEvent.CREATED_CONTACT,
        createdContact,
        200,
      ),
    };
  }

  sendNewContact(
    @ConnectedSocket() client: Socket,
    createdContact: AddNewContactRes,
  ) {
    this.logger.debug(
      'sendNewContact called ',
      createLoggerMeta('contact-ws', ContactWsGateway.name),
    );
    const eventName = ContactWsEvent.CREATED_CONTACT;
    try {
      this.server.to('user:' + getUserIdWs(client)).emit(eventName, {
        ...createWsCustomResponse(
          ContactWsEvent.UPDATED_CONTACT,
          createdContact,
          200,
        ),
      });
    } catch (error) {
      throw new WsCustomException(eventName, 'get new contact fail', error);
    }
  }

  @SubscribeMessage(ContactWsEvent.UPDATE_CONTACT)
  async linstenUpdateContact(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): Promise<WsResponse> {
    const eventName = ContactWsEvent.UPDATE_CONTACT;
    this.logger.debug(
      'updatedContact called ',
      createLoggerMeta('contact-ws', ContactWsGateway.name),
    );

    try {
      const validatedData: UpdateContactNameDto = validateWith(
        UpdateContactName,
        data,
      );
      const updatedContact: UpdateContactRes =
        await this.contactService.updateContactName(validatedData);

      this.sendUpdatedContact(client, updatedContact);
      return {
        ...createWsCustomResponse(
          ContactWsEvent.UPDATE_CONTACT,
          updatedContact,
          200,
        ),
      };
    } catch (error) {
      throw new WsCustomException(eventName, 'update contact fail', error);
    }
  }

  sendUpdatedContact(
    @ConnectedSocket() client: Socket,
    updatedContact: UpdateContactRes,
  ) {
    const eventName = ContactWsEvent.UPDATED_CONTACT;
    this.logger.debug(
      'sendUpdatedContact called ',
      createLoggerMeta('contact-ws', ContactWsGateway.name),
    );

    try {
      this.server.to('user:' + getUserIdWs(client)).emit(eventName, {
        ...createWsCustomResponse(
          ContactWsEvent.UPDATED_CONTACT,
          updatedContact,
          200,
        ),
      });
    } catch (error) {
      throw new WsCustomException(eventName, 'get updated contact fail', error);
    }
  }

  @SubscribeMessage(ContactWsEvent.DELETE_CONTACT)
  async deleteContact(
    @ConnectedSocket() client: Socket,
    @MessageBody('id') id: number,
  ): Promise<WsResponse> {
    const eventName = ContactWsEvent.DELETE_CONTACT;
    this.logger.debug(
      'deleteContact called ',
      createLoggerMeta('contact-ws', ContactWsGateway.name),
    );

    try {
      const validContactId = validateWith(validationContactId, id);
      await this.contactService.deleteContact(validContactId);

      this.sendDeletedContact(client, validContactId);
      return {
        ...createWsCustomResponse(
          eventName,
          {
            id: validContactId,
          },
          204,
        ),
      };
    } catch (error) {
      throw new WsCustomException(eventName, 'delete contact fail', error);
    }
  }

  sendDeletedContact(@ConnectedSocket() client: Socket, contactId: number) {
    const eventName = ContactWsEvent.DELETED_CONTACT;
    this.logger.debug(
      'sendDeletedContact called ',
      createLoggerMeta('contact-ws', ContactWsGateway.name),
    );

    try {
      this.server.to('user:' + getUserIdWs(client)).emit(eventName, {
        ...createWsCustomResponse(
          eventName,
          {
            id: contactId,
          },
          204,
        ),
      });
    } catch (error) {
      throw new WsCustomException(eventName, 'get deleted contact fail', error);
    }
  }
}
