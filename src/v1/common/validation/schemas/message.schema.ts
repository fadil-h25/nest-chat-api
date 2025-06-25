import { z } from 'zod';
import { validationUserId } from './user.schema';
import {
  validationRelationId,
  validationRelationIdNullable,
} from './relation.schema';

const validationContentMessage = z
  .string()
  .max(500, 'Content can have at most 500 characters');

export const AddNewMessage = z.object({
  ownerId: validationUserId,
  content: validationContentMessage,
  relationId: validationRelationIdNullable,
  targetId: validationUserId,
});
export type AddNewMessageDto = z.infer<typeof AddNewMessage>;

export const GetAllMessages = z.object({
  ownerId: validationUserId,
  relationId: validationRelationId,
});
export type GetAllMessagesDto = z.infer<typeof GetAllMessages>;
