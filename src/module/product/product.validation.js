import Joi from "joi";

// Function to define product validation schema
export const ProductVal = () => {
  return Joi.object({
    title: Joi.string()
      .min(2)
      .required()
      .messages({
        'string.min': 'Title must be at least 2 characters long',
        'string.empty': 'Title is required'
      }),
    slug: Joi.string()
      .lowercase()
      .messages({
        'string.empty': 'Slug is required'
      }),
    desc: Joi.string()
      .min(30)
      .max(1000)
      .required()
      .messages({
        'string.min': 'Description must be at least 30 characters long',
        'string.max': 'Description must be less than 1000 characters long',
        'string.empty': 'Description is required'
      }),
    imageCover: Joi.object({
        fieldname: Joi.string().required(),
        filename: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string().valid('image/png', 'image/jpeg', 'image/jpg', 'image/gif').required(),
        destination: Joi.string().required(),
        size: Joi.number().max(5242880).required(), // Max size 5MB
        path: Joi.string().required()
    }).required(), // Required for adding a product
  
    images: Joi.array().items(
      Joi.object({
        fieldname: Joi.string().required(),
        filename: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string()
          .valid('image/png', 'image/jpeg', 'image/jpg', 'image/gif')
          .required(),
        destination: Joi.string().required(),
        size: Joi.number().max(5242880).required(), // Max size 5MB
        path: Joi.string().required(),
      })
    ).min(1).required(), // At least one image is required

    price: Joi.number()
      .min(0)
      .required()
      .messages({
        'number.min': 'Price must be a positive number',
        'any.required': 'Price is required'
      }),
    priceAfterDisc: Joi.number()
      .min(0)
      .required()
      .messages({
        'number.min': 'Price after discount must be a positive number',
        'any.required': 'Price after discount is required'
      }),
    sold: Joi.number().min(0).optional(),
    stock: Joi.number()
      .min(0)
      .optional()
      .messages({
        'number.min': 'Stock must be a non-negative number'
      }),
    category: Joi.string().required().messages({
      'any.required': 'Category is required'
    }),
    subCategory: Joi.string().optional(),
    brand: Joi.string().optional(),
    rateAvg: Joi.number()
      .min(0)
      .max(5)
      .optional()
      .messages({
        'number.min': 'Average rating must be at least 0',
        'number.max': 'Average rating must be at most 5'
      }),
    rateCount: Joi.number().min(0).optional(),
    counter: Joi.number().min(0).optional().default(0),
    createdBy: Joi.string().required().messages({
      'any.required': 'CreatedBy is required'
    })
  });
};
