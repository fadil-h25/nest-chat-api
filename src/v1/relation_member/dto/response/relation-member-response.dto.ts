import { RelationType } from '@prisma/client';

export type RelationMemberResponse = {
  ownerId: number;
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
