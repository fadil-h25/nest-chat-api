import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Inject,
  Logger,
} from '@nestjs/common';

import { mapPrismaError } from '../prisma-error-mapper';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Socket } from 'socket.io';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { WsCustomException } from 'src/v1/common/exceptions/ws-custom.exception';

@Catch(PrismaClientKnownRequestError)
export class PrismaWsKnownFilter
  implements ExceptionFilter<PrismaClientKnownRequestError>
{
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private logger: Logger) {}
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    // console.log('prismaws cacth errror');
    this.logger.debug('PrismaWsKnownFilter: catch error');
    const ctx = host.switchToWs();
    const client = ctx.getClient<Socket>();

    const errorPayload = mapPrismaError(exception, this.logger);

    client.emit('contact:create:error', errorPayload);
  }
}
