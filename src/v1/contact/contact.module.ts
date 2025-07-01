import { forwardRef, Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { DatabaseModule } from 'src/database/database.module';
import { RelationMemberModule } from '../relation_member/relation_member.module';
import { RelationModule } from '../relation/relation.module';
import { UserModule } from '../user/user.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ContactListener } from './contact.listener';

@Module({
  controllers: [ContactController],
  providers: [ContactService, ContactListener],
  imports: [
    DatabaseModule,
    RelationMemberModule,
    RelationModule,
    UserModule,
    EventEmitterModule,
  ],
  exports: [ContactService],
})
export class ContactModule {}
