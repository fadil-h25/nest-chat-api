import { Injectable } from '@nestjs/common';
import { Message } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import {
  AddNewMessageDto,
  GetAllMessagesDto,
} from '../common/validation/schemas/message.schema';

@Injectable()
export class MessageService {
  constructor(private databaseService: DatabaseService) {}

  async getAllMessages(data: GetAllMessagesDto): Promise<Message[] | []> {
    const messages = await this.databaseService.message.findMany({
      where: {
        ownerId: data.ownerId,
        relationId: data.relationId,
      },
    });

    return messages;
  }
  async addNewMessage(data: AddNewMessageDto): Promise<Message> {
    const message = await this.databaseService.message.create({
      data: {
        ownerId: data.ownerId,
        content: data.content,
        relationId: data.relationId,
      },
    });
    return message;
  }
}
