import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { SuccessRegisterDto } from './dto/auth-response.dto';
import { UserService } from '../user/user.service';
import { ZodValidationPipe } from '../common/pipes/zod-validation/zod-validation.pipe';
import {
  AddNewUserDto,
  AddNewUserSchema,
} from '../common/validation/schemas/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(
    @Body(new ZodValidationPipe(AddNewUserSchema)) body: AddNewUserDto,
  ): Promise<SuccessRegisterDto> {
    await this.userService.addNewUser(body);

    return {
      message: 'Register successful',
    };
  }
}
