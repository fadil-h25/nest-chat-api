import { forwardRef, Module } from '@nestjs/common';
import { RelationMemberService } from './relation_member.service';
import { DatabaseModule } from 'src/database/database.module';
import { MessageModule } from '../message/message.module';
import { RelationMemberController } from './relation_member.controller';

@Module({
  providers: [RelationMemberService],
  imports: [DatabaseModule, forwardRef(() => MessageModule)],
  exports: [RelationMemberService],
  controllers: [RelationMemberController],
})
export class RelationMemberModule {}
