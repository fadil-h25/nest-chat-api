import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { mapPrismaError } from '../prisma-error-mapper';
import { Response } from 'express';

@Catch(PrismaClientKnownRequestError)
export class PrismaHttpKnownFilter
  implements ExceptionFilter<PrismaClientKnownRequestError>
{
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.json(mapPrismaError(exception));
  }
}
