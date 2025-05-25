import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { DatabaseService } from '../../database/database.service';

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
}
