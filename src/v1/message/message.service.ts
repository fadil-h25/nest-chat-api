import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { DatabaseService } from 'src/database/database.service';
import { Logger } from 'winston';

import { createLoggerMeta } from '../utils/logger/logger.util';
import { CreateMessageRequestDto } from './dto/request/create-message-request.dto';
import { CreateMessageResponseDto } from './dto/response/create-message-response.dto';
import { FindMessageResponseDto } from './dto/response/find-message-response.dto';
import { Prisma } from '@prisma/client';
import { FindMessageRequestDto } from './dto/request/find-message-request.dto';
import { UpdateMessageRequestDto } from './dto/request/update-message-request.dto';
import { UpdateMessageResponseDto } from './dto/response/update-message-response.dto';
import { DeleteMessageRequestDto } from './dto/request/delete-message-request.dto';
import { DeleteMessageResponseDto } from './dto/response/delete-message-response.dto';

@Injectable()
export class MessageService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private databaseService: DatabaseService,
  ) {}

  async createMessage(
    data: CreateMessageRequestDto,
    tx?: Prisma.TransactionClient,
  ): Promise<CreateMessageResponseDto> {
    const db = tx || this.databaseService;
    this.logger.info(
      'createMessage method called',
      createLoggerMeta('message', MessageService.name),
    );
    const message = await db.message.create({
      data: {
        content: data.content,
        relationId: data.relationId,
        ownerId: data.ownerId,
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

  async findMessage(
    data: FindMessageRequestDto,
    tx?: Prisma.TransactionClient,
  ): Promise<FindMessageResponseDto> {
    this.logger.info(
      'findMessage method called',
      createLoggerMeta('message', MessageService.name),
    );
    const db = tx || this.databaseService;

    const message = await db.message.findUniqueOrThrow({
      where: {
        id: data.id,
        ownerId: data.ownerId,
      },

      select: {
        id: true,
        ownerId: true,
        content: true,
        isRead: true,
        createdAt: true,
        relationId: true,
        updatedAt: true,
      },
    });

    return message;
  }

  async findMessages(
    data: FindMessageRequestDto,
    tx?: Prisma.TransactionClient,
  ): Promise<FindMessageResponseDto[]> {
    this.logger.info(
      'findMessages method called',
      createLoggerMeta('message', MessageService.name),
    );
    const db = tx || this.databaseService;

    const messages = await db.message.findMany({
      where: {
        id: data.id,
        ownerId: data.ownerId,
      },

      select: {
        id: true,
        ownerId: true,
        content: true,
        isRead: true,
        createdAt: true,
        relationId: true,
        updatedAt: true,
      },
    });

    return messages;
  }
  async updateMessage(
    data: UpdateMessageRequestDto,
    tx?: Prisma.TransactionClient,
  ): Promise<UpdateMessageResponseDto> {
    this.logger.info(
      'updateMessage method called',
      createLoggerMeta('message', MessageService.name),
    );
    const db = tx || this.databaseService;

    const updatedMessage = await db.message.update({
      where: {
        id: data.id,
        ownerId: data.ownerId,
      },

      data: {
        content: data.content,
      },

      select: {
        id: true,
        ownerId: true,
        content: true,
        isRead: true,
        createdAt: true,
        relationId: true,
        updatedAt: true,
      },
    });

    return updatedMessage;
  }
  async deleteMessage(
    data: DeleteMessageRequestDto,
    tx?: Prisma.TransactionClient,
  ): Promise<DeleteMessageResponseDto> {
    this.logger.info(
      'deleteMessage method called',
      createLoggerMeta('message', MessageService.name),
    );
    const db = tx || this.databaseService;

    const deletedMessage = await db.message.delete({
      where: {
        id: data.id,
        ownerId: data.ownerId,
      },

      select: {
        id: true,
      },
    });

    return deletedMessage;
  }
}
