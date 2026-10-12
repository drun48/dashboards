export class ApiError extends Error {
  statusCode: number;
  constructor(data: { statusCode: number; message: string; stack?: string }) {
    super(data.message);
    this.statusCode = data.statusCode;
    if (data.stack) {
      this.stack = data.stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
