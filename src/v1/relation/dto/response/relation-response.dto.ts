import { RelationType } from '@prisma/client';
import { MessageResponse } from 'src/v1/message/dto/response/message-response.dto';

export type RelationResponse = {
  id: number;
  type: RelationType;
  lastMessage: MessageResponse;
};
