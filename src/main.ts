import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { AuthenticatedSocketAdapter } from './v1/common/adapter/socket.adapter';
import { JwtService } from '@nestjs/jwt';
import { SocketServerHolder } from './v1/common/socket/socket-server.holder';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  const socketServerHolder = app.get(SocketServerHolder);
  app.useWebSocketAdapter(
    new AuthenticatedSocketAdapter(app, new JwtService(), socketServerHolder),
  );

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
