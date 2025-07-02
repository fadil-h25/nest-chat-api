import { WsResponse } from '@nestjs/websockets';
import { Status } from '../enum/status.enum';

export interface WsCustomResponse<T = any> extends WsResponse<T> {
  status: Status;
}
