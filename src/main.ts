import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { AuthenticatedSocketAdapter } from './v1/common/adapter/socket.adapter';
import { JwtService } from '@nestjs/jwt';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  app.useWebSocketAdapter(
    new AuthenticatedSocketAdapter(app, new JwtService()),
  );

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
