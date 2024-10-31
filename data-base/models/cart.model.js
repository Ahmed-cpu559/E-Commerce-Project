import mongoose, { Types } from "mongoose";

// Define schema for the Cart model
const schema = new mongoose.Schema(
  {
    // Reference to the user who owns this cart
    user: { type: Types.ObjectId, ref: 'User' },

    // Array of items in the cart
    cartItems: [
      {
        // Product reference in the cart item
        product: { type: Types.ObjectId, ref: 'product' },
        // Quantity of the product in this item
        quantity: { type: Number },
        // Price of the product in this item
        price: { type: Number }
      }
    ],

    // Total price of all items in the cart
    totalCartPrice: { type: Number },

    // Discount applied to the cart (if any)
    discount: { type: Number },

    // Flag indicating if the item is added
    isAdded: {
      type: Boolean,
      default: false
    },

    // Total cart price after discount (if any)
    totalCartPriceAfterDiscount: { type: Number }
  },
  {
    // Automatically include createdAt timestamp, but exclude updatedAt
    timestamps: { updatedAt: false },
    versionKey: false  // Disable versioning (__v field)
  }
);

// Create and export the Cart model
export const Cart = mongoose.model('Cart', schema);
