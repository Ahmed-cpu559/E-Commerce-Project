import { Router } from 'express';
import { addProduct, allProduct, deleteProduct, getProduct, updateProduct } from './product.controller.js';
import { ProductVal } from './product.validation.js';
import { validate } from '../../middleware/validate.js';
import { uploadMixOfFile } from '../../middleware/fileUpload.js';
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js';

export const ProductRouter = Router();

// Route to handle adding a new product and getting all products
ProductRouter.route('/',protectedRoutes)
    .post(
        allowedTo('user', 'admin'),
        // Handle file uploads for the product images
        uploadMixOfFile([
            { name: 'imageCover', maxCount: 1 }, // Cover image
            { name: 'images', maxCount: 10 }      // Additional images
        ], 'src/uploads/products/', ['image'], 99), 
        validate(ProductVal),  // Validate the request body against the schema
        addProduct,               // Add the product
    )
    .get(allProduct); // Get all products

// Route to handle operations for a single product by ID
ProductRouter.route('/:id',protectedRoutes)
    .get(getProduct) // Get a product by ID
    .delete(deleteProduct) // Delete a product by ID
    .put(
        // Handle file uploads for the product images
        uploadMixOfFile([
            { name: 'imageCover', maxCount: 1 }, // Cover image
            { name: 'images', maxCount: 10 }      // Additional images
        ], 'src/uploads/products/', ['image'], 99),
        validate(ProductVal),  // Validate the request body against the schema
        updateProduct,               // Update the product
    );
