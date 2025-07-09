import { RelationType } from '@prisma/client';
import { z } from 'zod';

export const relationTypeSchema = z.enum([
  RelationType.PRIVATE,

  RelationType.GROUP,
]);

export const relationIdSchema = z.number().min(1, 'relation id invalid');

export const relationIdSchemaNullable = z
  .number()
  .min(1, 'relation id invalid')
  .nullable()
  .optional();
