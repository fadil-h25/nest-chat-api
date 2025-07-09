import { z } from 'zod';
import {
  messageIdSchema,
  messageContentSchema,
  messageOwnerIdSchema,
  messageRelationIdSchema,
  messageIsReadSchema,
} from './message.schema';

export const updateMessageSchema = z.object({
  id: messageIdSchema,
  content: messageContentSchema,
  ownerId: messageOwnerIdSchema,
  relationId: messageRelationIdSchema,
  isRead: messageIsReadSchema,
});
