import { Module } from '@nestjs/common';
import { RelationMemberService } from './relation_member.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  providers: [RelationMemberService],
  imports: [DatabaseModule],
})
export class RelationMemberModule {}
