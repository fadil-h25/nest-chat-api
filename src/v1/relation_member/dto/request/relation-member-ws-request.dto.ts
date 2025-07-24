import { SendUpdatedRelationMemberSchema } from 'src/v1/common/validation/schemas/relation-member/relation-member-ws.schema';
import { z } from 'zod';

export type SendUpdatedRelationMemberRequest = z.infer<
  typeof SendUpdatedRelationMemberSchema
>;
