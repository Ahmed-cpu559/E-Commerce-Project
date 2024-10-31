import { Router } from 'express';
import { reviewVal } from './review.validation.js';
import { addReview, allReview, getReview, deleteReview, updateReview } from './review.controller.js';
import { validate } from '../../middleware/validate.js';
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js';

export const reviewRouter = Router();

// Route to add a new review
reviewRouter.post('/', protectedRoutes, allowedTo('user'), validate(reviewVal), addReview);

// Route to get all reviews
reviewRouter.get('/', protectedRoutes,allReview);

// Route to get a single review by ID
reviewRouter.get('/:id',protectedRoutes, getReview);

// Routes for managing individual reviews (delete and update)
reviewRouter.delete('/:id', protectedRoutes, allowedTo('user', 'admin'), deleteReview);

// Consider validating update input
reviewRouter.put('/:id', protectedRoutes, allowedTo('user'), validate(reviewVal), updateReview); 

export default reviewRouter;
