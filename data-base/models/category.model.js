import mongoose, { Types } from "mongoose";

// Define schema for the Category model
const schema = new mongoose.Schema(
  {
    // Category name, required, unique, trimmed, with minimum length validation
    name: {
      type: String,
      unique: [true, 'Category name is required'],
      trim: true,
      required: true,
      minLength: [2, 'This name is too short!']
    },

    // Slug for URL-friendly category name, stored in lowercase
    slug: {
      type: String,
      lowercase: true
    },

    // Image URL or filename for the category
    image: {
      type: String
    },

    // Reference to the user who created this category
    createdBy: {
      type: Types.ObjectId,
      ref: 'User'
    }
  },
  {
    // Only include createdAt timestamp, omit updatedAt
    timestamps: { updatedAt: false },
    versionKey: false  // Disable versioning (__v field)
  }
);

// Middleware: Modify image URL on document retrieval if an image is set
schema.post('init', function (doc) {
  if (doc.image) {
    doc.image = process.env.BASE_URL + `category/` + doc.image;
  }
});

// Create and export the Category model
export const Category = mongoose.model('Category', schema);
