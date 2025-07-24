import { z } from 'zod';
import { relationIdSchema } from './relation.schema';
import { messageIdSchema } from '../message/message.schema';

export const updateRelationSchema = z.object({
  id: relationIdSchema,
  lastMessageId: messageIdSchema,
});
