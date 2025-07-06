import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { DatabaseService } from 'src/database/database.service';
import { Logger } from 'winston';
import { AddNewMessageDto } from '../common/validation/schemas/message.schema';
import { createLoggerMeta } from '../utils/logger/logger.util';

@Injectable()
export class MessageService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private databaseService: DatabaseService,
  ) {}

  async addNewMessage(userId: number, data: AddNewMessageDto) {
    this.logger.info(
      'AddNewMessage called',
      createLoggerMeta('message', MessageService.name),
    );
    await this.databaseService.message.create({
      data: {
        content: data.content,
        relationId: data.relationId,
        ownerId: userId,
      },
      select: {
        id: true,
        content: true,
        relationId: true,
        ownerId: true,
        owner: {
          select: {
            name: true,
          },
        },

        createdAt: true,
        updatedAt: true,
      },
    });
  }
  getMessages() {}
  getMesssage() {}
  updateMessage() {}
  deleteMessage() {}
}
