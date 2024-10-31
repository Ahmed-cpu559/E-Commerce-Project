import { Router } from 'express';
import { removeWishList, updateWishList, userWishList } from './wishList.controller.js';
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js';

export const WishListRouter = Router();

// Get the user's wishlist
WishListRouter.get(
  '/',
  protectedRoutes,
  allowedTo('user'),
  userWishList
);

// Add/update items in the user's wishlist
WishListRouter.patch(
  '/',
  protectedRoutes,
  allowedTo('user'),
  updateWishList
);

// Remove an item from the user's wishlist
WishListRouter.delete(
  '/:id',
  protectedRoutes,
  allowedTo('user', 'admin'),
  removeWishList
);
