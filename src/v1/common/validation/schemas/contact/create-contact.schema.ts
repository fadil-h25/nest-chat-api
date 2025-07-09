import { z } from 'zod';
import { contactIdSchema } from './contact.schema';
import { userIdSchema } from '../user/user.schema';
import { relationIdSchema } from '../relation/relation.schema';

export const CreateContactSchema = z.object({
  id: contactIdSchema,
  targetId: userIdSchema,
  ownerId: userIdSchema,
  relationId: relationIdSchema,
});
