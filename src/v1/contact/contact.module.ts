import { forwardRef, Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { DatabaseModule } from 'src/database/database.module';

import { RelationModule } from '../relation/relation.module';
import { UserModule } from '../user/user.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RelationMemberModule } from '../relation_member/relation_member.module';

@Module({
  controllers: [ContactController],
  providers: [ContactService],
  imports: [
    DatabaseModule,
    forwardRef(() => RelationMemberModule),
    RelationModule,
    UserModule,
    EventEmitterModule,
  ],
  exports: [ContactService],
})
export class ContactModule {}
