import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { DatabaseService } from '../../database/database.service';
import { AddNewUserDto } from '../common/validation/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  public async getUserById(userId: number): Promise<User | null> {
    const user = await this.databaseService.user.findUnique({
      where: {
        id: userId,
      },
    });
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

  public async getUserByPhone(phone: string): Promise<User | null> {
    const user = await this.databaseService.user.findUnique({
      where: {
        phone,
      },
    });

    return user;
  }

  public async addNewUser(newUser: AddNewUserDto): Promise<boolean> {
    await this.databaseService.user.create({
      data: newUser,
    });
    return true;
  }
}
