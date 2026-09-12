export class AppError extends Error {
  constructor(message, statusCode = 500, extra = undefined) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.extra = extra;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const BadRequestException = (message = "Bad Request", extra = undefined) =>
  new AppError(message, 400, extra);

export const UnauthorizedException = (message = "Unauthorized", extra = undefined) =>
  new AppError(message, 401, extra);

export const ForbiddenException = (message = "Forbidden", extra = undefined) =>
  new AppError(message, 403, extra);

export const NotFoundException = (message = "Not Found", extra = undefined) =>
  new AppError(message, 404, extra);

export const ConflictException = (message = "Conflict", extra = undefined) =>
  new AppError(message, 409, extra);

export const ValidationException = (message = "Validation Error", extra = undefined) =>
  new AppError(message, 422, extra);

export const InternalServerErrorException = (message = "Internal Server Error", extra = undefined) =>
  new AppError(message, 500, extra);