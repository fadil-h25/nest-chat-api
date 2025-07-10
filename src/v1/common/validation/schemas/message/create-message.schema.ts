import z from 'zod';
import {
  messageContentSchema,
  messageRelationIdSchema,
  messageIsReadSchema,
} from './message.schema';
import { userIdSchema } from '../user/user.schema';

export const createMessageSchema = z.object({
  ownerId: userIdSchema,
  content: messageContentSchema,
  relationId: messageRelationIdSchema,
  isRead: messageIsReadSchema,
});
