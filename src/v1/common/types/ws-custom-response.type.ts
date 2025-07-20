import { ContactWsEvent } from 'src/v1/common/enum/contact-event';
import { MessageWsEvent } from '../enum/message-event';
import { RelationMemberWsEvent } from '../enum/relation-member-event';

export type WsCustomResponse<
  E extends ContactWsEvent | MessageWsEvent | RelationMemberWsEvent,
  T,
> = {
  event: E;

  data: T;
  statusCode: number;
};
