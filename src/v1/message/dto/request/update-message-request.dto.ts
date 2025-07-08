import { updateMessageSchema } from 'src/v1/common/validation/schemas/message/update-message.schema';
import { z } from 'zod';

export type UpdateMessageRequestDto = z.infer<typeof updateMessageSchema>;
