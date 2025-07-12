import { Inject, Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import {
  AddNewContactReq,
  UpdateContactNameDto,
  UpdateContactRelationIdDto,
  UpdateContactUnreadCountDto,
  validationContactId,
} from '../common/validation/schemas/contact.schema';

import { EventEmitter2 } from '@nestjs/event-emitter';

import { Prisma } from '@prisma/client';
import {
  AddNewContactRes,
  GetContactRes,
  UpdateContactRes,
} from './dto/contact-response.dto';
import { UserService } from '../user/user.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { createLoggerMeta } from '../utils/logger/logger.util';
import { FindContactResponseDto } from './dto/response/find-contact-response.dto';

@Injectable()
export class ContactService {
  constructor(
    private databaseService: DatabaseService,
    private userService: UserService,
    private eventEmit: EventEmitter2,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  //news
  // async findContactsByRelationId(
  //   relationId: number,
  //   tx?: Prisma.TransactionClient,
  // ): Promise<FindContactResponseDto> {
  //   const db = tx || this.databaseService;

  //   const contacts = await db.contact.findMany({
  //     where: {
  //       relationId,
  //     },
  //     select:{}
  //   });

  //   return contacts;
  // }

  async getContacts(ownerId: number): Promise<GetContactRes[] | []> {
    this.logger.debug(
      'getContacts called',
      createLoggerMeta('contact', ContactService.name),
    );
    const contacts = await this.databaseService.contact.findMany({
      where: {
        ownerId,
      },
      select: {
        id: true,
        ownerId: true,
        name: true,
        targetId: true,
        target: {
          select: {
            phone: true,
          },
        },
        totalUnreadMessage: true,
        relationId: true,
        relation: {
          select: {
            lastMessage: {
              select: {
                content: true,
              },
            },
          },
        },
      },
    });
    return contacts;
  }

  async getAllContacts(): Promise<GetContactRes[] | []> {
    this.logger.debug(
      'getAllContacts called',
      createLoggerMeta('contact', ContactService.name),
    );
    const contacts = await this.databaseService.contact.findMany({
      select: {
        id: true,
        ownerId: true,
        name: true,
        targetId: true,
        target: {
          select: {
            phone: true,
          },
        },
        totalUnreadMessage: true,
        relationId: true,
        relation: {
          select: {
            lastMessage: {
              select: {
                content: true,
              },
            },
          },
        },
      },
    });
    return contacts;
  }

  async getContact(
    contactId: number,
    tx?: Prisma.TransactionClient,
  ): Promise<GetContactRes> {
    this.logger.debug(
      'getContact called',
      createLoggerMeta('contact', ContactService.name),
    );
    const db = tx ?? this.databaseService;

    const contact = await db.contact.findUniqueOrThrow({
      where: {
        id: contactId,
      },
      select: {
        id: true,
        ownerId: true,
        name: true,
        targetId: true,
        target: {
          select: {
            phone: true,
          },
        },
        totalUnreadMessage: true,
        relationId: true,
        relation: {
          select: {
            lastMessage: {
              select: {
                content: true,
              },
            },
          },
        },
      },
    });

    // if (!contact) throw new NotFoundException('Contact not found');
    return contact;
  }

  async deleteContact(
    contactId: number,
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    const db = tx ?? this.databaseService;

    contactId = validationContactId.parse(contactId);
    await db.contact.delete({
      where: {
        id: contactId,
      },
    });
  }

  async addNewContact(
    ownerId: number,
    data: AddNewContactReq,
    tx?: Prisma.TransactionClient,
  ): Promise<AddNewContactRes> {
    this.logger.debug(
      'addNewContact called',
      createLoggerMeta('contact', ContactService.name),
    );
    const db = tx ?? this.databaseService;
    const targetUser = await this.userService.getUserByPhone(data.phone);

    const contact = await db.contact.create({
      data: {
        ownerId: ownerId,
        name: data.name,
        targetId: targetUser.id,
      },
      select: {
        id: true,
        ownerId: true,
        name: true,
        targetId: true,
        target: {
          select: {
            phone: true,
          },
        },
        totalUnreadMessage: true,
        relationId: true,
        relation: {
          select: {
            lastMessage: {
              select: {
                content: true,
              },
            },
          },
        },
      },
    });

    return contact;
  }

  async addNewContactWithEmit(
    ownerId: number,
    data: AddNewContactReq,
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    this.logger.debug(
      'addNewContactWithEmit called',
      createLoggerMeta('contact', ContactService.name),
    );
    const db = tx ?? this.databaseService;
    const targetUser = await this.userService.getUserByPhone(data.phone);

    let contact = await db.contact.create({
      data: {
        ownerId: ownerId,
        name: data.name,
        targetId: targetUser.id,
      },
    });

    contact = await this.getContact(contact.id);

    await this.eventEmit.emitAsync('contact.created', contact);
  }

  async updateContactName(
    data: UpdateContactNameDto,
    tx?: Prisma.TransactionClient,
  ): Promise<UpdateContactRes> {
    const db = tx ?? this.databaseService;

    const updatedContact = await db.contact.update({
      where: {
        id: data.contactId,
      },
      data: {
        name: data.name,
      },
      select: {
        id: true,
        ownerId: true,
        name: true,
        targetId: true,
        target: {
          select: {
            phone: true,
          },
        },
        totalUnreadMessage: true,
        relationId: true,
        relation: {
          select: {
            lastMessage: {
              select: {
                content: true,
              },
            },
          },
        },
      },
    });
    return updatedContact;
  }

  async updateContactRelationId(
    data: UpdateContactRelationIdDto,
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    const db = tx ?? this.databaseService;

    await db.contact.update({
      where: { id: data.contactId },
      data: {
        relationId: data.relationId,
      },
    });
  }

  async updateContactUnreadCount(
    data: UpdateContactUnreadCountDto,
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    const db = tx ?? this.databaseService;

    await db.contact.update({
      where: { id: data.contactId },
      data: { totalUnreadMessage: data.totalUnreadMessage },
    });
  }
}
