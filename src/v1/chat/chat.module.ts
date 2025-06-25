import { forwardRef, Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { MessageModule } from '../message/message.module';
import { ContactModule } from '../contact/contact.module';

@Module({
  providers: [ChatGateway],
  imports: [forwardRef(() => ContactModule), MessageModule],
  exports: [ChatGateway],
})
export class ChatModule {}
