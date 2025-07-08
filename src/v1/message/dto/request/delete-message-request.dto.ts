import { DeleteMessageSchema } from 'src/v1/common/validation/schemas/message/delete-message.schema';
import { z } from 'zod';

export type DeleteMessageRequestDto = z.infer<typeof DeleteMessageSchema>;
