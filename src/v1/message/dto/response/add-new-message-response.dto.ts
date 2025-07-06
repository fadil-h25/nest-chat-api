export type AddNewMessageResponseDto = {
  id: number;
  content: string;
  relationId: number;
  ownerId: number;
  createdAt: Date;
  updatedAt: Date;
};

export type UpdateMessageResponseDto = {
  id: number;
  content: string;
  relationId: number;
  ownerId: number;
  createdAt: Date;
  updatedAt: Date;
};

export type DeleteMessageResponseDto = {
  id: number;
};
