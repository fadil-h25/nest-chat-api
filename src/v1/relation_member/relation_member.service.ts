import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { Prisma } from '@prisma/client';

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
}
