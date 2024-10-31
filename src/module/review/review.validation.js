import Joi from 'joi';

// Define the validation schema using Joi
export const reviewVal = Joi.object({
  comment: Joi.string().trim().optional(), // Comment is optional and will be trimmed

  user: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'User ID must be a valid MongoDB ObjectId',
    }), // Validate as a MongoDB ObjectId

  rate: Joi.number()
    .min(0)
    .max(5)
    .required()
    .messages({
      'number.min': 'Rate must be at least 0',
      'number.max': 'Rate must be at most 5',
      'any.required': 'Rate is required',
    }), // Rate must be between 0 and 5 and is required

  product: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'Product ID must be a valid MongoDB ObjectId',
    }) // Validate as a MongoDB ObjectId
    .required() // Product is required
});
