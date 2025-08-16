import { HttpCustomResponse } from '../response/http-custom-response.type';

export function generateHttpCustomResponse<T = any>(
  data: T,
  success: true,
  message: string,
): HttpCustomResponse<T> {
  return {
    success,
    message,
    data,
  };
}
