import { Router } from 'express';
import { allCart, getCart, updateCart, addToCart, removeItemFromCart, destroyItemFromCart, applyCoupon } from './cart.controller.js';
import { validate } from '../../middleware/validate.js';
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js';
import { CartVal } from './cart.validation.js';

export const cartRouter = Router();

// Route to add a new item to the cart
cartRouter.post('/',protectedRoutes,allowedTo('admin', 'user'),validate(CartVal),addToCart);

// Route to get all carts (for admin)
cartRouter.get('/',protectedRoutes,allowedTo('admin'),allCart);

// Route to get a user's cart
cartRouter.get('/my-cart',protectedRoutes,allowedTo('user', 'admin'), getCart);

// Route to remove a specific item from the cart by item ID
cartRouter.delete('/item/:id',protectedRoutes,allowedTo('admin', 'user'),removeItemFromCart);

// Route to completely destroy the user's cart
cartRouter.delete('/',protectedRoutes,allowedTo('admin', 'user'),destroyItemFromCart);

// Route to update a specific item in the cart
cartRouter.put('/item/:id', protectedRoutes,allowedTo('admin', 'user'),validate(CartVal),updateCart);

// Route to apply a coupon to the user's cart
cartRouter.post('/apply-coupon',protectedRoutes,allowedTo('admin', 'user'),applyCoupon);
