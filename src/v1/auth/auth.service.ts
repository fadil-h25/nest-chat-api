import {
  Body,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import {
  LoginReq,
  RegisterReq,
} from '../common/validation/schemas/auth.schema';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { createLoggerMeta } from '../utils/logger/logger.util';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  async register(data: RegisterReq): Promise<void> {
    this.logger.debug(
      'register called',
      createLoggerMeta('auth', AuthService.name),
    );
    await this.userService.addNewUser(data);
  }

  async login(data: LoginReq): Promise<string> {
    this.logger.debug(
      'login called',
      createLoggerMeta('auth', AuthService.name),
    );
    const user = await this.userService.getUserByEmail(data.email);
    if (!user) throw new UnauthorizedException('Email or password incorrect');
    const result = await bcrypt.compare(data.password, user?.password);
    if (result == false)
      throw new UnauthorizedException('Email or password incorrect');

    const payload = { sub: user.id, roles: ['user'] };
    return await this.jwtService.signAsync(payload, {
      expiresIn: '1h',
    });
  }
}
