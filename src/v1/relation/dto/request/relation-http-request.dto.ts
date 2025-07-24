import { updateRelationSchema } from 'src/v1/common/validation/schemas/relation/update-relation.schema';
import { z } from 'zod';

export type UpdateRelationRequest = z.infer<typeof updateRelationSchema>;
