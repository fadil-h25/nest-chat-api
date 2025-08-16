export type MessageResponse = {
  id: number;
  content: string;
  relationId: number;
  ownerId: number;
  createdAt: Date;
  updatedAt: Date;
  isRead: boolean;
};
