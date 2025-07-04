import { Status } from 'src/v1/common/enum/status.enum';

export type CustomWsResponse<T> = {
  event: string;
  status: Status;
  data: T;
};
