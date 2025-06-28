import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Inject,
  Logger,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { mapPrismaError } from '../prisma-error-mapper';
import { Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Catch(PrismaClientKnownRequestError)
export class PrismaHttpKnownFilter
  implements ExceptionFilter<PrismaClientKnownRequestError>
{
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private logger: Logger) {}
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const error = mapPrismaError(exception, this.logger);
    return response.status(error.statusCode).json(error);
  }
}
