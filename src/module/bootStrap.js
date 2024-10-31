import { cartRouter } from "./cart/cart.routes.js";
import { authRouter } from "./auth/auth.routes.js";
import { userRouter } from "./user/user.routes.js";
import { orderRouter } from "./order/order.routes.js";
import { brandRouter } from "./brand/brand.routes.js";
import { couponRouter } from "./coupon/coupon.routes.js";
import { reviewRouter } from "./review/review.routes.js";
import { AddressRouter } from "./address/address.routes.js";
import { ProductRouter } from "./product/product.routes.js";
import { categoryRouter } from "./category/category.routes.js";
import { WishListRouter } from "./wishList/wishList.routes.js";
import { subcategoryRouter } from "./subCategory/subCategory.routes.js";

export const bootstrap = (app) => {
  app.use('/api/auth' , authRouter);
  app.use('/api/users' , userRouter);
  app.use('/api/carts' , cartRouter);
  app.use('/api/order' , orderRouter);
  app.use('/api/brands' , brandRouter);
  app.use('/api/coupons' , couponRouter);
  app.use('/api/reviews' , reviewRouter);
  app.use('/api/address' , AddressRouter);
  app.use('/api/products' , ProductRouter);
  app.use('/api/wishList' , WishListRouter);
  app.use('/api/categories' , categoryRouter);
  app.use('/api/subcategories' , subcategoryRouter);
};
