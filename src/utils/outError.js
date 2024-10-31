import { catchError } from "./catchError.js";

// Error handling function for code errors
export const handleErrorCode = (err) => {
  console.error('Error in code:', err);
};

// Error handling function for runtime errors
export const handleRuntimeError = (err) => {
  console.error('Error in running code:', err);
};
