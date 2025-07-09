import z from 'zod';
import { messageIdSchema } from '../message/message.schema';
import { relationIdSchema, relationTypeSchema } from './relation.schema';

export const CreateRelationSchema = z.object({
  id: relationIdSchema,
  type: relationTypeSchema,
  lastMessageId: messageIdSchema,
});
