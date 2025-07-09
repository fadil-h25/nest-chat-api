import { findMessageSchema } from 'src/v1/common/validation/schemas/message/find-message.schema';
import z from 'zod';

export type FindMessageRequestDto = z.infer<typeof findMessageSchema>;
