// Import necessary modules and models
import { Coupon } from "../../../data-base/models/coupon.model.js";
import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";
import { ApiFeature } from "../../utils/API.Feature.js";

// Add a new coupon
const addCoupon = catchError(async (req, res) => {
  const coupon = new Coupon(req.body);
  await coupon.save();

  res.status(200).json({ message: 'Coupon added successfully', coupon: coupon });
});

// Get all coupons with pagination, filtering, sorting, and searching
const allCoupon = catchError(async (req, res, next) => {
  const apiFeature = new ApiFeature(Coupon.find(), req.query)
    .pagination() // Implement pagination
    .select() // Select specific fields (if needed)
    .filter() // Filter results based on query
    .search() // Search through coupons
    .sort(); // Sort results

  // Execute the mongoose query
  const coupons = await apiFeature.mongooseQuery;
  apiFeature.responseDetails.count = await Coupon.countDocuments(); // Get total count of coupons

  if (coupons.length === 0) {
    return next(new AppError("No coupons found", 404));
  }

  res.status(200).json({ message: "Success", Details: apiFeature.responseDetails, coupons });
});

// Get a single coupon by ID
const getCoupon = catchError(async (req, res, next) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) return next(new AppError("Coupon not found", 404));

  res.status(200).json({ message: "Success",  coupon });
});

// Update a coupon by ID
const updateCoupon = catchError(async (req, res, next) => {
  const updatedCoupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updatedCoupon) return next(new AppError("Coupon not found", 404));

  res.status(200).json({ message: "Coupon updated successfully", coupon: updatedCoupon });
});

// Delete a coupon by ID
const deleteCoupon = catchError(async (req, res, next) => {
  const deletedCoupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!deletedCoupon) return next(new AppError("Coupon not found", 404));

  res.status(200).json({ message: "Coupon deleted successfully", coupon: deletedCoupon });
});

// Export the coupon controller functions
export {
  addCoupon,
  allCoupon,
  getCoupon,
  updateCoupon,
  deleteCoupon,
};
