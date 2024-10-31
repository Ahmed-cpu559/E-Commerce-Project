import Joi from "joi";

// Schema for adding a new subcategory
export const categoryVal = Joi.object({
  
  name: Joi.string()
    .min(2) // Name must have at least 2 characters
    .max(500) // Name must have less than 500 characters
    .required() // Ensure that name is provided
    .messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name must be less than 500 characters long',
      'string.empty': 'Name is required' // Custom error message for empty name
    }),

  category: Joi.string()
    .hex() // Validate that category is a hexadecimal string
    .length(24) // Length of MongoDB ObjectId
    .required() // Ensure that category is provided
    .messages({
      'string.hex': 'Category must be a valid hexadecimal string',
      'string.length': 'Category must be a 24-character string', // Custom error message for invalid length
      'string.empty': 'Category is required' // Custom error message for empty category
    })
});
