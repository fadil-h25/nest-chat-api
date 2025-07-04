import { ContactWsEvent } from 'src/v1/common/enum/contact-event';

export type WsCustomResponse<T, E extends ContactWsEvent> = {
  event: E;

  data: T;
  statusCode: number;
};
