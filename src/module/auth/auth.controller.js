import jwt from 'jsonwebtoken'; // JWT for token creation
import bcrypt from 'bcrypt'; // Bcrypt for password hashing/comparison
import { AppError } from '../../utils/AppError.js'; // Custom error handling class
import { catchError } from '../../utils/catchError.js'; // Error handling middleware
import { User } from '../../../data-base/models/user.model.js';

import nodemailer from "nodemailer";
import { HTML } from '../../utils/html.js';




const sendEmail = catchError(async (req, res, next) => {

    // Create a transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE, // Moved to env variable for flexibility
      auth: {
        user: process.env.EMAIL_USER, // Email from environment variable
        pass: process.env.EMAIL_PASSWORD, // Password from environment variable
      },
    });
  
    const otp = (Math.floor(100000 + Math.random() * 900000)).toString();
  
    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"Ahmed Nasser" <${process.env.EMAIL_USER}>`, // Sender address
      to: req.body.email, // List of receivers
      subject: "Authorization", // Subject line
      text: "Welcome..!", // Plain text body
      html: HTML(otp), // HTML body
    });
  
    req.body.OTP = otp;
    req.body.passwordChangedAt = Date.now();
    
    // Hash the password before saving
    req.body.password = await bcrypt.hash(req.body.password, 10);
  
    const user = new User(req.body);
    await user.save();
  
    console.log("Message sent to:", req.body.email);
  
    res.json({ message: 'Email sent successfully' });
  });
  
const configurationOTP = catchError(async (req, res, next) => {
  
    let user = await User.findOneAndUpdate({ OTP: req.body.otp }, { confEmail: true , OTP : null },{new : true});
  
    if (!user) {
      return next(new AppError('some issue in OTP authorization'));
    }
  
    // Generate JWT token for the new user
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_KEY);
  
    res.status(201).json({ message: 'User added successfully', user, token });
  });
  
// Signin function to authenticate an existing user
const signin = catchError(async (req, res, next) => { 
    const user = await User.findOne({ email: req.body.email });

    // Check if user exists and password matches
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
        // Update passwordChangedAt on successful sign in
        user.passwordChangedAt = Date.now();
        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_KEY);
        return res.status(200).json({ message: 'User authenticated successfully', user, token });
    }

    return next(new AppError('Invalid email or password', 401));
});

// Change password function
const changePassword = catchError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    // Check if user exists and old password matches
    if (user && bcrypt.compareSync(req.body.oldPassword, user.password)) {
        // If new password is the same as the old password, return an error
        if (bcrypt.compareSync(req.body.newPassword, user.password)) {
            return next(new AppError('This password is already the old password', 400));
        }

        // Hash the new password before saving
        user.password = bcrypt.hashSync(req.body.newPassword, 10);
        user.passwordChangedAt = Date.now();
        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_KEY);
        return res.status(200).json({ message: 'Password changed successfully', user, token });
    }

    return next(new AppError('Invalid email or password', 401));
});

// Protect routes middleware to secure endpoints
const protectedRoutes = catchError(async (req, res, next) => {
    const { token } = req.headers; // Extract token from headers

    // Check if token exists
    if (!token) {
        return next(new AppError('Missing token..!', 401));
    }

    try {
        const userPayload = await jwt.verify(token, process.env.JWT_KEY); // Verify the JWT token
        const user = await User.findById(userPayload.id);

        // If user is not found, return error
        if (!user) {
            return next(new AppError('User not found..!', 401));
        }
        
        if (!user.isBlocked) {
            return next(new AppError('User is blocked..!', 401));
        }

        if (user.confEmail) {
            return next(new AppError('User not authorized..!', 401));
        }

        // Check if the token was issued before the user changed their password
        if (user.passwordChangedAt && userPayload.iat < parseInt(user.passwordChangedAt.getTime() / 1000)) {
            return next(new AppError('Token time issue..!', 401));
        }
        

        // Attach the user object to the request for further use
        req.user = user; 
        return next(); // Proceed to the next middleware
    } catch (err) {
        return next(new AppError('Invalid token', 401)); // Handle token verification error
    }
});

// Role-based access control middleware
const allowedTo = (...roles) => {
    return catchError(async (req, res, next) => {
        // Check if the user's role is included in the allowed roles
        if (!roles.includes(req.user.role)) {
            return next(new AppError('Role not authorized..!', 401));
        }
        return next(); // Proceed to the next middleware
    });
};



// Export the functions for use in other parts of the app
export {
    changePassword,
    signin,
    protectedRoutes,
    allowedTo,
    sendEmail,
    configurationOTP
};
