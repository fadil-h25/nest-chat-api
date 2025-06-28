import { forwardRef, Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';

import { ContactModule } from '../contact/contact.module';

@Module({
  providers: [ChatGateway],
  imports: [forwardRef(() => ContactModule)],
  exports: [ChatGateway],
})
export class ChatModule {}
