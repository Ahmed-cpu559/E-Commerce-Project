import { Router } from 'express';
import { addUser, allUser, getUser, deleteUser, updateUser } from './user.controller.js';
import { validate } from '../../middleware/validate.js';
import { userVal } from './user.validation.js';
import { checkEmail } from '../../middleware/checkEmail.js';
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js';

export const userRouter = Router();

// Route to add a new user
userRouter.post(
  '/',
  protectedRoutes,
  allowedTo('admin'),
  checkEmail, // Middleware to check if the email is valid and not already used
  validate(userVal), // Validate request body for adding a user
  addUser // Controller function to handle adding the user
);

// Route to get all users
userRouter.get('/', protectedRoutes,allowedTo('admin'),allUser); // Controller function to handle fetching all users

// Route to get a single user by ID
userRouter.get('/:id',protectedRoutes,allowedTo('admin'), getUser); // Controller function to handle fetching a user by ID

// Route to delete a user by ID
userRouter.delete('/:id', protectedRoutes ,allowedTo('admin'),deleteUser); // Controller function to handle deleting a user by ID

// Route to update a user by ID
userRouter.put('/:id', 
  protectedRoutes,
  allowedTo('admin'),
  checkEmail, // Middleware to check email validity before updating
  validate(userVal), // Validate request body for updating a user
  updateUser // Controller function to handle updating the user
);
