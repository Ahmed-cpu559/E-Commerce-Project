import Joi from 'joi';

// Validation schema for adding a category
export const categoryVal = Joi.object({
  name: Joi.string()
    .min(2)
    .max(500)
    .required(), // 'name' is required when adding a new category
  
  image: Joi.object({
    fieldname: Joi.string().required(),
    filename: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string().valid('image/png', 'image/jpeg', 'image/jpg', 'image/gif').required(),
    destination: Joi.string().required(),
    size: Joi.number().max(5242880).required(),
    path: Joi.string().required()
  }).required() // 'image' is required when adding a new category
});

