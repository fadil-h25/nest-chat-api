import z from 'zod';
import { messageIdSchema } from './message.schema';
import { relationIdSchema } from '../relation/relation.schema';

export const findMessageSchema = z.object({
  id: messageIdSchema,
  relationId: relationIdSchema,
});
