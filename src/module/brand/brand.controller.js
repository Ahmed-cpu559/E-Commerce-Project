import fs from "fs";
import slugify from "slugify";
import { Brand } from "../../../data-base/models/brand.model.js";
import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";
import { ApiFeature } from "../../utils/API.Feature.js";

// Utility function for file deletion
const deleteFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
        reject(err);
      } else {
        console.log("File deleted successfully");
        resolve();
      }
    });
  });
};

// Add a new brand
const addBrand = catchError(async (req, res) => {
  req.body.slug = slugify(req.body.name);
  req.body.image = req.file.filename;

  const brand = new Brand(req.body);
  await brand.save();

  res.status(201).json({ message: 'Brand added successfully', brand });
});

// Get all brands
const allBrand = catchError(async (req, res, next) => {
  const apiFeature = new ApiFeature(Brand.find(), req.query)
    .pagination()
    .select()
    .filter()
    .search()
    .sort();

  const brand = await apiFeature.mongooseQuery;

  apiFeature.responseDetails.count = await Brand.countDocuments();

  if (brand.length === 0) {
    return next(new AppError("No brand found", 404));
  }

  res.status(200).json({ message: "Success", Details: apiFeature.responseDetails, brand });
});

// Get a single brand by ID
const getBrand = catchError(async (req, res, next) => {
  const brand = await Brand.findById(req.params.id);

  if (!brand) return next(new AppError("Brand not found", 404));

  res.status(200).json({ message: "Success", brand });
});

// Delete a brand by ID
const deleteBrand = catchError(async (req, res, next) => {
  const brand = await Brand.findById(req.params.id);

  if (!brand) return next(new AppError("Brand not found", 404));

  // Check if logo exists before trying to delete it
  if (brand.logo) {
    await deleteFile(`src/uploads/brand/${brand.logo.split('/').pop()}`);
  }

  const deletedBrand = await Brand.findByIdAndDelete(req.params.id);
  
  res.status(204).json({ message: "Brand deleted successfully", brand: deletedBrand });
});

// Update a brand by ID
const updateBrand = catchError(async (req, res, next) => {
  const brand = await Brand.findById(req.params.id);

  if (!brand) return next(new AppError("Brand not found", 404));

  // Delete the old logo file only if a new file is uploaded
  if (req.file) {
    if (brand.logo) {
      await deleteFile(`src/uploads/brand/${brand.logo.split('/').pop()}`);
    }
    req.body.logo = req.file.filename; // Use new logo
  }

  if (req.body.name) req.body.slug = slugify(req.body.name); // Update slug if name changed

  const updatedBrand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true });

  res.status(200).json({ message: "Brand updated successfully", brand: updatedBrand });
});

export {
  addBrand,
  allBrand,
  getBrand,
  deleteBrand,
  updateBrand,
};
