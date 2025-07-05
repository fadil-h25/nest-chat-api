import { ContactWsEvent } from 'src/v1/common/enum/contact-event';

export type WsCustomResponse<T> = {
  event: ContactWsEvent;

  data: T;
  statusCode: number;
};
