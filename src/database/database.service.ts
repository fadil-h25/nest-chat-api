import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma'; // atau sesuaikan path-nya

export abstract class DatabaseService {}

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, DatabaseService
{
  async onModuleInit() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await this.$connect();
  }
}
