import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { DatabaseModule } from 'src/database/database.module';
import { RelationMemberModule } from '../relation_member/relation_member.module';
import { RelationModule } from '../relation/relation.module';

@Module({
  controllers: [ContactController],
  providers: [ContactService],
  imports: [DatabaseModule, RelationMemberModule, RelationModule],
})
export class ContactModule {}
