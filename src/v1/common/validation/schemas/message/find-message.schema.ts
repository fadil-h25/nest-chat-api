import z from 'zod';
import { messageOwnerIdSchema, messageIdSchema } from './message.schema';

export const findMessageSchema = z.object({
  id: messageIdSchema,
  ownerId: messageOwnerIdSchema,
});
