import { Cart } from "../../../data-base/models/cart.model.js";
import { Coupon } from "../../../data-base/models/coupon.model.js";
import { Product } from "../../../data-base/models/product.model.js";
import { ApiFeature } from "../../utils/API.Feature.js";
import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";

// Helper function to calculate the cart's total price and discount
function calculateCartTotals(cart) {
  cart.totalCartPrice = 0;
  
  cart.cartItems.forEach(item => {
    cart.totalCartPrice += item.price * item.quantity;
  });

  // Apply discount if it exists
  if (cart.discount) {
    cart.totalCartPriceAfterDiscount = cart.totalCartPrice - ((cart.discount / 100) * cart.totalCartPrice);
  }
}

// Add a new cart or update an existing one
const addToCart = catchError(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user._id });

  // Fetch product details to check stock and current price
  const product = await Product.findById(req.body.product);
  if (!product) return next(new AppError('Product not found..!', 404));

  req.body.price = product.price; // Set the price to the current product price

  // If the cart doesn't exist, create a new one
  if (!cart) {
    cart = new Cart({
      user: req.user._id,
      cartItems: [req.body],
      isAdded: true
    });
  } else {
    // Check if the product exists in the cart and validate stock availability
    const item = cart.cartItems.find(item => item.product.equals(req.body.product));
    
    // Validate stock availability
    if ((item && req.body.quantity + item.quantity > product.stock) || (!item && req.body.quantity > product.stock)) {
      return next(new AppError('Sold out', 404));
    }

    // Update quantity if item exists, or add a new item if it doesn't
    if (item) {
      item.quantity += req.body.quantity || 1;
    } else {
      cart.cartItems.push(req.body);
    }
  }

  calculateCartTotals(cart); // Recalculate cart totals
  await cart.save(); // Save the updated cart

  res.status(200).json({ message: 'Cart updated successfully', cart });
});

// Get all carts with optional filters, pagination, and sorting
const allCart = catchError(async (req, res, next) => {
  const apiFeature = new ApiFeature(Cart.find(), req.query)
    .pagination()
    .select()
    .filter()
    .search()
    .sort();

  const carts = await apiFeature.mongooseQuery;
  apiFeature.responseDetails.count = await Cart.countDocuments();

  if (carts.length === 0) {
    return next(new AppError("No carts found", 404));
  }

  res.status(200).json({ message: "Success", Details: apiFeature.responseDetails, carts });
});

// Get a single cart by user ID
const getCart = catchError(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return next(new AppError("Cart not found", 404));

  calculateCartTotals(cart); // Recalculate cart totals
  await cart.save();

  res.status(200).json({ message: "Success", cart });
});

// Remove an item from the cart by item ID
const removeItemFromCart = catchError(async (req, res, next) => {
  const updatedCart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { cartItems: { _id: req.params.id } } },
    { new: true }
  );

  if (!updatedCart) return next(new AppError('Item not found in cart..!'));

  calculateCartTotals(updatedCart); // Recalculate totals after removal
  await updatedCart.save();

  res.status(200).json({ message: "Item removed successfully", cart: updatedCart });
});

// Completely destroy the cart by user ID
const destroyItemFromCart = catchError(async (req, res, next) => {
  const deletedCart = await Cart.findOneAndDelete({ user: req.user._id });
  if (!deletedCart) return next(new AppError('Cart not found..!'));

  res.status(200).json({ message: "Cart destroyed successfully", deletedCart });
});

// Update a specific item's quantity in the cart by item ID
const updateCart = catchError(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return next(new AppError("Cart not found", 404));

  const item = cart.cartItems.find(temp => temp.product.equals(req.params.id));
  if (!item) return next(new AppError("Item not found", 404));

  item.quantity = req.body.quantity; // Update item quantity
  calculateCartTotals(cart); // Recalculate cart totals

  await cart.save();
  res.status(200).json({ message: "Cart updated successfully", cart });
});

// Apply a coupon to the cart if valid
const applyCoupon = catchError(async (req, res, next) => {
  const coupon = await Coupon.findOne({ codeCoupon: req.body.codeCoupon, expire: { $gte: Date.now() } });
  if (!coupon) return next(new AppError("Oops, coupon invalid...!", 404));

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return next(new AppError("Cart not found", 404));

  cart.discount = coupon.discount; // Set the discount percentage
  calculateCartTotals(cart); // Recalculate cart totals with the discount

  await cart.save();
  res.status(200).json({ message: "Coupon applied successfully", coupon, cart });
});

// Export the cart functions
export {
  addToCart,
  allCart,
  getCart,
  updateCart,
  removeItemFromCart,
  destroyItemFromCart,
  applyCoupon
};
