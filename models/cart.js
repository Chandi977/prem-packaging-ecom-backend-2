const mongoose = require("mongoose");

const cart = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
        },
        quantity: {
          type: Number,
        },
        price: {
          type: Number,
        },
        discountPrice: {
          type: Number,
          default: 0,
        },
        totalPackWeight: {
          type: Number,
        },
        packSize: {
          type: Number,
        },
        brand: {
          type: String,
        },
        category: {
          type: String,
        },
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    total_amount: {
      type: Number,
    },
    tax_amount: {
      type: Number,
    },
    discount_amount: {
      type: Number,
      default: 0,
    },
    totalPackWeight: {
      type: Number,
      default: 0,
    },
    shippingDiscountPrice: {
      type: Number,
    },
    shippingDiscountPercentage: {
      type: Number,
    },

    appliedCoupon: {
      type: Boolean,
      default: false,
    },
    couponType: {
      type: String,
    },
    appliedCouponName: {
      type: String,
      default: "",
    },
    totalDiscountPercentage: {
      type: Number,
    },
    totalDiscountPrice: {
      type: Number,
    },
    maxCapDiscount: {
      type: Number,
    },
couponUse: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("cart", cart);
