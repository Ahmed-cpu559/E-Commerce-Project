import { Router } from 'express';
import { categoryVal } from './subCategory.validation.js';
import { addSubCategory, allSubCategories, getSubCategory, deleteSubCategory, updateSubCategory } from './subCategory.controller.js';
import { validate } from '../../middleware/validate.js';
import { checkCategory } from '../../middleware/checkCategory.js';
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js';

// Create a new router instance for subcategory routes, allowing for parameter merging
export const subcategoryRouter = Router({ mergeParams: true });

// Route to add a new subcategory
subcategoryRouter.route('/',protectedRoutes)
    .post(
        protectedRoutes, // Ensure the user is authenticated
        allowedTo('user', 'admin'), // Check if the user has the right role to add a subcategory
        validate(categoryVal), // Validate the request body for adding a subcategory
        checkCategory, // Middleware to check if the provided category exists
        addSubCategory // Controller function to handle adding the subcategory
    );

// Route to get all subcategories
subcategoryRouter.route('/',protectedRoutes)
    .get(
        allSubCategories // Controller function to handle fetching all subcategories
    );

// Route to handle operations for a specific subcategory by ID
subcategoryRouter.route('/:id',protectedRoutes)
    .get(
        getSubCategory // Controller function to handle fetching a single subcategory by ID
    )
    .delete(
        deleteSubCategory // Controller function to handle deleting a subcategory by ID
    )
    .put(
        validate(categoryVal), // Validate the request body for updating a subcategory
        updateSubCategory // Controller function to handle updating a subcategory by ID
    );
