export type UpdateMessageResponseDto = {
  id: number;
  content: string;
  relationId: number;
  ownerId: number;
  createdAt: Date;
  updatedAt: Date;
};
