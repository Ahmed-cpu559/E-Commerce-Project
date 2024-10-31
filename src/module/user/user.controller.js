import { User } from "../../../data-base/models/user.model.js";
import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";
import { ApiFeature } from "../../utils/API.Feature.js";

// Add a new user
const addUser = catchError(async (req, res) => { 
  const user = new User(req.body); // Create a new user instance with the request body
  await user.save(); // Save the user to the database
  res.status(200).json({ message: 'User added successfully', user: user }); // Send success response
});

// Get all users
const allUser = catchError(async (req, res, next) => {
  const apiFeature = new ApiFeature(User.find(), req.query) // Initialize API feature for user query
    .pagination()
    .select()
    .filter()
    .search()
    .sort();

  const users = await apiFeature.mongooseQuery; // Execute the query

  apiFeature.responseDetails.count = await User.countDocuments(); // Count total users

  if (users.length === 0) {
    return next(new AppError("No users found", 404)); // Handle case when no users are found
  }

  res.status(200).json({ message: "Success", Details: apiFeature.responseDetails, users }); // Send response with user data
});

// Get a single user by ID
const getUser = catchError(async (req, res, next) => {
  const user = await User.findById(req.params.id); // Find user by ID

  if (!user) return next(new AppError("User not found", 404)); // Handle case when user is not found

  res.status(200).json({ message: "Success", user: user }); // Send user data
});

// Delete a user by ID
const deleteUser = catchError(async (req, res, next) => {
  const user = await User.findById(req.params.id); // Find user by ID

  if (!user) return next(new AppError("User not found", 404)); // Handle case when user is not found

  const deletedUser = await User.findByIdAndDelete(req.params.id); // Delete the user

  res.status(200).json({ message: "User deleted successfully", user: deletedUser }); // Send response
});

// Update a user by ID
const updateUser = catchError(async (req, res, next) => {
  const user = await User.findById(req.params.id); // Find user by ID

  if (!user) return next(new AppError("User not found", 404)); // Handle case when user is not found

  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }); // Update user data

  res.status(200).json({ message: "User updated successfully", user: updatedUser }); // Send response with updated user data
});

export {
  addUser,
  allUser,
  getUser,
  deleteUser,
  updateUser,
};
