import { RelationType } from '@prisma/client';
import { MessageResponse } from 'src/v1/message/dto/response/message-response.dto';

//for public and internal
export type RelationMemberResponse = {
  id: number;
  user: {
    id: number;
    name: string;
    phone: string;
  };
  relation: {
    id: number;
    type: RelationType;
    lastMessage: MessageResponse | null;
  };
  totalUnreadMessage: number;
};

//only for internal
export type GroupRelationMemberByUserAndTargetResponse = {
  relationId: number;
  _count: {
    userId: number;
  };
}[];
