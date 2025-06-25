import { z } from 'zod';
import {
  validationUserEmail,
  validationUserName,
  validationUserPassword,
  validationUserPhone,
} from './user.schema';

export const RegsiterSchema = z.object({
  name: validationUserName,
  email: validationUserEmail,
  password: validationUserPassword,
  phone: validationUserPhone,
});

export type RegisterReq = z.infer<typeof RegsiterSchema>;

export const LoginSchema = z.object({
  email: validationUserEmail,
  password: validationUserPassword,
});

export type LoginReq = z.infer<typeof LoginSchema>;
