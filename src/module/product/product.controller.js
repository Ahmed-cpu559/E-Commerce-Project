import slugify from "slugify";
import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";
import { Product } from "../../../data-base/models/product.model.js";
import { ApiFeature } from "../../utils/API.Feature.js";

// Add a new product
const addProduct = catchError(async (req, res) => {
    // Set additional fields for the product
    req.body.createdBy = req.user._id; // Assign the user ID who created the product
    req.body.slug = slugify(req.body.title); // Create a slug from the product title
    req.body.imageCover = req.files.imageCover[0].filename; // Get the filename of the cover image
    req.body.images = req.files.images.map(file => file.filename); // Map through uploaded images to get filenames

    const product = new Product(req.body); // Create a new product instance
    await product.save(); // Save the product to the database
    res.status(201).json({ message: 'Product added successfully', product }); // Respond with success message
});

// Get all products
const allProduct = catchError(async (req, res, next) => {
    // Create an API feature instance for querying products
    const apiFeature = new ApiFeature(Product.find(), req.query)
        .pagination()
        .select()
        .filter()
        .search()
        .sort();

    const products = await apiFeature.mongooseQuery; // Execute the query
    apiFeature.responseDetails.count = await Product.countDocuments(); // Get total count of products

    // Check if products are found
    if (!products || products.length === 0) {
        return next(new AppError("Products not found", 404));
    }

    // Respond with success message and products
    res.status(200).json({ message: "success", details: apiFeature.responseDetails, products });
});

// Get a product by ID
const getProduct = catchError(async (req, res, next) => {
    const product = await Product.findById(req.params.id); // Find product by ID

    // Check if product is found
    if (!product) {
        return next(new AppError("Product not found", 404));
    }

    // Respond with success message and product details
    res.status(200).json({ message: "success", product });
});

// Delete a product by ID
const deleteProduct = catchError(async (req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.id); // Find and delete product by ID

    // Check if product is found
    if (!product) {
        return next(new AppError("Product not found", 404));
    }

    // Respond with success message and deleted product details
    res.status(200).json({ message: "success", product });
});

// Update a product by ID
const updateProduct = catchError(async (req, res, next) => {
    // If title is updated, also update the slug
    if (req.body.title) {
        req.body.slug = slugify(req.body.title);
    }

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true }); // Find and update product

    // Check if product is found
    if (!product) { // Corrected this line to check for the correct variable
        return next(new AppError("Product not found", 404));
    }

    // Respond with success message and updated product details
    res.status(200).json({ message: "success", product });
});

// Export product controller functions
export {
    addProduct,
    allProduct,
    getProduct,
    deleteProduct,
    updateProduct
};
