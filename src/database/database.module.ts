import { Module } from '@nestjs/common';
import { DatabaseService, PrismaService } from './database.service';

@Module({
  providers: [
    {
      provide: DatabaseService,
      useClass: PrismaService,
    },
  ],
})
export class DatabaseModule {}
