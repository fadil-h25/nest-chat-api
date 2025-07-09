import { z } from 'zod';

export const relationMemberIdSchema = z
  .number()
  .int()
  .positive()
  .min(1, 'Relation Member id invalid');
