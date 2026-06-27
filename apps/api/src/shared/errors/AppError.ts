export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(
    message: string,
    statusCode = 500,
    code = "INTERNAL_ERROR",
    details?: unknown,
  ) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    this.details = details;

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  // 400
  static badRequest(message: string, details?: unknown) {
    return new AppError(message, 400, "BAD_REQUEST", details);
  }

  // 401
  static unauthorized(message = "Unauthorized") {
    return new AppError(message, 401, "UNAUTHORIZED");
  }

  // 403
  static forbidden(message = "Forbidden") {
    return new AppError(message, 403, "FORBIDDEN");
  }

  // 404
  static notFound(resource: string) {
    return new AppError(`${resource} not found`, 404, "NOT_FOUND");
  }

  // 409
  static conflict(message: string) {
    return new AppError(message, 409, "CONFLICT");
  }

  // 422
  static validationError(message: string, details?: unknown) {
    return new AppError(message, 422, "VALIDATION_ERROR", details);
  }

  // 429
  static tooManyRequests(message = "Too many requests") {
    return new AppError(message, 429, "RATE_LIMIT_EXCEEDED");
  }

  // 500
  static internal(message = "Internal server error") {
    return new AppError(message, 500, "INTERNAL_ERROR");
  }
}
