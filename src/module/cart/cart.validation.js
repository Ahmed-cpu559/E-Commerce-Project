import Joi from "joi";

// Validation schema for adding a cart
export const CartVal = Joi.object({
  user: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)  // Validating MongoDB ObjectId
    .optional(),  // Optional field for adding a cart

  cartItems: Joi.array()
    .items(
      Joi.object({
        product: Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/) // Validating MongoDB ObjectId
          .required(),  // Ensure product ID is required
          
        quantity: Joi.number()
          .integer()
          .min(1)
          .required()  // Quantity must be at least 1 and required
          .messages({ 'number.min': 'Quantity must be at least 1.' }),
          
        price: Joi.number().positive()
          .required()  // Price is required for cart items
      })
    )
    .min(1)
    .required(), // At least one item is required in the cart

  totalCartPrice: Joi.number()
    .positive()
    .optional(), // Optional for adding a cart, may be calculated later

  discount: Joi.number()
    .min(0)
    .optional() // Allowing discount to be optional
    .allow(null), // Allow null for the discount if not applied

  totalCartPriceAfterDiscount: Joi.number().positive().optional()
});

