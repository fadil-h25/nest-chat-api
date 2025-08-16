export type HttpCustomErrorResponse<T = any> = {
  success?: boolean; // opsional
  message: string;
  errors: T;
};
