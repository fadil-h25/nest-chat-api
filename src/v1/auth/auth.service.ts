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
import { DatabaseService } from 'src/database/database.service';

import { generateOpaqueToken, getRefreshTokenExpiry } from './auth.util';

import { AccessTokenPayload } from '../common/types/auth/access-token-payload.type';
import { Role } from '../common/enum/role.enum';
import { LoginResDto } from './dto/res/login-res.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private databaseService: DatabaseService,
  ) {}

  async register(data: RegisterReq): Promise<void> {
    this.logger.debug(
      'register called',
      createLoggerMeta('auth', AuthService.name),
    );
    await this.userService.addNewUser(data);
  }

  async login(data: LoginReq): Promise<LoginResDto> {
    this.logger.debug(
      'login called',
      createLoggerMeta('auth', AuthService.name),
    );
    const user = await this.userService.getUserByEmail(data.email);
    if (!user) throw new UnauthorizedException('Email or password incorrect');
    const result = await bcrypt.compare(data.password, user?.password);
    if (result == false)
      throw new UnauthorizedException('Email or password incorrect');
    const accessToken = await this.createAccessToken(user.id, [Role.User]);
    const refreshToken = await this.createRefreshToken(user.id);
    return {
      accessToken,
      refreshToken,
    };
  }

  async createRefreshToken(userId: number): Promise<string> {
    const refreshToken = generateOpaqueToken();
    const expire = getRefreshTokenExpiry();

    const hanshedToken = await bcrypt.hash(refreshToken, 10);

    await this.databaseService.refreshToken.create({
      data: {
        tokenHash: hanshedToken,
        userId: userId,
        expiresAt: expire,
      },
    });
    return refreshToken;
  }

  async createAccessToken(userId: number, roles: Role[]): Promise<string> {
    const payload: AccessTokenPayload = { sub: userId, roles };
    return await this.jwtService.signAsync(payload, {
      expiresIn: '30',
    });
  }
}
