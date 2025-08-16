import { WsResponse } from '@nestjs/websockets';

export interface WsCustomResponseAck {
  success: boolean; // opsional
  eventName: string; // opsional
  message: string;
}
