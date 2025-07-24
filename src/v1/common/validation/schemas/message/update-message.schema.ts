import { z } from 'zod';
import {
  messageIdSchema,
  messageContentSchema,
  messageRelationIdSchema,
} from './message.schema';

export const updateMessageSchema = z.object({
  id: messageIdSchema,
  relationId: messageRelationIdSchema,
  content: messageContentSchema,
});
