import z from 'zod';
import { relationIdSchema } from '../relation/relation.schema';
import { userIdSchema } from '../user/user.schema';

export const CreateRelationMemberSchema = z.object({
  userId: userIdSchema,
  relationId: relationIdSchema,
});
