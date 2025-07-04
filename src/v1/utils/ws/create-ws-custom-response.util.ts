import { ContactWsEvent } from 'src/v1/common/enum/contact-event';

import { WsCustomResponse } from 'src/v1/common/types/ws-custom-response.type';

export function createWsCustomResponse<T, E extends ContactWsEvent>(
  event: E,
  data: T,
  statusCode: number,
): WsCustomResponse<T, E> {
  return {
    event,
    data,
    statusCode,
  };
}
