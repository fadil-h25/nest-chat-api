import { ContactWsEvent } from 'src/v1/common/enum/contact-event';
import { Status } from 'src/v1/common/enum/status.enum';

export type WsCustomResponse<T, E extends ContactWsEvent> = {
  event: E;
  status: Status;
  data: T;
};
