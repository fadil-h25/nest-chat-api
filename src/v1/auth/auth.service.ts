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

import { Role } from '../common/enum/role.enum';
import { LoginResDto } from './dto/res/login-res.dto';
import { AccessTokenPayload } from './types/access-token-payload.type';
import { RefreshResDto } from './dto/res/refresh-res.dto';
import { Prisma } from '@prisma/client';

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

  async refresh(
    refreshToken: string,
    user: AccessTokenPayload,
  ): Promise<RefreshResDto> {
    const hashedToken =
      await this.databaseService.refreshToken.findFirstOrThrow({
        where: {
          userId: user.sub,
        },
      });

    const result = await bcrypt.compare(refreshToken, hashedToken?.tokenHash);

    if (!result) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    let newRefreshToken: string = '';
    const newAccessToken = await this.createAccessToken(user.sub, [Role.User]);

    await this.databaseService.$transaction(async (tx) => {
      await tx.refreshToken.delete({
        where: {
          userId: user.sub,
        },
      });
      newRefreshToken = await this.createRefreshToken(user.sub, tx);
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async createRefreshToken(
    userId: number,
    tx?: Prisma.TransactionClient,
  ): Promise<string> {
    const db = tx || this.databaseService;
    const refreshToken = generateOpaqueToken();
    const expire = getRefreshTokenExpiry();

    const hanshedToken = await bcrypt.hash(refreshToken, 10);

    await db.refreshToken.create({
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
