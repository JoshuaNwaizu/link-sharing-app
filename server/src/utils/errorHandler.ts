// errors/index.ts
export class CustomAPIError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class BadRequestError extends CustomAPIError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class NotFoundError extends CustomAPIError {
  constructor(message: string) {
    super(message, 404);
  }
}

export class UnauthorizedError extends CustomAPIError {
  constructor(message: string) {
    super(message, 401);
  }
}
