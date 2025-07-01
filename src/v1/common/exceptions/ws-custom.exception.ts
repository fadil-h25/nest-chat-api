import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ZodError } from 'zod';

import { ErrorCustom } from '../errors/error-custom.type';
import { prismaErrorMapper } from '../errors/mappers/prisma-error.mapper';
import { zodErrorMapper } from '../errors/mappers/zod-error.mapper';

export class WsCustomException extends Error {
  public readonly eventName: string;
  public readonly statusCode: number;
  public readonly errors: ErrorCustom[];
  public readonly originalError: unknown;

  constructor(eventName: string, message: string, originalError: unknown) {
    super(message);
    this.eventName = eventName;
    this.originalError = originalError;
    this.errors = [];
    this.statusCode = 500;

    if (originalError instanceof ErrorCustom) {
      this.errors.push(originalError);
      this.statusCode = originalError.statusCode;
    } else if (originalError instanceof PrismaClientKnownRequestError) {
      const error = prismaErrorMapper(originalError);
      this.statusCode = error.statusCode;
      this.errors.push(error);
    } else if (originalError instanceof ZodError) {
      this.errors = zodErrorMapper(originalError);
      this.statusCode = 400;
    } else if (originalError instanceof Error) {
      // Optional: jika error biasa tapi bukan ErrorCustom
      this.errors.push(
        new ErrorCustom(this.statusCode, '', originalError.message),
      );
    } else {
      // Optional: jika originalError bukan objek error
      this.errors.push(new ErrorCustom(this.statusCode, '', 'Unknown error'));
    }
  }
}
