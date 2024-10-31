import { Router } from 'express';
import { addCategory,allCategories,deleteCategory,getCategory,updateCategory} from './category.controller.js';
import { categoryVal } from './category.validation.js';
import { validate } from '../../middleware/validate.js';
import { uploadSingleFile } from '../../middleware/fileUpload.js';
import { subcategoryRouter } from '../subCategory/subCategory.routes.js';
import { protectedRoutes } from '../auth/auth.controller.js';
import path from 'path';

export const categoryRouter = Router();

// Nested route for subcategories under a specific category
categoryRouter.use('/:categoryId/subcategories', subcategoryRouter);

// Route to add a new category
categoryRouter.post('/',protectedRoutes,uploadSingleFile('image', 'src/uploads/categories/', ['image']),validate(categoryVal),addCategory);

// Route to get all categories
categoryRouter.get('/',protectedRoutes, allCategories);

// Route to get a specific category by ID
categoryRouter.get('/:id', protectedRoutes,getCategory);

// Route to delete a specific category by ID
categoryRouter.delete('/:id', protectedRoutes, deleteCategory);

// Route to update a specific category by ID
categoryRouter.put('/:id',protectedRoutes,uploadSingleFile('image','src/uploads/categories/', ['image']),validate(categoryVal),updateCategory);
