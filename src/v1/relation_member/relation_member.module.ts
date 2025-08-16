import { forwardRef, Module } from '@nestjs/common';
import { RelationMemberService } from './relation_member.service';
import { DatabaseModule } from 'src/database/database.module';
import { MessageModule } from '../message/message.module';
import { RelationMemberController } from './relation_member.controller';
import { UserModule } from '../user/user.module';

@Module({
  providers: [RelationMemberService],
  imports: [DatabaseModule, forwardRef(() => MessageModule), UserModule],
  exports: [RelationMemberService],
  controllers: [RelationMemberController],
})
export class RelationMemberModule {}
