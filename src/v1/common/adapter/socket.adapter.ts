import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions, Socket } from 'socket.io';
import { INestApplicationContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { parse } from 'cookie';
import { getUserIdWs } from 'src/v1/utils/auth/get-user-id.util';

export class AuthenticatedSocketAdapter extends IoAdapter {
  constructor(
    private app: INestApplicationContext,
    private jwtService: JwtService,
  ) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    console.log('createIoServer called');

    const server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: 'http://localhost:3000',
        credentials: true,
      },
    });

    const jwtService = this.app.get(JwtService);

    server.use((socket: Socket, next) => {
      const rawCookie = socket.handshake.headers.cookie || '';
      const cookies = parse(rawCookie);
      const token = cookies['chat-token'];

      if (!token) {
        return next(new Error('SocketAuthError: Missing token'));
      }

      try {
        const payload = jwtService.verify(token);
        (socket as any).user = payload; // simpan user info ke socket.data
        next();
      } catch (err) {
        next(new Error('Unauthorized'));
      }
    });

    return server;
  }
}
