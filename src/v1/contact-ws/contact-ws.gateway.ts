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
import { Status } from '../common/enum/status.enum';
import {
  AddNewContactRes,
  UpdateContactRes,
} from '../contact/dto/contact-response.dto';

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

      this.sendNewContact(client, newContact);
    } catch (error) {
      throw new WsCustomException(eventName, 'create contact fail', error);
    }

    return {
      event: eventName,
      data: {
        status: Status.OK,
        message: 'create contact successful',
      },
    };
  }

  sendNewContact(
    @ConnectedSocket() client: Socket,
    newContact: AddNewContactRes,
  ) {
    this.logger.debug(
      'sendNewContact called ',
      createLoggerMeta('contact-ws', ContactWsGateway.name),
    );
    const eventName = 'contact:get_new';
    try {
      this.server.to('user:' + getUserIdWs(client)).emit(eventName, {
        status: Status.OK,
        message: 'get new contact successful',
        data: newContact,
      });
    } catch (error) {
      throw new WsCustomException(eventName, 'get new contact fail', error);
    }
  }

  @SubscribeMessage('contact:update')
  async linstenUpdateContact(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): Promise<WsResponse> {
    const eventName = 'contact:update';
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
        event: eventName,
        data: {
          status: Status.OK,
          message: 'Contact updated successfully',
        },
      };
    } catch (error) {
      throw new WsCustomException(eventName, 'update contact fail', error);
    }
  }

  sendUpdatedContact(
    @ConnectedSocket() client: Socket,
    updatedContact: UpdateContactRes,
  ) {
    const eventName = 'contact:updated';
    this.logger.debug(
      'sendUpdatedContact called ',
      createLoggerMeta('contact-ws', ContactWsGateway.name),
    );

    try {
      this.server.to('user:' + getUserIdWs(client)).emit(eventName, {
        status: Status.OK,
        message: 'Contact updated',

        data: {
          contact: updatedContact,
        },
      });
    } catch (error) {
      throw new WsCustomException(eventName, 'get updated contact fail', error);
    }
  }

  @SubscribeMessage('contact:delete')
  async deleteContact(
    @ConnectedSocket() client: Socket,
    @MessageBody('id') id: number,
  ): Promise<WsResponse> {
    const eventName = 'contact:delete';
    this.logger.debug(
      'deleteContact called ',
      createLoggerMeta('contact-ws', ContactWsGateway.name),
    );

    try {
      const validContactId = validateWith(validationContactId, id);
      await this.contactService.deleteContact(validContactId);

      this.sendDeletedContact(client, validContactId);
      return {
        event: eventName,
        data: {
          status: Status.OK,
          message: 'Contact deleted successfully',
        },
      };
    } catch (error) {
      throw new WsCustomException(eventName, 'delete contact fail', error);
    }
  }

  sendDeletedContact(@ConnectedSocket() client: Socket, contactId: number) {
    const eventName = 'contact:get_deleted';
    this.logger.debug(
      'sendDeletedContact called ',
      createLoggerMeta('contact-ws', ContactWsGateway.name),
    );

    try {
      this.server.to('user:' + getUserIdWs(client)).emit(eventName, {
        status: Status.OK,
        message: 'Contact deleted',
        data: {
          contactId,
        },
      });
    } catch (error) {
      throw new WsCustomException(eventName, 'get deleted contact fail', error);
    }

    try {
      this.server.to('user:' + getUserIdWs(client)).emit(eventName, {
        status: Status.OK,
        message: 'Contact deleted',
        data: {},
      });
    } catch (error) {
      throw new WsCustomException(eventName, 'get deleted contact fail', error);
    }
  }
}
