import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  providers: [MessageService],
  imports: [DatabaseModule],
})
export class MessageModule {}
