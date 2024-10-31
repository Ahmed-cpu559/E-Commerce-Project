import { AppError } from "../utils/AppError.js";

// Middleware for validating request body against a Joi schema
export const validate = (schema) => {
  return (req, res, next) => {
    
    // Function to handle validation errors
    function handleError(error) {
      if (!error) {
        next(); // Proceed to the next middleware if no error
      } else {
        // Aggregate all error messages
        const errorMessages = error.details.map(detail => detail.message).join(', ');
        next(new AppError(`Validation error: ${errorMessages}`, 400)); // Pass error to the next middleware
      }
    }

    // Validate single file upload
    if (req.file) {
      const { error } = schema.validate(
        { 
          image: req.file,                // Single image file
          ...req.body,                    // Request body
          ...req.params,                  // Request parameters
          ...req.query                    // Query parameters
        },
        { abortEarly: false } // Do not stop at the first validation error
      );
      handleError(error); // Handle validation error
    } 
    // Validate multiple file uploads
    else if (req.files) {
      const { error } = schema.validate(
        {
          images: req.files.images,            // Array of image files
          imageCover: req.files.imageCover[0], // Single image cover file
          ...req.body,                         // Request body
          ...req.params,                       // Request parameters
          ...req.query                         // Query parameters
        },
        { abortEarly: false } // Do not stop at the first validation error
      );
      handleError(error); // Handle validation error
    } 
    // Validate without files
    else {
      const { error } = schema.validate(
        { 
          ...req.body, 
          ...req.params, 
          ...req.query 
        }, 
        { abortEarly: false } // Don't stop at the first validation error
      );
      handleError(error); // Handle validation error
    }
  };
};
