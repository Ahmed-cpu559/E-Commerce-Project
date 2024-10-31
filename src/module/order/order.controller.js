import { Cart } from "../../../data-base/models/cart.model.js";
import { Order } from "../../../data-base/models/order.model.js";
import { Product } from "../../../data-base/models/product.model.js";
import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";
import Stripe from 'stripe';

const stripe = new Stripe('sk_test_51QFFNGDkt9YZFPYxzWvjrsUxNR3ia1t9PW0JjunpD2IOE9gaLGmJMtX6T8TR1iMArfD6J3WbgHpOGQsmUg5l59N500LXB2CWeU');

// Helper function to calculate the cart's total price and discount
function calc(cartParameter) {
  cartParameter.totalCartPrice = 0;
  cartParameter.cartItems.forEach(item => {
    cartParameter.totalCartPrice += item.price * item.quantity; // Calculate total cart price
  });

  // Apply discount if it exists
  if (cartParameter.discount) {
    cartParameter.totalCartPriceAfterDiscount = cartParameter.totalCartPrice - ((cartParameter.discount / 100) * cartParameter.totalCartPrice);
  }
}

// Create a new order
const createOrder = catchError(async (req, res, next) => {
  // Check if the cart exists for the user
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return next(new AppError('Cart not found', 404));

  // Calculate prices
  calc(cart);
  const totalOrderPrice = cart.totalCartPriceAfterDiscount || cart.totalCartPrice;

  // Create a new order
  const order = new Order({
    user: req.user._id,
    orderItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice
  });
  await order.save();

  // Update product stock and sold quantities
  for (const item of order.orderItems) {
    const currentProduct = await Product.findById(item.product);
    if (currentProduct) {
      currentProduct.stock -= item.quantity; // Decrease stock by quantity
      currentProduct.sold += item.quantity; // Increase sold by quantity
      await currentProduct.save(); // Save the updated product
    }
    else return next(new AppError('product not found', 404));
  }

  // Delete the cart after order creation
  await Cart.findByIdAndDelete(cart._id);

  res.status(200).json({ message: 'Order created successfully', order });
});

// Get user order
const getUserOrder = catchError(async (req, res, next) => {
  const order = await Order.findOne({ user: req.user._id }).populate('orderItems.product');
  res.status(200).json({ message: 'Order retrieved successfully', order });
});

// Get all orders
const getAllOrder = catchError(async (req, res, next) => {
  const order = await Order.find();
  res.status(200).json({ message: 'All orders retrieved successfully', order });
});

// Create checkout session for Stripe
const createCheckOutSession = catchError(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return next(new AppError('Cart not found', 404));

  const order = await Order.findOne({ user: req.user._id });
  if (!order) return next(new AppError('Order not found', 404));

  const totalOrderPrice = cart.totalCartPriceAfterDiscount || cart.totalCartPrice;

  // Create a new Stripe checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [{
      price_data: {
        currency: "egp",
        unit_amount: totalOrderPrice * 100, // Amount in cents
        product_data: {
          name: req.user.name // Product name can be customized
        }
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `https://www.facebook.com/ahmed.abdelnasser99`,
    cancel_url: `https://www.facebook.com/`,
    customer_email: req.user.email,
    client_reference_id: req.user.id,
    metadata: req.body
  });

  res.status(200).json({ message: 'Checkout session created successfully', session });
});

// Webhook to handle Stripe events
const webhook = catchError(async (req, res, next) => {
  const sig = req.headers['stripe-signature'].toString();
  
  // Verify the webhook signature
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_ENDPOINT_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle checkout session completed event
  let checkOut = null;
  if (event.type === 'checkout.session.completed') {
    checkOut = event.data.object; // Handle the completed checkout session
  }

  res.json({ message: "success", checkOut });
});

// Export the order functions
export {
  getUserOrder,
  getAllOrder,
  createOrder,
  createCheckOutSession,
  webhook
};
