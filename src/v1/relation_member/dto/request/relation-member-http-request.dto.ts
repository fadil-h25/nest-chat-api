import { CreateRelationMemberSchema } from 'src/v1/common/validation/schemas/relation-member/create-relation-member.schema';
import {
  FindRelationMemberByUserAndTargetSchema,
  FindRelationMembersSchema,
} from 'src/v1/common/validation/schemas/relation-member/find-relation-member.schema';
import z from 'zod';

export type FindRelationMembersRequestDto = z.infer<
  typeof FindRelationMembersSchema
>;

export type CreateRelationMembersRequestDto = z.infer<
  typeof CreateRelationMemberSchema
>;

export type FindRelationMemberByUserAndTargetRequestDto = z.infer<
  typeof FindRelationMemberByUserAndTargetSchema
>;
