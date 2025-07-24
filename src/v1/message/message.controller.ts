import { Body, Controller, Post, Req } from '@nestjs/common';
import { MessageService } from './message.service';
import { Context } from '../common/types/context,type';
import { getUserIdHttp } from '../utils/auth/get-user-id.util';
import { Request } from 'express';
import { CreateMessageRequestDto } from './dto/request/create-message-request.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation/zod-validation.pipe';
import { createMessageSchema } from '../common/validation/schemas/message/create-message.schema';

@Controller('messages')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Post()
  async addNewMessage(
    @Req() req: Request,
    @Body(new ZodValidationPipe(createMessageSchema))
    data: CreateMessageRequestDto,
  ) {
    const ctx: Context = { userId: getUserIdHttp(req) };
    await this.messageService.createMessage(ctx, data);

    return 'Create message successful';
  }
}
