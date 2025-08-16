export interface HttpCustomResponse<T = any> {
  success?: boolean; // opsional
  message: string;
  data: T;
}
