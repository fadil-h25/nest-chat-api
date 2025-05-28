import { z } from 'zod';

export const validationUserId = z.number().min(0, 'user id invalid');
export const validationUserName = z
  .string()
  .min(1, 'name must have at least 1 character')
  .max(50, 'name can only have a maximum of 50 characters');
export const validationUserEmail = z.string().email('email is not valid');
export const validationUserPhone = z.string().regex(/^\d+$/, {
  message: 'Phone number must contain digits only',
});

export const validationUserPassword = z
  .string()
  .min(8, 'password must have at least 8 character')
  .max(50, 'password can only have a maximum of 50 characters');

export const AddNewUserSchema = z.object({
  name: validationUserName,
  email: validationUserEmail,
  password: validationUserEmail,
  phone: validationUserPhone,
});

export type AddNewUserDto = z.infer<typeof AddNewUserSchema>;
