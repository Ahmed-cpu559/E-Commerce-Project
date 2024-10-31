import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";
import { User } from "../../../data-base/models/user.model.js";

// Update a WishList by ID
const updateWishList = catchError(async (req, res, next) => {
  const updatedWishList = await User.findByIdAndUpdate(
    req.user._id, 
    { $addToSet: { wishList: req.body.product } }, 
    { new: true }
  );
  
  if (!updatedWishList) return next(new AppError('User not found..!'));

  res.status(200).json({ message: "WishList updated successfully", WishList: updatedWishList.wishList });
});

// Remove a WishList by ID
const removeWishList = catchError(async (req, res, next) => {
  const removedWishList = await User.findByIdAndUpdate(
    req.user._id, 
    { $pull: { wishList: req.params.id } }, 
    { new: true }
  );
  
  if (!removedWishList) return next(new AppError('User not found..!'));

  res.status(200).json({ message: "WishList removed successfully", WishList: removedWishList.wishList });
});

// Get user WishList by ID
const userWishList = catchError(async (req, res, next) => {
  const userWishList = await User.findById(req.user._id).populate('wishList');
  
  if (!userWishList) return next(new AppError('User not found..!'));

  res.status(200).json({ message: "All WishList retrieved successfully", WishList: userWishList.wishList });
});

export {
  updateWishList,
  removeWishList,
  userWishList
};
