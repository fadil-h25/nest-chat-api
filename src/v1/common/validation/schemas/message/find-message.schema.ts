import { z } from 'zod';
import {
  contentSchema,
  createdAtSchema,
  isReadSchema,
  messageIdSchema,
  ownerIdSchema,
  relationIdSchema,
} from './message.schema';

export const findMessageSchema = z.object({
  id: messageIdSchema,
  ownerId: ownerIdSchema,
  relationId: relationIdSchema,
  content: contentSchema,
  isRead: isReadSchema,
  createdAt: createdAtSchema,
  updatedAt: createdAtSchema,
});
