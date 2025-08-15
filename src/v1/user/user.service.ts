import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { DatabaseService } from '../../database/database.service';

import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { AddNewUserRes } from '../common/validation/schemas/user.schema';
import { UserLoginResponse } from './dto/user-response.dto';
import { Context } from '../common/types/context,type';

@Injectable()
export class UserService {
  constructor(
    private readonly databaseService: DatabaseService,
    private configService: ConfigService,
  ) {}

  public async getUserById(context: Context, userId: number): Promise<User> {
    const user = await this.databaseService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  public async getUserByEmail(
    email: string,
  ): Promise<UserLoginResponse | null> {
    const user = await this.databaseService.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });

    return user;
  }

  public async getUserByPhone(phone: string): Promise<User> {
    const user = await this.databaseService.user.findUniqueOrThrow({
      where: {
        phone,
      },
    });

    return user;
  }

  public async addNewUser(newUser: AddNewUserRes): Promise<boolean> {
    newUser.password = await bcrypt.hash(newUser.password, 10);
    await this.databaseService.user.create({
      data: newUser,
    });
    return true;
  }
}
