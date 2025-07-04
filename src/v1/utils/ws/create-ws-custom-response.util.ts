import { ContactWsEvent } from 'src/v1/common/enum/contact-event';
import { Status } from 'src/v1/common/enum/status.enum';
import { WsCustomResponse } from 'src/v1/common/types/ws-custom-response.type';

export function createWsCustomResponse<T, E extends ContactWsEvent>(
  event: E,
  data: T,
): WsCustomResponse<T, E> {
  return {
    event,
    data,
    status: Status.OK,
  };
}
