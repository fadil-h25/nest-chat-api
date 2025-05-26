import { Module } from '@nestjs/common';
import { PrismaKnownRequestExceptionFilter } from './filters/prisma-known-request-exception.filters.ts/prisma-known-request-exception.filters.ts.filter';
import { APP_FILTER } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: PrismaKnownRequestExceptionFilter,
    },
  ],
})
export class CommonModule {}
