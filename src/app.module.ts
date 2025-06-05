import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './v1/user/user.module';
import { DatabaseModule } from './database/database.module';
import { CommonModule } from './v1/common/common.module';
import { AuthModule } from './v1/auth/auth.module';
import { RelationModule } from './v1/relation/relation.module';
import { RelationMemberModule } from './v1/relation_member/relation_member.module';
import { ContactModule } from './v1/contact/contact.module';
import { MessageModule } from './v1/message/message.module';

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
    RelationMemberModule,
    ContactModule,
    MessageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
