import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import {
  AddNewContactDto,
  UpdateContactLastMessageIdDto,
  UpdateContactNameDto,
  UpdateContactRelationIdDto,
  UpdateContactUnreadCountDto,
  validationContactId,
} from '../common/validation/schemas/contact.schema';

import { RelationService } from '../relation/relation.service';
import { RelationMemberService } from '../relation_member/relation_member.service';
import { validationUserId } from '../common/validation/schemas/user.schema';
import { Contact } from '@prisma/client';

@Injectable()
export class ContactService {
  constructor(
    private databaseService: DatabaseService,
    private relationService: RelationService,
    private relationMemberService: RelationMemberService,
  ) {}

  async getAllContacts(ownerId: number): Promise<Contact[] | []> {
    ownerId = validationUserId.parse(ownerId);
    const contacts = await this.databaseService.contact.findMany({
      where: {
        ownerId,
      },
    });
    return contacts;
  }

  async deleteContact(contactId: number): Promise<void> {
    contactId = validationContactId.parse(contactId);
    await this.databaseService.contact.delete({
      where: {
        id: contactId,
      },
    });
  }

  async addNewContact(data: AddNewContactDto): Promise<void> {
    await this.databaseService.contact.create({
      data,
    });
  }

  async updateContactName(data: UpdateContactNameDto): Promise<void> {
    await this.databaseService.contact.update({
      where: {
        id: data.contactId,
      },
      data: {
        name: data.name,
      },
    });
  }

  async updateContactRelationId(
    data: UpdateContactRelationIdDto,
  ): Promise<void> {
    await this.databaseService.contact.update({
      where: { id: data.contactId },
      data: {
        relationId: data.relationId,
      },
    });
  }

  async updateContactUnreadCount(
    data: UpdateContactUnreadCountDto,
  ): Promise<void> {
    await this.databaseService.contact.update({
      where: { id: data.contactId },
      data: { totalUnreadMessage: data.totalUnreadMessage },
    });
  }

  async updateContactLastMessage(
    data: UpdateContactLastMessageIdDto,
  ): Promise<void> {
    await this.databaseService.contact.update({
      where: { id: data.contactId },
      data: { lastMessageId: data.lastMessageId },
    });
  }
}
