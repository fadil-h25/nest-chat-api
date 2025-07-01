import { ZodError } from 'zod';
import { ErrorCustom } from '../error-custom.type';

export function zodErrorMapper(error: ZodError): ErrorCustom[] {
  const errors: ErrorCustom[] = error.issues.map((err) => {
    return new ErrorCustom(400, err.path[0] as string, err.message);
  });

  return errors;
}
