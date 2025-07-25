import { ContactWsEvent } from 'src/v1/common/enum/contact-event';
import { MessageWsEvent } from '../enum/message-event';
import { RelationMemberWsEvent } from '../enum/relation-member-event';
import { WsResponse } from '@nestjs/websockets';

export type WsCustomResponse<
  E extends ContactWsEvent | MessageWsEvent | RelationMemberWsEvent,
  T,
> = {
  event: E;

  data: T;
  statusCode: number;
};

export interface WsCustomResponseAck extends WsResponse {
  statusCode: number;
}
