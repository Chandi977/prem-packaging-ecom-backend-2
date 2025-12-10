var express = require("express");
var rootRouter = express.Router();
const categoryRouter = require("./category");
const subCategoryRouter = require("./subcategory");
const brandRouter = require("./brand");
const productRouter = require("./product");
const authRouter = require("./user");
const dealRouter = require("./deal");
const cartRouter=require("./cart");
const orderRouter=require("./order");
const customerRouter=require("./customer")
const customForm=require("./custom_packaging");
const contactForm=require("./main_website_contact_form")
const subscriptionOrder=require("./subscription_order")
const pincodeRouter=require("./pincode")
const notify = require("./notify")
const resetPassword = require("./resetPassword")
const coupon = require("./coupon")

rootRouter.use(categoryRouter);
rootRouter.use(subCategoryRouter);
rootRouter.use(brandRouter);
rootRouter.use(productRouter);
rootRouter.use(authRouter);
rootRouter.use(dealRouter);
rootRouter.use(cartRouter);
rootRouter.use(orderRouter);
rootRouter.use(customerRouter);
rootRouter.use(customForm);
rootRouter.use(contactForm);
rootRouter.use(subscriptionOrder);
rootRouter.use(pincodeRouter);
rootRouter.use(notify);
rootRouter.use(resetPassword);
rootRouter.use(coupon);

module.exports = rootRouter;
