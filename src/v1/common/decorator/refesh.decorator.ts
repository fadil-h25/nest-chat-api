import { SetMetadata } from '@nestjs/common';

export const IS_REFRESH = 'refresh';
export const Refresh = () => SetMetadata(IS_REFRESH, true);
