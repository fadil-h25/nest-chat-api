import { WsResponse } from '@nestjs/websockets';
import { WsCustomResponseAck } from '../types/ws-custom-response.type';

export function generateResponseAck(event: string): WsCustomResponseAck {
  return {
    statusCode: 200,
    event,
    data: {},
  };
}
