import { HttpStatus, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export function mapPrismaError(
  exception: Prisma.PrismaClientKnownRequestError,
  logger: Logger,
) {
  switch (exception.code) {
    case 'P2002':
      return {
        statusCode: HttpStatus.CONFLICT,
        message: 'Data already exists',
        meta: exception.meta,
      };

    case 'P2025':
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Requested record not found',
        meta: exception.meta,
      };

    case 'P2003':
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Foreign key constraint failed — related record not found',
        meta: exception.meta,
      };

    default:
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      };
  }
}
