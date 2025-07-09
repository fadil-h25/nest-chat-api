import z from 'zod';
import { relationIdSchema } from '../relation/relation.schema';
import { userIdSchema } from '../user/user.schema';
import { relationMemberIdSchema } from './relation-member.schema';

export const CreateRelationMemberSchema = z.object({
  id: relationMemberIdSchema,
  userId: userIdSchema,
  relationId: relationIdSchema,
});
