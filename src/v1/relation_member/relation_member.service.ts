import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { Prisma, RelationType } from '@prisma/client';

import { MessageService } from '../message/message.service';

import {
  GroupRelationMemberByUserAndTargetResponse,
  RelationMemberResponse,
} from './dto/response/relation-member-response.dto';
import { SocketServerHolder } from '../common/socket/socket-server.holder';
import { CreateRelationMembersRequestDto } from './dto/request/relation-member-http-request.dto';
import { Context } from '../common/types/context,type';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { createLoggerMeta } from '../utils/logger/logger.util';
import { relationMemberSelect } from './helper/relation-member-select.helper';
import { UserService } from '../user/user.service';

@Injectable()
export class RelationMemberService {
  constructor(
    private databaseService: DatabaseService,
    @Inject(forwardRef(() => MessageService))
    private messageService: MessageService,
    private userService: UserService,
    private socketServerHolder: SocketServerHolder,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  async createRelationMembers(
    data: CreateRelationMembersRequestDto[],
    tx?: Prisma.TransactionClient,
  ) {
    this.logger.debug(
      'createRelationMembers method called',
      createLoggerMeta('relation-member', RelationMemberService.name),
    );
    const db = tx ?? this.databaseService;

    await db.relationMember.createMany({
      data,
    });
  }

  async createRelationMember(
    ctx: Context,
    data: CreateRelationMembersRequestDto,
    tx?: Prisma.TransactionClient,
  ) {
    this.logger.debug(
      'createRelationMember method called',
      createLoggerMeta('relation-member', RelationMemberService.name),
    );
    const db = tx ?? this.databaseService;

    await db.relationMember.create({
      data,

      select: {
        relation: {
          select: {
            id: true,
            type: true,
            lastMessage: {
              select: {
                id: true,
                content: true,
                updatedAt: true,
                createdAt: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            phone: true,
          },
        },
      },
    });
  }

  async findRelationMembers(
    ctx: Context,
    userId: number,
  ): Promise<RelationMemberResponse[]> {
    const relationMembersData =
      await this.databaseService.relationMember.findMany({
        where: {
          NOT: {
            userId,
          },
        },

        select: relationMemberSelect,
      });
    const relationMembersDataWithUnreadCounts = await Promise.all(
      relationMembersData.map(async (dataRelation) => {
        const totalUnreadMessage =
          await this.messageService.countTotalUnreadMessage(
            dataRelation.user.id, // ambil dari lawan bicara
            dataRelation.relation.id,
          );

        return {
          ...dataRelation,
          totalUnreadMessage,
        };
      }),
    );

    return relationMembersDataWithUnreadCounts;
  }

  async findRelationMember(id: number): Promise<RelationMemberResponse> {
    this.logger.debug(
      'findRelationMember method called',
      createLoggerMeta('relation-member', RelationMemberService.name),
    );
    const relationMemberData =
      await this.databaseService.relationMember.findFirstOrThrow({
        where: {
          id,
        },
        select: relationMemberSelect,
      });

    const countTotalUnreadMessage =
      await this.messageService.countTotalUnreadMessage(
        relationMemberData.user.id,
        relationMemberData.relation.id,
      );
    return {
      ...relationMemberData,
      totalUnreadMessage: countTotalUnreadMessage,
    };
  }
  async groupRelationMemberByUserAndTarget(
    ctx: Context,
    targetId: number,
    tx?: Prisma.TransactionClient,
  ): Promise<GroupRelationMemberByUserAndTargetResponse> {
    this.logger.debug(
      'findRelationMemberByUserAndTarget method called',
      createLoggerMeta('relation-member', RelationMemberService.name),
    );
    const db = tx ?? this.databaseService;

    this.logger.debug(
      `targetId: ${targetId}`,
      createLoggerMeta('relation-member', RelationMemberService.name),
    );

    const validTarget = await this.userService.getUserById(ctx, targetId);

    const result = await db.relationMember.groupBy({
      by: ['relationId'],
      where: {
        userId: { in: [ctx.userId, validTarget.id] },
        relation: { type: RelationType.PRIVATE },
      },
      _count: { userId: true },
      having: {
        userId: { _count: { equals: 2 } }, // berarti ada dua user berbeda
      },
    });

    this.logger.debug(
      `result: ${JSON.stringify(result)}`,

      createLoggerMeta('relation-member', RelationMemberService.name),
    );

    return result;
  }
}
