import { Controller, Get, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { Context } from '../common/types/context,type';
import { getUserIdHttp } from '../utils/auth/get-user-id.util';
import { HttpCustomResponse } from '../common/response/http-custom-response.type';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('/me')
  async getMe(@Req() req): Promise<HttpCustomResponse> {
    const ctx: Context = {
      userId: getUserIdHttp(req),
    };
    const user = await this.userService.getUserById(ctx, ctx.userId);

    return {
      message: 'User retrieved successfully',
      data: user,
      success: true,
    };
  }
}
