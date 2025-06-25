import { PipeTransform, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { ZodSchema } from 'zod';

@Injectable()
export class ZodValidationSocketPipe implements PipeTransform {
  constructor(private schema: ZodSchema<any>) {}

  transform(value: any) {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      throw new WsException(result.error.format());
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result.data;
  }
}
