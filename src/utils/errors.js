export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const handleValidationError = (error) => {
  if (error.errors) {
    const issues = error.errors.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
    return new AppError(`Validation failed: ${JSON.stringify(issues)}`, 400);
  }
  return new AppError('Validation failed', 400);
};
