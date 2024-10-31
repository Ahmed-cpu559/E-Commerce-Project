import Joi from "joi";

// Define the Joi schema for coupon validation
export const couponVal = Joi.object({
  codeCoupon: Joi.string()
    .required() // Ensures codeCoupon is required
    .trim() // Removes whitespace from both ends
    .max(50), // Limits the length of codeCoupon to 50 characters for extra security

  discount: Joi.number()
    .required() // Ensures discount is required
    .min(0) // Ensures discount cannot be negative
    .max(100), // Assumes discount is a percentage (adjust if needed)

  expire: Joi.date() // Ensures expire date is required and valid
    .required() // Ensures expire is required
});
