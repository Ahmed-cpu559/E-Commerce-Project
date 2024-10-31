import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js';
import { addCoupon, allCoupon, deleteCoupon, getCoupon, updateCoupon } from './coupon.controller.js';
import { couponVal } from './coupon.validation.js';

// Create a new router instance for coupon routes
export const couponRouter = Router();

// Apply middleware to protect routes and allow only admin access
couponRouter.use(protectedRoutes, allowedTo('admin'));

// Route to add a new coupon
couponRouter.post('/', protectedRoutes,validate(couponVal), addCoupon);

// Route to get all coupons
couponRouter.get('/', protectedRoutes,allCoupon);

// Route to get a single coupon by ID
couponRouter.get('/:id', protectedRoutes,getCoupon);

// Route to update a coupon by ID
couponRouter.put('/:id', protectedRoutes,validate(couponVal), updateCoupon);

// Route to delete a coupon by ID
couponRouter.delete('/:id',protectedRoutes, deleteCoupon);
