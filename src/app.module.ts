import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './v1/user/user.module';
import { DatabaseModule } from './database/database.module';
import { CommonModule } from './v1/common/common.module';
import { AuthModule } from './v1/auth/auth.module';
import { RelationModule } from './v1/relation/relation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    DatabaseModule,
    CommonModule,
    AuthModule,
    RelationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
