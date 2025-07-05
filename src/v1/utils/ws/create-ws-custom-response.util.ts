import { ContactWsEvent } from 'src/v1/common/enum/contact-event';

import { WsCustomResponse } from 'src/v1/common/types/ws-custom-response.type';

export function createWsCustomResponse<T>(
  event: ContactWsEvent,
  data: T,
  statusCode: number,
): WsCustomResponse<T> {
  return {
    event,
    data,
    statusCode,
  };
}
