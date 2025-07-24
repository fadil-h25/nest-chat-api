import { forwardRef, Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { DatabaseModule } from 'src/database/database.module';
import { ContactModule } from '../contact/contact.module';
import { RelationModule } from '../relation/relation.module';
import { RelationMemberModule } from '../relation_member/relation_member.module';
import { MessageController } from './message.controller';

@Module({
  providers: [MessageService],
  imports: [
    DatabaseModule,
    forwardRef(() => ContactModule),
    forwardRef(() => RelationMemberModule),
    RelationModule,
  ],
  exports: [MessageService],
  controllers: [MessageController],
})
export class MessageModule {}
