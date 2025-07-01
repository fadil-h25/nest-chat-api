import { Module } from '@nestjs/common';
import { UserWsGateway } from './user-ws.gateway';

@Module({
  providers: [UserWsGateway],
})
export class UserWsModule {}
