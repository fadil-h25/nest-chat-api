import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { Prisma } from '@prisma/client';

import { CreateRelationMembersRequestDto } from './dto/request/create-relation-members-request.dto';
import { FindRelationMembersRequestDto } from './dto/request/find-relation-members-request.dto';
import { MessageService } from '../message/message.service';

import { RelationMemberResponse } from './dto/response/relation-member-response.dto';

@Injectable()
export class RelationMemberService {
  constructor(
    private databaseService: DatabaseService,
    private messageService: MessageService,
  ) {}

  async createRelationMembers(
    data: CreateRelationMembersRequestDto[],
    tx?: Prisma.TransactionClient,
  ) {
    const db = tx ?? this.databaseService;

    await db.relationMember.createMany({
      data,
    });
  }

  async findRelationMembers(
    data: FindRelationMembersRequestDto,
  ): Promise<RelationMemberResponse[]> {
    const relationMembersData =
      await this.databaseService.relationMember.findMany({
        where: {
          relationId: data.relationId, //mengambil lawan bicara ketika
          NOT: {
            userId: data.userId,
          },
        },
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
    const relationMembersDataWithUnreadCounts = await Promise.all(
      relationMembersData.map(async (dataRelation) => {
        const totalUnreadMessage =
          await this.messageService.countTotalUnreadMessage(
            data.userId,
            data.relationId,
          );

        return {
          ...dataRelation,
          totalUnreadMessage,
          ownerId: data.userId,
        };
      }),
    );

    return relationMembersDataWithUnreadCounts;
  }
}
