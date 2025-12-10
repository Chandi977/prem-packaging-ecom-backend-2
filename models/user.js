const mongoose = require("mongoose");

const user = new mongoose.Schema(
  {
    user_id: {
      type: String,
    },
    first_name: {
      type: String,
      min: 5,
      max: 30,
      trim: true,
      required: true,
    },
    last_name: {
      type: String,
      min: 5,
      max: 30,
      trim: true,
    },
    email_address: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobile_number: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "user", "digital marketing", "manager", "calling"],
      default: "user",
    },
    gender: {
      type: String,
      enum: ["male", "female", "nonbinary"],
    },
    contact_address: [],
    profile_image: {
      type: String,
    },
    verification_token: {
      type: String,
    },
    verification_token_expiry: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    couponUsed: {
      type: [String], 
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", user);
