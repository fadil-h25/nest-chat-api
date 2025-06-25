import { Global, Module } from '@nestjs/common';

import { ZodValidationPipe } from './pipes/zod-validation/zod-validation.pipe';
import { PrismaWsKnownFilter } from './filters/prisma/prisma-ws-known/prisma-ws-known.filter';
import { PrismaHttpKnownFilter } from './filters/prisma/prisma-http-known/prisma-http-known.filter';

@Global()
@Module({
  providers: [ZodValidationPipe, PrismaWsKnownFilter, PrismaHttpKnownFilter],
})
export class CommonModule {}
