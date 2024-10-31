import { Router } from 'express';
import { allowedTo, changePassword, configurationOTP, sendEmail, signin } from './auth.controller.js';
import { protectedRoutes } from './auth.controller.js'; // Ensure to import protected routes if needed

export const authRouter = Router();

// User Signup step 1
authRouter.post('/signup', sendEmail);

// User Signup step 2
authRouter.post('/signup/OTP', configurationOTP);

// User Signin
authRouter.post('/signin',protectedRoutes, signin);
 
// Change User Password
authRouter.patch('/changePassword',allowedTo('user','admin'),protectedRoutes, changePassword); // Protecting the change password route

