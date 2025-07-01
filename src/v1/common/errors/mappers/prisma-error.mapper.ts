import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ErrorCustom } from '../error-custom.type';

export function prismaErrorMapper(
  error: PrismaClientKnownRequestError,
): ErrorCustom {
  switch (error.code) {
    case 'P2002': {
      const field = (error.meta?.target as string[])?.[0] ?? 'unknown';
      return new ErrorCustom(
        409,
        field,
        'The data is already in use and must be unique',
      );
    }

    case 'P2025': {
      const field = parseCauseField(error.message);
      return new ErrorCustom(404, field, 'Data not found');
    }

    default: {
      return new ErrorCustom(500, 'internal', 'Internal server error');
    }
  }
}

// Opsional helper: coba ekstrak nama field dari pesan error
function parseCauseField(message: string): string {
  const match = message.match(/`(\w+)`/);
  return match?.[1] ?? 'unknown';
}
