/** Typed application errors — the error handler turns these into clean JSON. */
export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(statusCode: number, code: string, message: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace?.(this, AppError);
  }
}

export const BadRequest = (message: string, details?: unknown) =>
  new AppError(400, 'BAD_REQUEST', message, details);

export const Unauthorized = (message = 'Authentication required') =>
  new AppError(401, 'UNAUTHORIZED', message);

export const Forbidden = (message = 'You do not have access to this resource') =>
  new AppError(403, 'FORBIDDEN', message);

export const NotFound = (resource = 'Resource') =>
  new AppError(404, 'NOT_FOUND', `${resource} not found`);

export const Conflict = (message: string) => new AppError(409, 'CONFLICT', message);

export const TooLarge = (message: string) => new AppError(413, 'PAYLOAD_TOO_LARGE', message);

export const ServiceUnavailable = (message: string) =>
  new AppError(503, 'SERVICE_UNAVAILABLE', message);
