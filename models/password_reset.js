const mongoose = require("mongoose");

const resetPassword = new mongoose.Schema(
  {
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    otp: {
      type: Number,
      required: true,
    },
    expires_at: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("resetPassword", resetPassword);
