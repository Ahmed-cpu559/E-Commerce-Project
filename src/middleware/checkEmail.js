import { User } from "../../data-base/models/user.model.js";
import { AppError } from "../utils/AppError.js";
import { catchError } from "../utils/catchError.js";

// Middleware to check if the email is already registered
export const checkEmail = catchError(async (req, res, next) => {
  // Attempt to find a user with the provided email
  const user = await User.findOne({ email: req.body.email });

  // If a user with the same email exists, return an error
  if (user) {
    return next(new AppError('This email is already registered', 400)); // Pass a 400 error to the next middleware
  }

  // If the email is not registered, proceed to the next middleware
  next();
});
