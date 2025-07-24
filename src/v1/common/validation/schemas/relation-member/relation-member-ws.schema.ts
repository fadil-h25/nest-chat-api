import { z } from 'zod';
import { relationMemberIdSchema } from './relation-member.schema';
import {
  relationIdSchema,
  relationTypeSchema,
} from '../relation/relation.schema';

export const SendUpdatedRelationMemberSchema = z.object({
  id: relationMemberIdSchema,
  relationId: relationIdSchema,
  relationType: relationTypeSchema,
});
