import { Body, Controller, Get, Post, Res } from '@nestjs/common';
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
import { Response } from 'express';

import { Public } from '../common/decorator/public.decorator';

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
    const token = await this.authService.login(body);

    response.cookie('chat-token', token);
    return {
      message: 'Login successful',
    };
  }

  @Get('test')
  // @UseGuards(AuthGuard)
  sayHay(): string {
    return 'Halo';
  }
}
