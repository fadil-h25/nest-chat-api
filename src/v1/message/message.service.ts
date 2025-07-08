import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { DatabaseService } from 'src/database/database.service';
import { Logger } from 'winston';

import { createLoggerMeta } from '../utils/logger/logger.util';
import { CreateMessageRequestDto } from './dto/request/create-message-request.dto';
import { CreateMessageResponseDto } from './dto/response/create-message-response.dto';
import { FindMessageResponseDto } from './dto/response/find-message-response.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class MessageService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private databaseService: DatabaseService,
  ) {}

  async createNewMessage(
    userId: number,
    data: CreateMessageRequestDto,
    tx?: Prisma.TransactionClient,
  ): Promise<CreateMessageResponseDto> {
    const db = tx || this.databaseService;
    this.logger.info(
      'createMessage called',
      createLoggerMeta('message', MessageService.name),
    );
    const message = await db.message.create({
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

    return message;
  }
  // findMessage(): Promise<FindMessageResponseDto> {}
  findMessages() {}
  updateMessage() {}
  deleteMessage() {}
}
