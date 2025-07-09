import { ContactWsEvent } from 'src/v1/common/enum/contact-event';
import { MessageWsEvent } from 'src/v1/common/enum/message-event';
import { WsCustomResponse } from 'src/v1/common/types/ws-custom-response.type';

export function createWsCustomResponse<
  E extends ContactWsEvent | MessageWsEvent,
  T,
>(event: E, data: T, statusCode: number): WsCustomResponse<E, T> {
  return {
    event,
    data,
    statusCode,
  };
}
