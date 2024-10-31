import mongoose, { Types } from "mongoose";

// Define schema for the Review model
const schema = new mongoose.Schema(
  {
    // Comment text, optional whitespace trimming
    comment: {
      type: String,
      trim: true // Optionally trim whitespace around the comment
    },

    // Reference to the user who wrote the review
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: true // User must be specified
    },

    // Rating given by the user, must be between 0 and 5
    rate: {
      type: Number,
      min: 0,
      max: 5,
      required: true // Rating is required
    },

    // Reference to the product being reviewed
    product: {
      type: Types.ObjectId,
      ref: 'Product',
      required: true // Product must be specified
    }
  },
  {
    // Include createdAt timestamp and exclude updatedAt and versioning (__v field)
    timestamps: { updatedAt: false, versionKey: false }
  }
);

// Create and export the Review model
export const Review = mongoose.model('Review', schema);
