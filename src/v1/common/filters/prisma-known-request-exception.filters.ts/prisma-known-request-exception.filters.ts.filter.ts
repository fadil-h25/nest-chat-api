import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { Response } from 'express';

@Catch(PrismaClientKnownRequestError)
export class PrismaKnownRequestExceptionFilter
  implements ExceptionFilter<PrismaClientKnownRequestError>
{
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    switch (exception.code) {
      case 'P2002':
        statusCode = HttpStatus.CONFLICT;
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        message = `Duplicate value for unique field(s): ${exception.meta?.target}`;
        break;
      case 'P2025':
        statusCode = HttpStatus.NOT_FOUND;
        message = 'Record not found';
        break;
    }

    response.status(statusCode).json({
      statusCode,
      message,
      error: 'PrismaClientKnownRequestError',
    });
  }
}
