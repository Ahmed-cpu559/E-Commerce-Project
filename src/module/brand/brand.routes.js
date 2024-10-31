import { Router } from 'express';
import { BrandVal } from './brand.validation.js';
import { addBrand, allBrand, getBrand, deleteBrand, updateBrand } from './brand.controller.js';
import { validate } from '../../middleware/validate.js';
import { uploadSingleFile } from '../../middleware/fileUpload.js';
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js';

export const brandRouter = Router();

// Route to add a new brand
brandRouter.post('/', protectedRoutes,allowedTo('admin'), uploadSingleFile('image','src/uploads/brands/',['image']),validate(BrandVal),addBrand);

// Route to get all brands
brandRouter.get('/', protectedRoutes,allBrand);

// Route to get a single brand by ID
brandRouter.get('/:id',protectedRoutes,allowedTo('user', 'admin'), getBrand);

// Route to delete a brand by ID
brandRouter.delete('/:id', protectedRoutes, allowedTo('admin'), deleteBrand);

// Route to update a brand by ID (Consider using PATCH instead of PUT if partially updating)
brandRouter.patch('/:id', protectedRoutes,uploadSingleFile('image','src/uploads/brands/',['image']),validate(BrandVal),updateBrand);
