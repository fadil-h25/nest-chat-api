import { RelationType } from '@prisma/client';

//for public and internal
export type RelationMemberResponse = {
  totalUnreadMessage: number;
  user: {
    id: number;
    phone: string;
  };
  relation: {
    id: number;
    type: RelationType;
    lastMessage: {
      id: number;
      content: string;
      createdAt: Date;
      updatedAt: Date;
    } | null;
  };
};

//only for internal
export type GroupRelationMemberByUserAndTargetResponse = {
  relationId: number;
  _count: {
    relationId: number;
  };
}[];
