import z from 'zod';
import { messageContentSchema, messageIsReadSchema } from './message.schema';
import { userIdSchema } from '../user/user.schema';
import {
  relationIdSchemaNullable,
  relationTypeSchema,
} from '../relation/relation.schema';

export const createMessageSchema = z.object({
  ownerId: userIdSchema,
  content: messageContentSchema,
  relationId: relationIdSchemaNullable,
  relationType: relationTypeSchema,
  isRead: messageIsReadSchema,
  targetId: userIdSchema,
});
