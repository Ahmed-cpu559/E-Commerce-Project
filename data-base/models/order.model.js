import mongoose, { Types } from "mongoose";

// Define schema for the Order model
const schema = new mongoose.Schema(
  {
    // Reference to the user who placed this order
    user: { type: Types.ObjectId, ref: 'User' },

    // Array of items in the order
    orderItems: [
      {
        // Product reference in the order item
        product: { type: Types.ObjectId, ref: 'Product' },
        // Quantity of the product in this item
        quantity: { type: Number },
        // Price of the product in this item
        price: { type: Number }
      }
    ],

    // Total price of all items in the order
    totalOrderPrice: { type: Number },

    // Shipping address details
    shippingAddress: {
      city: String,
      country: String,
      street: String,
      postalCode: String,
      phone: String
    },

    // Payment type for the order (either 'cash' or 'card')
    paymentType: {
      type: String,
      enum: ['cash', 'card'],
      default: 'cash'
    },

    // Order status for payment
    isPaid: {
      type: Boolean,
      default: false
    },

    // Order status for delivery
    isDelivered: {
      type: Boolean,
      default: false
    },

    // Date and time when the order was paid
    paidAt: Date,

    // Date and time when the order was delivered
    deliveredAt: Date
  },
  {
    // Automatically include createdAt timestamp, omit updatedAt
    timestamps: { updatedAt: false },
    versionKey: false  // Disable versioning (__v field)
  }
);

// Create and export the Order model
export const Order = mongoose.model('Order', schema);
