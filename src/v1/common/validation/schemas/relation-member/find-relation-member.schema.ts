import { z } from 'zod';
import { relationIdSchema } from '../relation/relation.schema';
import { userIdSchema } from '../user/user.schema';
import { relationMemberIdSchema } from './relation-member.schema';

export const FindRelationMembersSchema = z.object({
  relationId: relationIdSchema,
  userId: userIdSchema,
});

export const FindRelationMemberByUserAndTargetSchema = z.object({
  userId: userIdSchema,
  targetId: userIdSchema,
});
