import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { DatabaseModule } from 'src/database/database.module';
import { ContactModule } from '../contact/contact.module';
import { RelationModule } from '../relation/relation.module';
import { RelationMemberModule } from '../relation_member/relation_member.module';

@Module({
  providers: [MessageService],
  imports: [
    DatabaseModule,
    ContactModule,
    RelationModule,
    RelationMemberModule,
  ],
})
export class MessageModule {}
