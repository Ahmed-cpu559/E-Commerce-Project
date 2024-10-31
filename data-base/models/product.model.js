import mongoose, { Types } from "mongoose";
import fs from "fs";

// Define schema for the Product model
const schema = new mongoose.Schema(
  {
    // Product title, required, unique, trimmed, with minimum length validation
    title: {
      type: String,
      unique: [true, 'Product title is required'],
      trim: true,
      required: true,
      minLength: [2, 'This title is too short!']
    },

    // Slug for URL-friendly title, stored in lowercase
    slug: {
      type: String,
      lowercase: true,
      required: true
    },

    // Product description, required, trimmed, with length validation
    desc: {
      type: String,
      trim: true,
      required: true,
      minLength: [30, 'Description is too short!'],
      maxLength: [1000, 'Description is too long!']
    },

    // Cover image for the product
    imageCover: String,

    // Array of additional images for the product
    images: [String],

    // Product price and discounted price
    price: {
      type: Number,
      required: true,
      min: 0
    },
    priceAfterDisc: {
      type: Number,
      required: true,
      min: 0
    },

    // Number of items sold
    sold: {
      type: Number,
      default: 0,
      min: 0
    },

    // Stock available for the product
    stock: {
      type: Number,
      min: 0
    },

    // References to category, subcategory, and brand
    category: { type: Types.ObjectId, ref: 'Category' },
    subCategory: { type: Types.ObjectId, ref: 'SubCategory' },
    brand: { type: Types.ObjectId, ref: 'Brand' },

    // Reference to the user who created this product
    createdBy: { type: Types.ObjectId, ref: 'User' },

    // Rating fields
    rateAvg: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    rateCount: {
      type: Number,
      default: 0
    },

    // Counter for tracking views or clicks
    counter: {
      type: Number,
      default: 0
    }
  },
  {
    // Only include createdAt timestamp, omit updatedAt
    timestamps: { updatedAt: false },
    versionKey: false,  // Disable versioning (__v field)
    toJSON: { virtuals: true } // Enable virtual fields in JSON output
  }
);

// Post 'init' hook: Modify image URLs on document retrieval
schema.post('init', function (doc) {
  // Update imageCover URL
  if (doc.imageCover) {
    doc.imageCover = process.env.BASE_URL + `products/` + doc.imageCover;
  }

  // Update URLs for images array
  if (doc.images && doc.images.length > 0) {
    doc.images = doc.images.map(image => process.env.BASE_URL + `products/` + image);
  }
});

// Virtual field: Link to reviews associated with this product
schema.virtual('myReviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'Product'
});

// Pre-query hook: Populate 'myReviews' field automatically in queries
schema.pre("findOne", function () {
  this.populate('myReviews');
});

// Create and export the Product model
export const Product = mongoose.model('Product', schema);
