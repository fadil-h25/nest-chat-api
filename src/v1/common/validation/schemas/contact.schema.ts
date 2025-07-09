import { z } from 'zod';
import { validationUserName, validationUserPhone } from './user.schema';
import { relationIdSchemaNullable } from './relation/relation.schema';

export const validationContactId = z.number().min(1, 'Contact id invalid');
export const validationContactName = z
  .string()
  .min(1, 'name must have at least 1 character')
  .max(50, 'name can only have a maximum of 50 characters');

export const AddNewContact = z.object({
  phone: validationUserPhone,
  name: validationUserName,
  relationId: relationIdSchemaNullable,
});

export type AddNewContactReq = z.infer<typeof AddNewContact>;

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

export const UpdateContactsLastMessageByRelationId = z.object({
  relationId: z.number().min(1, 'Relation id invalid'),
  lastMessageId: z.number().min(1, 'Last message id invalid'),
});

export type UpdateContactsLastMessageByRelationIdDto = z.infer<
  typeof UpdateContactsLastMessageByRelationId
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

export const GetContactPhoneByIdSchema = z.object({
  id: validationContactId,
  phone: validationUserPhone,
});

export type GetContactPhoneByIdReq = z.infer<typeof GetContactPhoneByIdSchema>;
