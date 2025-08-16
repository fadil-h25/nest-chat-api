import { forwardRef, Inject, Injectable } from '@nestjs/common';
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

import { DeletedMessageResponseDto } from './dto/response/deleted-message-response.dto';
import { Context } from '../common/types/context,type';
import { MessageResponse } from './dto/response/message-response.dto';

@Injectable()
export class MessageService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private databaseService: DatabaseService,
    private relationService: RelationService,
    @Inject(forwardRef(() => RelationMemberService))
    private relationMemberService: RelationMemberService,
  ) {}

  async createMessage(
    ctx: Context,
    data: CreateMessageRequestDto,
  ): Promise<MessageResponse> {
    const db = this.databaseService;
    this.logger.info(
      'createMessage method called',
      createLoggerMeta('message', MessageService.name),
    );

    const relation =
      await this.relationMemberService.groupRelationMemberByUserAndTarget(
        ctx,
        data.targetId,
      );

    // on hold
    if (relation.length < 1) {
      const message = await this.databaseService.$transaction(async (tx) => {
        return this.createFirstMessage(ctx, data, tx);
      });
      return message;
    } else {
      return await db.$transaction(async (tx) => {
        const message = await tx.message.create({
          data: {
            content: data.content,
            relationId: relation[0].relationId,
            ownerId: ctx.userId,
          },
          select: messageSelect,
        });

        await this.relationService.updateLastMessageId(
          ctx,
          {
            id: relation[0].relationId,
            lastMessageId: message.id,
          },
          tx,
        );
        return message;
      });
    }
  }

  private async createFirstMessage(
    ctx: Context,
    data: CreateMessageRequestDto,
    tx?: Prisma.TransactionClient,
  ) {
    this.logger.debug(
      'createFirstMessage method called',
      createLoggerMeta('message', MessageService.name),
    );
    const db = tx ?? this.databaseService;

    const relation = await this.relationService.createRelation(
      ctx,
      data.relationType,
      tx,
    );

    await this.relationMemberService.createRelationMembers(
      [
        { relationId: relation.id, userId: ctx.userId },
        { relationId: relation.id, userId: data.targetId },
      ],
      tx,
    );

    const message = await db.message.create({
      data: {
        content: data.content,
        relationId: relation.id,
        ownerId: ctx.userId,
      },
      select: messageSelect,
    });
    this.logger.debug(
      'message id: ' + message.id,
      createLoggerMeta('message', MessageService.name),
    );

    await this.relationService.updateLastMessageId(
      ctx,
      {
        id: relation.id,
        lastMessageId: message.id,
      },
      tx,
    );

    return message;
  }

  async findMessage(
    ctx: Context,
    data: FindMessageRequestDto,
    tx?: Prisma.TransactionClient,
  ): Promise<MessageResponse> {
    this.logger.info(
      'findMessage method called',
      createLoggerMeta('message', MessageService.name),
    );
    const db = tx || this.databaseService;

    const message = await db.message.findUniqueOrThrow({
      where: {
        id: data.id,
        ownerId: ctx.userId,
        relationId: data.relationId,
      },

      select: messageSelect,
    });

    return message;
  }

  async findMessages(
    ctx: Context,
    relationId: number,
    tx?: Prisma.TransactionClient,
  ): Promise<MessageResponse[]> {
    this.logger.info(
      'findMessages method called',
      createLoggerMeta('message', MessageService.name),
    );
    const db = tx || this.databaseService;

    const messages = await db.message.findMany({
      where: {
        ownerId: ctx.userId,
        relationId,
      },

      select: messageSelect,
    });

    return messages;
  }

  async updateMessage(
    ctx: Context,
    data: UpdateMessageRequestDto,
    tx?: Prisma.TransactionClient,
  ): Promise<MessageResponse> {
    this.logger.info(
      'updateMessage method called',
      createLoggerMeta('message', MessageService.name),
    );
    const db = tx || this.databaseService;

    const updatedMessage = await db.message.update({
      where: {
        id: data.id,
        ownerId: ctx.userId,
      },

      data: {
        content: data.content,
      },

      select: messageSelect,
    });

    return updatedMessage;
  }
  async deleteMessage(
    ctx: Context,
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
