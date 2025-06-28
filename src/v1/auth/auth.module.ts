import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [AuthController],
  imports: [UserModule, DatabaseModule],
  providers: [AuthService],
})
export class AuthModule {}
