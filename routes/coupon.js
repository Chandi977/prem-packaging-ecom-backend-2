const express = require("express");
const {
  createCoupon,
  getCoupon,
  countCoupon,
  getSingleCoupon,
  getCouponByCouponCode,
  updateCoupon,
  deleteCoupon,
} = require("../controller/coupon");

const router = express.Router();

router.post("/coupon/create", createCoupon);
router.post("/coupon/delete", deleteCoupon);
router.get("/coupon/get/all", getCoupon);
router.get("/coupon/count", countCoupon);
router.put("/coupon/update", updateCoupon);
router.get("/coupon/get/:id", getSingleCoupon);
router.get("/coupon/get/code/:couponCode", getCouponByCouponCode);

module.exports = router;
