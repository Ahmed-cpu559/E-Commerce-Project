import mongoose, { Types } from "mongoose";

// Define schema for the SubCategory model
const schema = new mongoose.Schema(
  {
    // Subcategory name, required, unique, trimmed, with minimum length validation
    name: {
      type: String,
      unique: [true, 'Subcategory name is required'],
      trim: true,
      required: true,
      minLength: [2, 'This name is too short!']
    },

    // Slug for URL-friendly subcategory name, stored in lowercase
    slug: {
      type: String,
      lowercase: true, // Corrected from 'lowerCase' to 'lowercase'
      required: true
    },

    // Reference to the parent category of this subcategory
    category: {
      type: Types.ObjectId, // Corrected `objectId` to `ObjectId`
      ref: 'Category',
      required: true // Optional: You might want to keep this field required
    },

    // Reference to the user who created this subcategory
    createdBy: {
      type: Types.ObjectId,
      ref: 'User'
    }
  },
  {
    // Only include createdAt timestamp, omit updatedAt
    timestamps: { updatedAt: false },
    versionKey: false // Disable versioning (__v field)
  }
);

// Create and export the SubCategory model
export const SubCategory = mongoose.model('SubCategory', schema);
