export type MessageResponseDto = {
  id: number;
  content: string;
  relationId: number;
  ownerId: number;
  owner: {
    name: string;
  };

  createdAt: Date;
  updatedAt: Date;
};
