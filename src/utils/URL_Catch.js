import { AppError } from "../utils/AppError.js";

// Middleware for handling 404 errors (route not found)
export const URL_Error = (req, res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
};
