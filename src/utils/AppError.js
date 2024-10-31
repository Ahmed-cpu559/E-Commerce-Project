export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    // Ensure the stack trace is captured correctly
    Error.captureStackTrace(this, this.constructor);
  }

  // Optional: Custom toString method for better error logging
  toString() {
    return `${this.name}: ${this.message} (Status Code: ${this.statusCode})`;
  }
}
