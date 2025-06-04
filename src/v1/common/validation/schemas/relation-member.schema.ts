import { z } from 'zod';
import { validationUserId } from './user.schema';
import { validationRelationId } from './relation.schema';

export const AddNewRelationMemberSchema = z.object({
  userId: validationUserId,
  relationId: validationRelationId,
});

export type AddNewRelationMemberDto = z.infer<
  typeof AddNewRelationMemberSchema
>;
