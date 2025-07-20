import { FindRelationMembersSchema } from 'src/v1/common/validation/schemas/relation-member/find-relation-member.schema';
import { z } from 'zod';

export type FindRelationMembersRequestDto = z.infer<
  typeof FindRelationMembersSchema
>;
