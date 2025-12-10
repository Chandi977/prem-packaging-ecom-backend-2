const express = require("express");
const {
  AddtoCart,
  alterQuantity,
  getCart,
  getCartCount,
  updateProductTypeAllCoupon,
  removeFromCart,
  emptyCart,
  updateCart,
  updateShippingCoupon,
  updateAllDiscount,
  removeCoupon,
} = require("../controller/cart");
const Router = express.Router();

Router.post("/AddtoCart", AddtoCart);
Router.post("/alterQunatity", alterQuantity);
Router.get("/cart/:id", getCart);
Router.get("/cart/count/:id", getCartCount);
Router.post("/removefromcart", removeFromCart);
Router.post("/emptyCart", emptyCart);
Router.post("/updateCart", updateCart);
Router.post("/updateShippingCoupon", updateShippingCoupon);
Router.post("/updateAllDiscount", updateAllDiscount);
Router.post("/update/coupon/all", updateProductTypeAllCoupon);
Router.post("/remove/coupon", removeCoupon);


module.exports = Router;
