import mongoose from "mongoose";

// Define schema for the Coupon model
const schema = new mongoose.Schema(
  {
    // Unique coupon code, required for each coupon
    codeCoupon: {
      type: String,
      unique: true,
      required: true
    },

    // Discount percentage or amount associated with the coupon
    discount: {
      type: Number,
      required: true
    },

    // Expiration date for the coupon, stored as a string (consider using Date type)
    expire: {
      type: String,
      required: true
    }
  },
  {
    // Only include createdAt timestamp, omit updatedAt
    timestamps: { updatedAt: false },
    versionKey: false  // Disable versioning (__v field)
  }
);

// Pre-save hook: Set expiration date automatically (if needed)
schema.pre('save', function (next) {
  if (!this.expire) {
    this.expire = Date.now();
  }
  next();
});

// Create and export the Coupon model
export const Coupon = mongoose.model('Coupon', schema);
