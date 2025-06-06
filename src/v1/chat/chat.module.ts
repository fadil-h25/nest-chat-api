import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { MessageModule } from '../message/message.module';

@Module({
  providers: [ChatGateway],
  imports: [MessageModule],
})
export class ChatModule {}
