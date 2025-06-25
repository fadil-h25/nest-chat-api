import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../common/decorator/public.decorator';
import { Reflector } from '@nestjs/core';
import { TokenPayload } from './auth.type';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // 💡 See this condition
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromCookie(request);
    if (!token) {
      throw new UnauthorizedException('Token invalid');
    }
    try {
      const payload: TokenPayload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('SECRET_KEY'),
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    const chat_token = request.cookies['chat-token'] as string;

    return chat_token;
  }
}
