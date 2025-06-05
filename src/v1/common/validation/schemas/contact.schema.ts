import { z } from 'zod';
import { validationUserId, validationUserName } from './user.schema';

export const validationContactId = z.number().min(1, 'Contact id invalid');
export const validationContactName = z
  .string()
  .min(1, 'name must have at least 1 character')
  .max(50, 'name can only have a maximum of 50 characters');

export const AddNewContact = z.object({
  targetId: validationUserId,
  ownerId: validationUserId,
  name: validationUserName,
});

export type AddNewContactDto = z.infer<typeof AddNewContact>;

export const UpdateContactName = z.object({
  contactId: validationContactId,
  name: validationUserName,
});

export type UpdateContactNameDto = z.infer<typeof UpdateContactName>;

export const UpdateContactRelationId = z.object({
  contactId: z.number().min(1, 'Contact id invalid'),
  relationId: z.number().min(1, 'Relation id invalid'),
});

export type UpdateContactRelationIdDto = z.infer<
  typeof UpdateContactRelationId
>;

export const UpdateContactLastMessageId = z.object({
  contactId: z.number().min(1, 'Contact id invalid'),
  lastMessageId: z.number().min(1, 'Last message id invalid'),
});

export type UpdateContactLastMessageIdDto = z.infer<
  typeof UpdateContactLastMessageId
>;

export const UpdateContactUnreadCount = z.object({
  contactId: z.number().min(1, 'Contact id invalid'),
  totalUnreadMessage: z
    .number()
    .min(0, 'Unread message count cannot be negative'),
});

export type UpdateContactUnreadCountDto = z.infer<
  typeof UpdateContactUnreadCount
>;
