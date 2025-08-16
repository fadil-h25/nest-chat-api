import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ZodError } from 'zod';
import { WsException } from '@nestjs/websockets';

import { ErrorCustom } from '../errors/error-custom.type';
import { prismaErrorMapper } from '../errors/mappers/prisma-error.mapper';
import { zodErrorMapper } from '../errors/mappers/zod-error.mapper';
import { Status } from '../enum/status.enum';

export class WsCustomException extends WsException {
  public readonly eventName: string;
  public readonly statusCode: number;
  public readonly errors: ErrorCustom[];
  public readonly originalError: unknown;
  public readonly status: Status = Status.ERROR;

  constructor(eventName: string, message: string, originalError: unknown) {
    const defaultStatus = 500;
    const errors: ErrorCustom[] = [];
    let statusCode = defaultStatus;

    if (originalError instanceof ErrorCustom) {
      errors.push(originalError);
      statusCode = originalError.statusCode;
    } else if (originalError instanceof PrismaClientKnownRequestError) {
      const error = prismaErrorMapper(originalError);
      statusCode = error.statusCode;
      errors.push(error);
    } else if (originalError instanceof ZodError) {
      errors.push(...zodErrorMapper(originalError));
      statusCode = 400;
    } else if (originalError instanceof Error) {
      errors.push(new ErrorCustom(defaultStatus, '', originalError.message));
    } else {
      errors.push(new ErrorCustom(defaultStatus, '', 'Unknown error'));
    }

    super({
      status: Status.ERROR,
      eventName,
      statusCode,
      errors,
      message,
    });

    this.eventName = eventName;
    this.originalError = originalError;
    this.statusCode = statusCode;
    this.errors = errors;
  }
}
