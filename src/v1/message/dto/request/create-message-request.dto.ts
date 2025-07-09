import { createMessageSchema } from 'src/v1/common/validation/schemas/message/create-message.schema';
import { z } from 'zod';

export type CreateMessageRequestDto = z.infer<typeof createMessageSchema>;
