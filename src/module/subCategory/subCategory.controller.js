import slugify from "slugify";
import { SubCategory } from "../../../data-base/models/subCategory.model.js";
import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";
import { ApiFeature } from "../../utils/API.Feature.js"; // Ensure this is imported for pagination, filtering, etc.

// Add a new subcategory
const addSubCategory = catchError(async (req, res) => {
    // Set the createdBy field to the current user's ID
    req.body.createdBy = req.user._id;

    // Generate a slug from the subcategory name
    req.body.slug = slugify(req.body.name);

    // Check for duplicate subcategory with the same slug
    const existingSubCategory = await SubCategory.findOne({ slug: req.body.slug });
    if (existingSubCategory) {
        return next(new AppError("SubCategory with this name already exists", 400));
    }

    // Create a new subcategory instance
    const subCategory = new SubCategory(req.body);
    await subCategory.save();

    // Respond with a success message and the created subcategory
    res.status(201).json({ message: 'SubCategory added successfully', subCategory });
});

// Get all subcategories, optionally filtered by category ID
const allSubCategories = catchError(async (req, res, next) => {
    const ojcFilter = {};
    // If a category ID is provided, filter by that category
    if (req.params.categoryId) ojcFilter.category = req.params.categoryId;

    // Create an API feature instance for pagination, filtering, and sorting
    const apiFeature = new ApiFeature(SubCategory.find(ojcFilter), req.query)
        .pagination()
        .select()
        .filter()
        .search()
        .sort();

    // Execute the mongoose query to get the subcategories
    const subCategories = await apiFeature.mongooseQuery;

    // Update the response details count
    apiFeature.responseDetails.count = await SubCategory.countDocuments(ojcFilter);

    // Check if no subcategories were found
    if (subCategories.length === 0) return next(new AppError("No subcategories found", 404));

    // Respond with the found subcategories
    res.status(200).json({ message: "Success", subCategories });
});

// Get a single subcategory by ID
const getSubCategory = catchError(async (req, res, next) => {
    // Find the subcategory by ID
    const subCategory = await SubCategory.findById(req.params.id);

    // If not found, return a 404 error
    if (!subCategory) return next(new AppError("SubCategory not found", 404));

    // Respond with the found subcategory
    res.status(200).json({ message: "Success", subCategory });
});

// Delete a subcategory by ID
const deleteSubCategory = catchError(async (req, res, next) => {
    // Find and delete the subcategory by ID
    const subCategory = await SubCategory.findByIdAndDelete(req.params.id);

    // If not found, return a 404 error
    if (!subCategory) return next(new AppError("SubCategory not found", 404));

    // Respond with a success message
    res.status(200).json({ message: "SubCategory deleted successfully", subCategory });
});

// Update a subcategory by ID
const updateSubCategory = catchError(async (req, res, next) => {
    // If the name is updated, generate a new slug
    if (req.body.name) {
        req.body.slug = slugify(req.body.name);
    }

    // Find and update the subcategory by ID
    const subCategory = await SubCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });

    // If not found, return a 404 error
    if (!subCategory) return next(new AppError("SubCategory not found", 404));

    // Respond with a success message and the updated subcategory
    res.status(200).json({ message: "SubCategory updated successfully", subCategory });
});

// Exporting the functions for use in the router
export {
    addSubCategory,
    allSubCategories,
    getSubCategory,
    deleteSubCategory,
    updateSubCategory
};
