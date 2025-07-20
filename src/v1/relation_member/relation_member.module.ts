import { Module } from '@nestjs/common';
import { RelationMemberService } from './relation_member.service';
import { DatabaseModule } from 'src/database/database.module';
import { MessageModule } from '../message/message.module';

@Module({
  providers: [RelationMemberService],
  imports: [DatabaseModule, MessageModule],
  exports: [RelationMemberService],
})
export class RelationMemberModule {}
