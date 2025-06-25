// src/common/middleware/socket-auth.middleware.ts

import { JwtService } from '@nestjs/jwt';
import { parse } from 'cookie';
import { Socket } from 'socket.io';

export function socketAuthMiddleware(jwtService: JwtService) {
  return (socket: Socket, next: (err?: Error) => void) => {
    const rawCookie = socket.handshake.headers.cookie || '';
    const cookies = parse(rawCookie);
    const token = cookies['chat-token'];

    if (!token) {
      return next(new Error('Unauthorized'));
    }

    try {
      const payload = jwtService.verify(token);
      (socket as any).user = payload;
      next();
    } catch (err) {
      return next(new Error('Invalid token'));
    }
  };
}
