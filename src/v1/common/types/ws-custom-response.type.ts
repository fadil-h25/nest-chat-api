import { ContactWsEvent } from 'src/v1/common/enum/contact-event';
import { MessageWsEvent } from '../enum/message-event';

export type WsCustomResponse<E extends ContactWsEvent | MessageWsEvent, T> = {
  event: E;

  data: T;
  statusCode: number;
};
