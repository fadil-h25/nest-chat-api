import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { RelationMember } from '@prisma/client';
import { AddNewRelationMemberDto } from '../common/validation/schemas/relation-member.schema';

@Injectable()
export class RelationMemberService {
  constructor(private databaseService: DatabaseService) {}

  async addNewRelationMember(
    data: AddNewRelationMemberDto,
  ): Promise<RelationMember> {
    const relatioMember = await this.databaseService.relationMember.create({
      data,
    });

    return relatioMember;
  }
}
