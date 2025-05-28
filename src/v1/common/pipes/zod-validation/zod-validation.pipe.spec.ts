import { addNewUserSchema } from '../../validation/schemas/user.schema';
import { ZodValidationPipe } from './zod-validation.pipe';

describe('ZodValidationPipe', () => {
  it('should be defined', () => {
    expect(new ZodValidationPipe(addNewUserSchema)).toBeDefined();
  });
});
