import { Module } from '@nestjs/common';
import { ContactModule } from '../contact/contact.module';
import { ContactWsGateway } from './contact-ws.gateway';

@Module({
  providers: [ContactWsGateway],
  imports: [ContactModule],
})
export class ContactWsModule {}
