import { RelationType } from '@prisma/client';
import { z } from 'zod';

export const validationRelationType = z.enum([
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  RelationType.PRIVATE,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  RelationType.GROUP,
]);

export const validationRelationId = z.number().min(1, 'relation id invalid');

export const validationRelationIdNullable = z
  .number()
  .min(1, 'relation id invalid')
  .nullable()
  .optional();
