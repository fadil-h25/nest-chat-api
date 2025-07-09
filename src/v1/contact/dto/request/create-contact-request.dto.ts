import { CreateContactSchema } from 'src/v1/common/validation/schemas/contact/create-contact.schema';
import { z } from 'zod';

export type CreateContactRequestDto = z.infer<typeof CreateContactSchema>;
