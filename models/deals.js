const mongoose = require("mongoose");

const dealSchema = mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
    },
    newPrice: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    deal_id: {
      type: String,
    },
    meta_title: {
      type: String,
    },
    meta_description: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Deal", dealSchema);
