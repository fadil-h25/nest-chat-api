import { RelationType } from '@prisma/client';

export type GetRelationIdsWithBothUsersRes = {
  relationId: number;
  _count: {
    userId: number;
  };
}[];

export type FindRelationMemberResponse = {
  totalUnreadMessage: number;
  relation: {
    id: number;
    type: RelationType;
    lastMessageId: number | null;
  };
  id: number;
  relationId: number;
  userId: number;
};
