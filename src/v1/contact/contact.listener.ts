import { OnEvent } from '@nestjs/event-emitter';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ChatGateway } from '../chat/chat.gateway'; // atau path gateway kamu
import { Contact } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { createLoggerMeta } from '../utils/logger/logger.util';

@Injectable()
export class ContactListener {
  constructor(
    private readonly chatGateway: ChatGateway,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  @OnEvent('contact.created')
  handleMessageCreated(contact: Contact) {
    this.logger.debug(
      'handleMessageCreated called',
      createLoggerMeta('contact', ContactListener.name),
    );
    const room = `user:${contact.ownerId}`;
    this.logger.debug(
      'handleMessageCreated emit to room: ' + room,
      createLoggerMeta('contact', ContactListener.name),
    );
    this.chatGateway.emitNewContact(room, contact);
  }
}
