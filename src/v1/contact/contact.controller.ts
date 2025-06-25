import { Body, Controller, Get, Req } from '@nestjs/common';
import { ContactService } from './contact.service';
import { GetContactRes } from './dto/contact-response.dto';

import { Roles } from '../common/decorator/role.decorator';
import { Role } from '../common/enum/role.enum';
import { UserPayload } from '../common/types/user-payload.type';

import {} from '../common/validation/schemas/contact.schema';

@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get()
  @Roles(Role.Admin, Role.User)
  async getAllContacts(@Req() req): Promise<GetContactRes[]> {
    const user = req.user as UserPayload;

    if (user.roles.includes(Role.Admin)) {
      return this.contactService.getAllContacts();
    }

    return this.contactService.getContacts(user.sub);
  }

  // @Post()
  // @Roles(Role.User)
  // async addNewContact(
  //   @Req() req,
  //   @Body(new ZodValidationPipe(AddNewContact)) body: AddNewContactReq,
  // ): Promise<AddNewUserRes> {
  //   await this.contactService.addNewContact(body);
  //   return {

  //   }
  // }
}
