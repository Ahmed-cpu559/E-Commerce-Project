import { Review } from "../../../data-base/models/review.model.js";
import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";
import { ApiFeature } from "../../utils/API.Feature.js";

// Add a new review
const addReview = catchError(async (req, res, next) => {
  req.body.user = req.user._id;

  // Check if the user has already reviewed this product
  const existingReview = await Review.findOne({ user: req.user._id, product: req.body.product });
  if (existingReview) {
    return next(new AppError("You can't review this product again!", 403));
  }

  const newReview = new Review(req.body);
  await newReview.save();
  res.status(201).json({ message: 'Review added successfully', review: newReview });
});

// Get all reviews
const allReview = catchError(async (req, res, next) => {
  const apiFeature = new ApiFeature(Review.find(), req.query)
    .pagination()
    .select()
    .filter()
    .search()
    .sort();

  const reviews = await apiFeature.mongooseQuery;
  apiFeature.responseDetails.count = await Review.countDocuments();

  if (reviews.length === 0) {
    return next(new AppError("No reviews found", 404));
  }

  res.status(200).json({ message: "Success", details: apiFeature.responseDetails, reviews });
});

// Get a single review by ID
const getReview = catchError(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) return next(new AppError("Review not found", 404));

  res.status(200).json({ message: "Success", review });
});

// Delete a review by ID
const deleteReview = catchError(async (req, res, next) => {
  const review = await Review.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!review) return next(new AppError("Review not found or you don't have permission to delete it", 404));

  res.status(200).json({ message: "Review deleted successfully", review });
});

// Update a review by ID
const updateReview = catchError(async (req, res, next) => {
  const review = await Review.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true });
  if (!review) return next(new AppError("Review not found or you are not authorized to update it", 404));

  res.status(200).json({ message: "Review updated successfully", review });
});

export {
  addReview,
  allReview,
  getReview,
  deleteReview,
  updateReview,
};
