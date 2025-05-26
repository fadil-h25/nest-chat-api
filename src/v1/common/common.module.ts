import { Global, Module } from '@nestjs/common';
import { PrismaKnownRequestExceptionFilter } from './filters/prisma-known-request-exception/prisma-known-request-exception.filters';
import { APP_FILTER } from '@nestjs/core';
import { ZodValidationPipe } from './pipes/zod-validation/zod-validation.pipe';

@Global()
@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: PrismaKnownRequestExceptionFilter,
    },
    ZodValidationPipe,
  ],
})
export class CommonModule {}
