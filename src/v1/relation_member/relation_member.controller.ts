import { Controller, Get, Req } from '@nestjs/common';
import { RelationMemberService } from './relation_member.service';
import { Context } from '../common/types/context,type';
import { getUserIdHttp } from '../utils/auth/get-user-id.util';
import { Request } from 'express';

@Controller('relation-members')
export class RelationMemberController {
  constructor(private relationMemberService: RelationMemberService) {}

  @Get()
  async getRelationMembers(@Req() req: Request) {
    const context: Context = { userId: getUserIdHttp(req) };
    const relationMembers =
      await this.relationMemberService.findRelationMembers(
        context,
        context.userId,
      );

    return relationMembers;
  }
}
