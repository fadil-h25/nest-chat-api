import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { RelationMember, Prisma } from '@prisma/client';
import { GetRelationIdsWithBothUsersRes } from './dto/relation-member-response.dto';
import { AddNewRelationMemberDto } from '../common/validation/schemas/relation-member.schema';
import { CreateRelationMembersRequestDto } from './dto/request/create-relation-members-request.dto';

@Injectable()
export class RelationMemberService {
  constructor(private databaseService: DatabaseService) {}

  async createRelationMembers(
    data: CreateRelationMembersRequestDto[],
    tx?: Prisma.TransactionClient,
  ) {
    const db = tx ?? this.databaseService;

    await db.relationMember.createMany({
      data,
    });
  }

  async addNewRelationMember(
    userId: number,
    relationId: number,
    tx?: Prisma.TransactionClient,
  ): Promise<RelationMember> {
    const db = tx ?? this.databaseService;

    const relationMember = await db.relationMember.create({
      data: {
        relationId,
        userId,
      },
    });

    return relationMember;
  }

  async addTwoNewRelationMembers(
    data: AddNewRelationMemberDto[],
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    const db = tx ?? this.databaseService;

    await db.relationMember.createMany({
      data,
    });
  }

  async getRelationIdsWithBothUsers(
    userId1: number,
    userId2: number,
  ): Promise<GetRelationIdsWithBothUsersRes> {
    const relationMembers = await this.databaseService.relationMember.groupBy({
      by: 'relationId',
      where: {
        userId: {
          in: [userId1, userId2],
        },
      },
      having: {
        userId: {
          _count: {
            equals: 2,
          },
        },
      },
      _count: {
        userId: true,
      },
    });

    return relationMembers;
  }
}
