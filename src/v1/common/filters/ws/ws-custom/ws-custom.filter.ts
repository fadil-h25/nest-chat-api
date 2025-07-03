import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Inject,
  Logger,
} from '@nestjs/common';
import { WsCustomException } from 'src/v1/common/exceptions/ws-custom.exception';
import { Server, Socket } from 'socket.io';
import { getUserIdWs } from 'src/v1/utils/auth/get-user-id.util';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { createLoggerMeta } from 'src/v1/utils/logger/logger.util';
import { SocketServerHolder } from 'src/v1/common/socket/socket-server.holder';

@Catch(WsCustomException)
export class WsCustomFilter implements ExceptionFilter {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private logger: Logger) {}
  catch(exception: WsCustomException, host: ArgumentsHost) {
    this.logger.debug(
      'WsCustomFilter called',
      createLoggerMeta('common', WsCustomException.name),
    );

    const server = SocketServerHolder.getServer();
    const ctx = host.switchToWs();
    const client: Socket = ctx.getClient<Socket>();

    const eventName = `${exception.eventName}:error`;

    const payload = {
      status: exception.status,
      statusCode: exception.statusCode,
      message: exception.message,
      errors: exception.errors,
    };

    const clientId = getUserIdWs(client);
    const room: string = 'user:' + String(clientId);

    server.to(room).emit(eventName, payload);
  }
}
