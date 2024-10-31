import Joi from "joi";

// Validation schema for adding a user
export const userVal = Joi.object({
  name: Joi.string().trim().min(3).max(30).optional(), // Name is optional but must be between 3 and 30 characters
  email: Joi.string().email().trim().required(), // Email is required and must be valid
  password: Joi.string().min(8).required(), // Password is required and must be at least 8 characters long
  role: Joi.string().valid('admin', 'user').default('user'), // Role can only be 'admin' or 'user', defaults to 'user'
  confEmail: Joi.boolean().default(false), // Confirmation email flag, defaults to false
  isBlocked: Joi.boolean().default(false), // User blocked status, defaults to false
}).unknown(true); // Allow unknown fields

