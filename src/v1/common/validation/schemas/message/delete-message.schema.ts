import { z } from 'zod';
import { messageIdSchema, messageOwnerIdSchema } from './message.schema';

export const DeleteMessageSchema = z.object({
  id: messageIdSchema,
  ownerId: messageOwnerIdSchema,
});
