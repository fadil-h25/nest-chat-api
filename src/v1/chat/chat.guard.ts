// import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { WsException } from '@nestjs/websockets';
// import { TokenPayload } from '../auth/auth.type';
// import { parse } from 'cookie';
// import { Socket } from 'socket.io';

// @Injectable()
// export class ChatGuard implements CanActivate {
//   constructor(private readonly jwtService: JwtService) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const client: Socket = context.switchToWs().getClient();

//     const rawCookie = client.handshake.headers.cookie;
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
//     const cookies = parse(rawCookie || '');

//     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
//     const token = cookies['chat-token'];

//     if (!token) {
//       client.disconnect(true);
//       return true;
//     }

//     try {
//       const payload: TokenPayload = await this.jwtService.verifyAsync(token);
//       client.user = payload;
//       return true;
//     } catch (err) {
//       throw new WsException('Invalid token');
//     }
//   }
// }
