import { z } from 'zod';
import {
  ownerIdSchema,
  contentSchema,
  relationIdSchema,
  isReadSchema,
} from './message.schema';

export const createMessageSchema = z.object({
  ownerId: ownerIdSchema,
  content: contentSchema,
  relationId: relationIdSchema,
  isRead: isReadSchema,
});
