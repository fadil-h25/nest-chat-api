import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './v1/user/user.module';
import { DatabaseModule } from './database/database.module';
import { CommonModule } from './v1/common/common.module';
import { AuthModule } from './v1/auth/auth.module';
import { RelationModule } from './v1/relation/relation.module';
import { RelationMemberModule } from './v1/relation_member/relation_member.module';
import { ContactModule } from './v1/contact/contact.module';

import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtModule } from '@nestjs/jwt';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './v1/common/guard/role.guard';
import { AuthGuard } from './v1/auth/auth.guard';
import { PrismaHttpKnownFilter } from './v1/common/filters/prisma/prisma-http-known/prisma-http-known.filter';
import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';
import { ContactWsModule } from './v1/contact-ws/contact-ws.module';
import { UserWsModule } from './v1/user-ws/user-ws.module';
import { MessageModule } from './v1/message/message.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    UserModule,
    DatabaseModule,
    CommonModule,
    AuthModule,
    RelationModule,
    RelationMemberModule,
    ContactModule,

    WinstonModule.forRoot({
      format: format.combine(format.timestamp(), format.json()),
      level: 'debug',
      transports: [new transports.Console()],
    }),

    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET_KEY'),
        signOptions: {},
      }),
    }),

    ContactWsModule,

    UserWsModule,

    MessageModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_FILTER,
      useClass: PrismaHttpKnownFilter,
    },
  ],
})
export class AppModule {}
