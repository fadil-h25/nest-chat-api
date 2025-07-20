import { z } from 'zod';
import { relationIdSchema } from '../relation/relation.schema';
import { userIdSchema } from '../user/user.schema';

export const FindRelationMembersSchema = z.object({
  relationId: relationIdSchema,
  userId: userIdSchema,
});
