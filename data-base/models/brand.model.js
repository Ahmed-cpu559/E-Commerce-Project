import mongoose, { Types } from "mongoose";

// Define schema for the Brand model
const schema = new mongoose.Schema(
  {
    // Brand name, required and unique with minimum length validation
    name: {
      type: String,
      unique: [true, 'Brand name is required'],
      trim: true,
      required: true,
      minLength: [2, 'This name is too short!']
    },
    // Slug for URL-friendly name, required and stored in lowercase
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    // Image URL or filename
    image: {
      type: String
    },
    // Reference to the user who created this brand
    createdBy: {
      type: Types.ObjectId,
      ref: 'User'
    }
  },
  {
    // Timestamps for createdAt, without auto-update for updatedAt
    timestamps: { updatedAt: false },
    versionKey: false  // Disable versioning (__v field)
  }
);

// Middleware: Modify image URL on document retrieval if image exists
schema.post('init', function (doc) {
  if (doc.image) {
    doc.image = process.env.BASE_URL + `brands/` + doc.image;
  }
});

// Create and export the Brand model
export const Brand = mongoose.model('Brand', schema);
