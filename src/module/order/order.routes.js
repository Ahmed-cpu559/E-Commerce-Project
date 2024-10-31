import { Router } from 'express';
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js';
import { createCheckOutSession, createOrder, getAllOrder, getUserOrder, webhook } from './order.controller.js';
import express from 'express';
import { validate } from '../../middleware/validate.js';
import { CartVal } from './order.validation.js';

// Create routers for order-related routes and webhook
export const orderRouter = Router();
export const webHook = Router();

// Route to create a new order
orderRouter.post('/', protectedRoutes, allowedTo('admin', 'user'),validate(CartVal), createOrder);

// Route to get all orders (admin access only)
orderRouter.get('/users', protectedRoutes, allowedTo('admin'), getAllOrder);

// Route to get a single user's orders
orderRouter.get('/', protectedRoutes, allowedTo('user', 'admin'), getUserOrder);

// Route to create a checkout session
orderRouter.post('/check_out', protectedRoutes, allowedTo('user', 'admin'), createCheckOutSession);

// Webhook route to handle Stripe events
webHook.post('/api/order/webhook', express.raw({ type: 'application/json' }), webhook);
