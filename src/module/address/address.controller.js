import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";
import { User } from "../../../data-base/models/user.model.js";

// Update an address by ID
const updateAddress = catchError(async (req, res, next) => {
  const updatedAddress = await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { addresses: req.body } }, // Use $addToSet to avoid duplicates
    { new: true }
  );

  // Check if the address was found and updated
  if (!updatedAddress) return next(new AppError('Address not found..!'));

  res.status(200).json({ message: "Address updated successfully", Address: updatedAddress.addresses });
});

// Remove an address by ID
const removeAddress = catchError(async (req, res, next) => {
  const removedAddress = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { addresses: { _id: req.params.id } } }, // Use $pull to remove the address
    { new: true }
  );

  // Check if the address was found and removed
  if (!removedAddress) return next(new AppError('Address not found..!'));

  res.status(200).json({ message: "Address removed successfully", Address: removedAddress.addresses });
});

// Retrieve all addresses for the user
const userAddress = catchError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  
  // Check if the user was found
  if (!user) return next(new AppError('User not found..!'));

  res.status(200).json({ message: "All addresses retrieved successfully", Addresses: user.addresses });
});

export {
  updateAddress,
  removeAddress,
  userAddress
};
