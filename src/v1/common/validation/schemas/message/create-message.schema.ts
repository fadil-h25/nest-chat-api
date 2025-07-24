import z from 'zod';
import { messageContentSchema, messageIsReadSchema } from './message.schema';
import { userIdSchema } from '../user/user.schema';
import { relationTypeSchema } from '../relation/relation.schema';

export const createMessageSchema = z.object({
  content: messageContentSchema,
  isRead: messageIsReadSchema,
  targetId: userIdSchema,
  relationType: relationTypeSchema,
});
