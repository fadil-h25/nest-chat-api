import z from 'zod';
import {
  messageOwnerIdSchema,
  messageContentSchema,
  messageRelationIdSchema,
  messageIsReadSchema,
} from './message.schema';

export const createMessageSchema = z.object({
  ownerId: messageOwnerIdSchema,
  content: messageContentSchema,
  relationId: messageRelationIdSchema,
  isRead: messageIsReadSchema,
});
