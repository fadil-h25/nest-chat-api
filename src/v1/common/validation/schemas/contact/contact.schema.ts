import z from 'zod';

export const contactIdSchema = z
  .number()
  .int()
  .positive()
  .min(1, 'Contact id invalid');

export const contactNameSchema = z
  .string()
  .min(1, 'name must have at least 1 character')
  .max(50, 'name can only have a maximum of 50 characters');
