const mongoose = require("mongoose");

const coupon = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["product", "shipping", "both"],
      default: "both",
    },
    name: {
      type: String,
      required: true,
    },
    couponCode: {
      type: String,
      required: true,
    },
    productType: {
      type: String,
      enum: ["brand", "category", "all", ""],
      default: "all",
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brands",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categories",
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    noOfUse: {
      type: String,
      enum: ["single", "multiple"],
      default: "single",
    },
    discountPercentage: {
      type: Number,
    },
    discountPrice: {
      type: Number,
    },
    minimumOrderValue: {
      type: Number,
    },
    maxDiscountCap: {
      type: Number,
    },
    couponDescription:{
      type: String
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("coupon", coupon);
