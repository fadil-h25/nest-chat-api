import { z } from 'zod';
import { validationUserId } from './user.schema';
import { relationIdSchema } from './relation/relation.schema';

export const AddNewRelationMemberSchema = z.object({
  userId: validationUserId,
  relationId: relationIdSchema,
});

export type AddNewRelationMemberDto = z.infer<
  typeof AddNewRelationMemberSchema
>;
