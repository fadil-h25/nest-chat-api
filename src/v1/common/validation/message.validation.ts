import { z } from 'zod';

export const messageIdValidation = z.number().int().positive();
