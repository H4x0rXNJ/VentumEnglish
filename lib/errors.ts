export class ApiError extends Error {
  status: number;
  errorCode: string;

  constructor(status: number, errorCode: string, message?: string) {
    super(message ?? errorCode);
    this.status = status;
    this.errorCode = errorCode;
  }
}
