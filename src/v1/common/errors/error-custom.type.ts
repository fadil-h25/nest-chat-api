export class ErrorCustom extends Error {
  statusCode: number;
  field: string;
  message: string;

  constructor(statusCode: number, field: string, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.field = field;
    this.message = message;
  }
}
