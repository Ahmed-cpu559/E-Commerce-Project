import { Category } from "../../data-base/models/category.model.js";
import { AppError } from "../utils/AppError.js";

// Middleware to check if the category exists in the database
export const checkCategory = async (req, res, next) => {
  try {
    // Attempt to find the category by ID provided in the request body
    const isFound = await Category.findById(req.body.category);

    // If the category is not found, return an error
    if (!isFound) {
      return next(new AppError('Category not found', 404)); // Pass a 404 error to the next middleware
    }

    // If category exists, proceed to the next middleware
    next();
  } catch (error) {
    // Forward unexpected errors to the error handling middleware
    next(error);
  }
};
