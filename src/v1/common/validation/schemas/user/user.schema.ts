import z from 'zod';

export const userIdSchema = z.number().int().positive(); // konsisten dengan messageIdSchema
export const userNameSchema = z
  .string()
  .min(1, 'name must have at least 1 character')
  .max(50, 'name can only have a maximum of 50 characters');

export const userEmailSchema = z.string().email('email is not valid');

export const userPhoneSchema = z.string().regex(/^\d+$/, {
  message: 'Phone number must contain digits only',
});

export const userPasswordSchema = z
  .string()
  .min(8, 'password must have at least 8 character')
  .max(50, 'password can only have a maximum of 50 characters');
