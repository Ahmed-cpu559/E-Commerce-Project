import Joi from "joi";

// Validation schema for adding a cart
export const CartVal = Joi.object({
  user: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/) // Validating MongoDB ObjectId

  , cartItems: Joi.array()
    .items(
      Joi.object({
        product: Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/), // Validating MongoDB ObjectId
        
        quantity: Joi.number().integer().min(1), // Quantity must be a positive integer
        price: Joi.number().positive() // Price must be a positive number
      })
    )
    .min(1) // Cart must contain at least one item

  , totalCartPrice: Joi.number().positive(), // Total cart price must be a positive number

  discount: Joi.number().min(0).default(0), // Discount must be non-negative, defaults to 0

  totalCartPriceAfterDiscount: Joi.number().positive().optional() // Optional field
});

