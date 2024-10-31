import mongoose, { Types } from "mongoose";
import bcrypt from "bcrypt"; // Corrected import name from 'bycrypt' to 'bcrypt'

// Define schema for the User model
const schema = new mongoose.Schema(
  {
    // User's name, optionally trimmed to remove whitespace
    name: {
      type: String,
      trim: true // Optionally trim whitespace around the name
    },

    // User's email, required and must be unique, also trimmed
    email: {
      type: String,
      trim: true, // Optionally trim whitespace around the email
      required: true, // Ensure email is required
      unique: true // Ensure email is unique
    },

    // User's password, required for account security
    password: {
      type: String,
      required: true // Ensure password is required
    },

    // User's role, either 'admin' or 'user', default is 'user'
    role: {
      type: String,
      enum: ['admin', 'user'], // Enum values for role
      default: 'user'
    },

    // Email confirmation status
    confEmail: {
      type: Boolean,
      default: false
    },

    // Account blocking status
    isBlocked: {
      type: Boolean,
      default: false
    },

    // Timestamp for when the password was last changed
    passwordChangedAt: {
      type: Date
    },
    // Timestamp for when the password was last changed
    OTP: {
      type: String
    },

    // User's wishlist containing references to products
    wishList: [{ type: Types.ObjectId, ref: "Product" }],

    // User's addresses
    addresses: [{
      city: String,
      country: String,
      street: String,
      postalCode: String,
      phone: String
    }]
  },
  {
    // Include createdAt timestamp, omit updatedAt and versioning (__v field)
    timestamps: { updatedAt: false },
    versionKey: false
  }
);

// Pre-save hook to hash the password before saving to the database
schema.pre('save', function () {
  this.password = bcrypt.hashSync(this.password, 10);
});

// Pre-update hook to hash the password if it is being updated
schema.pre('findOneAndUpdate', function () {
  if (this._update.password) {
    this._update.password = bcrypt.hashSync(this._update.password, 10);
  } else {
    this._update.password = undefined; // Clear password if not provided
  }
});

// Create and export the User model
export const User = mongoose.model('User', schema);
