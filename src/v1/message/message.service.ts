import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { DatabaseService } from 'src/database/database.service';
import { Logger } from 'winston';

import { createLoggerMeta } from '../utils/logger/logger.util';
import { CreateMessageRequestDto } from './dto/request/create-message-request.dto';

import { Prisma } from '@prisma/client';
import { FindMessageRequestDto } from './dto/request/find-message-request.dto';
import { UpdateMessageRequestDto } from './dto/request/update-message-request.dto';

import { DeleteMessageRequestDto } from './dto/request/delete-message-request.dto';

import { RelationService } from '../relation/relation.service';
import { RelationMemberService } from '../relation_member/relation_member.service';
import { messageSelect } from './helpers/message-select.helper';
import { MessageResponseDto } from './dto/response/message-response.dto';
import { DeletedMessageResponseDto } from './dto/response/deleted-message-response.dto';

@Injectable()
export class MessageService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private databaseService: DatabaseService,
    private relationService: RelationService,
    private relationMemberService: RelationMemberService,
  ) {}

  async createMessage(
    data: CreateMessageRequestDto,
  ): Promise<MessageResponseDto> {
    const db = this.databaseService;
    this.logger.info(
      'createMessage method called',
      createLoggerMeta('message', MessageService.name),
    );

    if (data.relationId == null) {
      const message = await this.databaseService.$transaction(async (tx) => {
        return this.createFirstMessage(data, tx);
      });
      return message;
    } else {
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
  }

  async createFirstMessage(
    data: CreateMessageRequestDto,
    tx?: Prisma.TransactionClient,
  ) {
    this.logger.debug(
      'createFirstMessage() called',
      createLoggerMeta('message', MessageService.name),
    );
    const db = tx ?? this.databaseService;

    const relation = await this.relationService.createRelation(
      data.relationType,
    );

    await this.relationMemberService.createRelationMembers([
      { relationId: relation.id, userId: data.ownerId },
      { relationId: relation.id, userId: data.targetId },
    ]);

    const message = await db.message.create({
      data: {
        content: data.content,
        relationId: relation.id,
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
  ): Promise<MessageResponseDto> {
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

      select: messageSelect,
    });

    return message;
  }

  async findMessages(
    data: FindMessageRequestDto,
    tx?: Prisma.TransactionClient,
  ): Promise<MessageResponseDto[]> {
    this.logger.info(
      'findMessages method called',
      createLoggerMeta('message', MessageService.name),
    );
    const db = tx || this.databaseService;

    const messages = await db.message.findMany({
      where: {
        ownerId: data.ownerId,
      },

      select: messageSelect,
    });

    return messages;
  }

  async updateMessage(
    data: UpdateMessageRequestDto,
    tx?: Prisma.TransactionClient,
  ): Promise<MessageResponseDto> {
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

      select: messageSelect,
    });

    return updatedMessage;
  }
  async deleteMessage(
    data: DeleteMessageRequestDto,
    tx?: Prisma.TransactionClient,
  ): Promise<DeletedMessageResponseDto> {
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
        relationId: true,
      },
    });

    return deletedMessage;
  }

  async countTotalUnreadMessage(ownerId: number, relationId: number) {
    const total = await this.databaseService.message.count({
      where: {
        ownerId,
        relationId,
        isRead: false,
      },
    });

    return total;
  }
}
