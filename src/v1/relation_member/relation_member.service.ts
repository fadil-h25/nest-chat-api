import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { RelationMember } from '@prisma/client';
import { GetRelationIdsWithBothUsersRes } from './dto/relation-member-response.dto';

@Injectable()
export class RelationMemberService {
  constructor(private databaseService: DatabaseService) {}

  async addNewRelationMember(
    userId: number,
    relationId: number,
  ): Promise<RelationMember> {
    const relatioMember = await this.databaseService.relationMember.create({
      data: {
        relationId,
        userId,
      },
    });

    return relatioMember;
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
