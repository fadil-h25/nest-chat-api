import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { DatabaseService } from '../../database/database.service';

import { GetUserPhoneRes } from './dto/user-response.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { AddNewUserRes } from '../common/validation/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    private readonly databaseService: DatabaseService,
    private configService: ConfigService,
  ) {}

  public async getUserById(userId: number): Promise<User> {
    const user = await this.databaseService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.databaseService.user.findUnique({
      where: {
        email: email,
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

  public async getUserPhone(userId: number): Promise<GetUserPhoneRes> {
    const user = await this.databaseService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        phone: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
