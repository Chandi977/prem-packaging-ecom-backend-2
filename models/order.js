const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    items: [
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
        totalPackWeight: {
          type: Number,
        },
        packSize: {
          type: Number,
        },
      },
    ],
    orderId: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
    address: {
      type: String,
    },
    town: {
      type: String,
    },
    state: {
      type: String,
    },
    pincode: {
      type: String,
    },
    landmark: {
      type: String,
    },
    gstin: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    total: {
      type: Number,
    },
    status: {
      type: String,
      enum: [
        "placed",
        "Payment Done",
        "Payment Verified",
        "Dispatched",
        "Delivered",
      ],
      default: "placed",
    },
    totalPackWeight: {
      type: Number,
    },
    shippingCost: {
      type: Number,
    },
    totalCartValue: {
      type: Number,
    },
    totalOrderValue: {
      type: Number,
    },
    taxableAmount: {
      type: Number,
    },
    paymentStatus: {
      type: String,
      enum: ["Paid", "Payment Processed", "Not Paid", "Payment Verified"],
      default: "Not Paid",
    },
    utrNumber: {
      type: String,
    },
    shippingDate: {
      type: String,
    },
    deliveredDate: {
      type: String,
    },
    trackingId: {
      type: String,
    },
    deliveryPartner: {
      type: String,
    },
    paymentDate: {
      type: Date,
    },
    couponCode: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
