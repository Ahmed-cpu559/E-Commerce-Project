import Joi from "joi";

// Validation schema for adding a brand
export const BrandVal = Joi.object({
  name: Joi.string()
    .min(2)
    .max(500)
    .required(), // Required constraint for adding a brand
  
  image: Joi.object({
    fieldname: Joi.string().required(),
    filename: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string().valid('image/png', 'image/jpeg', 'image/jpg', 'image/gif').required(),
    destination: Joi.string().required(),
    size: Joi.number().max(5242880).required(), // Limit to 5MB
    path: Joi.string().required()
  }).required(), // Required for adding a brand
  
  slug: Joi.string()
    .min(2)
    .max(500)
    .required(), // Required constraint for adding a brand
});
