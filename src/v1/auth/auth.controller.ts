import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { LoginRes, RegisterRes } from './dto/auth-response.dto';

import { ZodValidationPipe } from '../common/pipes/zod-validation/zod-validation.pipe';
import {} from '../common/validation/schemas/user.schema';
import {
  LoginReq,
  LoginSchema,
  RegisterReq,
  RegsiterSchema,
} from '../common/validation/schemas/auth.schema';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { Request, Response } from 'express';

import { Public } from '../common/decorator/public.decorator';
import { LoginResDto } from './dto/res/login-res.dto';
import { getUserIdHttp } from '../utils/auth/get-user-id.util';
import { Refresh } from '../common/decorator/refesh.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  @Public()
  @Post('register')
  async register(
    @Body(new ZodValidationPipe(RegsiterSchema)) body: RegisterReq,
  ): Promise<RegisterRes> {
    await this.authService.register(body);

    return {
      message: 'Register successful',
    };
  }

  @Public()
  @Post('login')
  async login(
    @Res({ passthrough: true }) response: Response,
    @Body(new ZodValidationPipe(LoginSchema)) body: LoginReq,
  ): Promise<LoginRes> {
    const tokens: LoginResDto = await this.authService.login(body);

    response.cookie('chat-token', tokens.accessToken, {
      httpOnly: true,
      maxAge: 30 * 60 * 1000, // 30 menit
      sameSite: 'lax', // atau 'strict' kalau React dan API di port sama
      secure: false, // karena belum HTTPS
    });

    response.cookie('chat-refresh-token', tokens.refreshToken, {
      httpOnly: true,
      maxAge: 30 * 60 * 1000, // 30 menit
      sameSite: 'lax', // atau 'strict' kalau React dan API di port sama
      secure: false, // karena belum HTTPS
    });
    return {
      message: 'Login successful',
    };
  }

  @Refresh()
  @Post('refresh')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    const refreshToken = request.cookies['chat-refresh-token'] as string;
    const tokens = await this.authService.refresh(
      refreshToken,
      getUserIdHttp(request),
    );
    response.cookie('chat-token', tokens.accessToken, {
      httpOnly: true,
      maxAge: 30 * 60 * 1000, // 30 menit
      sameSite: 'lax', // atau 'strict' kalau React dan API di port sama
      secure: false, // karena belum HTTPS
    });

    response.cookie('chat-refresh-token', tokens.refreshToken, {
      httpOnly: true,
      maxAge: 30 * 60 * 1000, // 30 menit
      sameSite: 'lax', // atau 'strict' kalau React dan API di port sama
      secure: false, // karena belum HTTPS
    });

    return {
      message: 'Refresh succesful',
    };
  }
}
