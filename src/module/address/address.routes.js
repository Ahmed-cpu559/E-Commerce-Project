import { Router } from 'express';
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js';
import { removeAddress, updateAddress, userAddress } from './address.controller.js';

export const AddressRouter = Router();

// Route to get all addresses for the authenticated user
AddressRouter.get('/', protectedRoutes, allowedTo('user'), userAddress);

// Route to update an address for the authenticated user
AddressRouter.patch('/', protectedRoutes, allowedTo('user'), updateAddress);

// Route to remove a specific address by ID for authenticated users and admins
AddressRouter.delete('/:id', protectedRoutes, allowedTo('user', 'admin'), removeAddress);
