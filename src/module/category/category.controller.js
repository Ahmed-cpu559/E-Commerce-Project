import fs from "fs";
import path from "path";
import slugify from "slugify";
import { Category } from "../../../data-base/models/category.model.js";
import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";
import { ApiFeature } from "../../utils/API.Feature.js";

const addCategory = catchError(async (req, res) => {
  req.body.slug = slugify(req.body.name);
  req.body.image = req.file.filename;

  const category = new Category(req.body);
  await category.save();
  res.status(201).json({ message: 'Category added successfully', category });
});

const allCategories = catchError(async (req, res, next) => {
  const apiFeatuer = new ApiFeature(Category.find(), req.query)
    .pagination()
    .select()
    .filter()
    .search()
    .sort();

  const categories = await apiFeatuer.mongooseQuery;
  apiFeatuer.responseDetails.count = await Category.countDocuments();

  if (categories.length === 0) {
    return next(new AppError("No categories found", 404));
  }

  res.status(200).json({ message: "success", Details: apiFeatuer.responseDetails, categories });
});

const getCategory = catchError(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) return next(new AppError("Category not found", 404));

  res.status(200).json({ message: "success", category });
});

const deleteCategory = catchError(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) return next(new AppError("Category not found", 404));

  // Delete associated image file if exists
  if (category.image) {
    fs.unlink(path.join("src/uploads/category", category.image), (err) => {
      if (err) console.error("Error deleting file:", err);
      else console.log("File deleted successfully");
    });
  }

  res.status(200).json({ message: "Category deleted successfully", category });
});

const updateCategory = catchError(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) return next(new AppError("Category not found", 404));

  // Delete old image file if a new file is uploaded
  if (category.image && req.file) {
    fs.unlink(path.join("src/uploads/category", category.image), (err) => {
      if (err) console.error("Error deleting file:", err);
      else console.log("File deleted successfully");
    });
  }

  // Update slug if name is provided, and set new image filename if a new image is uploaded
  if (req.body.name) req.body.slug = slugify(req.body.name);
  if (req.file) req.body.image = req.file.filename;

  const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json({ message: "Category updated successfully", category: updatedCategory });
});

export {
  addCategory,
  allCategories,
  getCategory,
  deleteCategory,
  updateCategory,
};
